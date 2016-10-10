(function() {   //We serve this page wrapped in a div with the api and apiKey properties
                //replace this with your own way of passing in the apikey and target url
    rapi.setAPIKey(d3.select('#init').attr('apiKey'));
    rapi.setYolandaURL(d3.select('#init').attr('api'));
    start();
})();

function start () {
    d3.select('#userInput').on('keyup', checkInputAndHighlightButtons);
    rapi.getAgentConfig( window.location.protocol + "//" + window.location.host + "/agent/" + getIDFromUrl() + "/config", function(agent, error, status)
    {
        if (error) {
            console.error(error, status);
        } else {
            console.log(agent);
            addRBChatLine(agent.agentDescription);
            var autoComplete = [];
            agent.goals.forEach(function(goal) {
                autoComplete.push(goal.description);
                var optionHolder = d3.select('.optionHolder');
                optionHolder
                    .append('div')
                    .classed('responseButton', true)
                    .text(goal.description)
                    .on('click', function() {
                        addUserChatLine(goal.description);
                        removeResponseButtons();
                        rapi.start(agent.kbId, function(data) {
                            if (goal.subjectInstance === 'user provided' || goal.objectInstance === 'user provided') {
                                if (goal.subject) {
                                    addRBChatLine(goal.subject + '?');
                                } else {
                                    addRBChatLine(goal.object + '?');
                                }
                                d3.select('#sendButton').on('click', function() {
                                    addUserChatLine(d3.select('#userInput').property('value'));
                                    var ourQuery = {
                                        subject: goal.subjectInstance ? d3.select('#userInput').property('value') : null,
                                        relationship: goal.rel,
                                        object: goal.objectInstance ? d3.select('#userInput').property('value')  : null
                                    };
                                    rapi.query(ourQuery, handleResponse);
                                    clearUserInput();
                                });
                            } else {
                                var ourQuery = {
                                    subject: goal.subjectInstance ? goal.subjectInstance : null,
                                    relationship: goal.rel,
                                    object: goal.objectInstance ? goal.objectInstance : null
                                };
                                rapi.query(ourQuery, handleResponse);
                            }
                        });
                    });
                addSingularAutoComplete(autoComplete);
            });
        }
    });
}

function getIDFromUrl() {
    var url = window.location.href;
    var urlArray = url.split('/');

    return urlArray[urlArray.length-1];
}

function handleResponse(data) {
    removeRainbirdThinking();
    if (data.question) {
        addQuestion(data.question);
    } else {
        showResults(data.result);
    }
}

function removeResponseButtons () {
    d3.select('.optionHolder').selectAll('.responseButton').remove();
}

function clearUserInput() {
    d3.select('#userInput').property('value', '');
}

function addUserChatLine(text) {
    var chatHolder = d3.select('.chatHolder').select('#rows')
        .append('div')
        .classed('chatLine', true);

    chatHolder
        .append('p')
        .classed('rbchat', true)
        .classed('triangle-isosceles-right', true)
        .text(text);

    addRainbirdThinking();
}

function addRainbirdThinking () {
    var chatHolder = d3.select('.chatHolder').select('#rows')
        .append('div')
        .attr('id', 'loadingGIF')
        .append('img')
        .attr('src', '/public/images/loadingGIF.gif');
}
function removeRainbirdThinking () {
    var chatHolder = d3.select('#loadingGIF').remove();
}

function addRBChatLine (string) {
    var chatHolder = d3.select('.chatHolder').select('#rows')
        .append('div')
        .classed('chatLine', true);
    //chatHolder.append('img')
    //    .attr('src', 'images/icon.png');
    chatHolder
        .append('p')
        .classed('rbchat', true)
        .classed('triangle-isosceles-left', true)
        .text(string);
    return chatHolder
}

function addQuestion (question) {
    addRBChatLine(question.prompt);


    var optionHolder = d3.select('.optionHolder');

    if (question.type === 'First Form') {
        optionHolder
            .append('div')
            .classed('responseButton', true)
            .text('yes')
            .on('click', function() {
                addUserChatLine('Yes');
                removeResponseButtons();
                rapi.respond([{
                    subject: question.subject,
                    relationship: question.relationship,
                    object: question.object,
                    answer: 'yes',
                    cf: 100
                }], handleResponse)
            });
        optionHolder
            .append('div')
            .classed('responseButton', true)
            .text('no')
            .on('click', function() {
                    addUserChatLine('No');
                    removeResponseButtons();
                    rapi.respond([{
                        subject: question.subject,
                        relationship: question.relationship,
                        object: question.object,
                        answer: 'no',
                        cf: 100
                    }], handleResponse)
                }
            );
    } else if (!!~question.type.indexOf('Second Form')) {
        var autoCompleteNames = [];
        $( '#userInput' ).datepicker( "destroy" );
        d3.select('#userInput').classed('hasDatepicker', false);
        if (question.dataType === 'date') {
            $( function() {
                $( "#userInput" ).datepicker();
            } );
        } else {
            question.concepts.forEach(function (conc, i) {  //todo refactor into own function
                autoCompleteNames.push(conc.value);
                if (question.plural) {
                    var checkHolder = optionHolder
                        .append('label')
                        .classed('responseButton', true);

                    checkHolder
                        .append('span')
                        .text(conc.value);

                    checkHolder
                        .append('input')
                        .attr('type', 'checkbox')
                        .on('change', function () {
                            checkHolder
                                .classed('selectedLabel', checkHolder.select('input').property('checked'));
                            if (checkHolder.select('input').property('checked')) {
                                var seperator = '';
                                if (d3.select('#userInput').property('value') !== '') {
                                    seperator = ', ';
                                }
                                d3.select('#userInput').property('value', d3.select('#userInput').property('value') + seperator + conc.value)
                            } else {
                                var userString = d3.select('#userInput').property('value');
                                var splitString = userString.split(/,\s*/);
                                var indexOf = splitString.indexOf(conc.value);
                                if (indexOf !== -1) {
                                    splitString.splice(indexOf, 1);
                                }
                                if (splitString.length) {
                                    splitString.forEach(function (subString, i) {
                                        if (i === 0) {
                                            d3.select('#userInput').property('value', splitString[0]);
                                        } else {
                                            d3.select('#userInput').property('value', d3.select('#userInput').property('value') + ', ' + subString);
                                        }
                                    })
                                } else {
                                    d3.select('#userInput').property('value', '');
                                }

                            }
                        });
                    if (conc.metadata && conc.metadata.en && conc.metadata.en[0] && conc.metadata.en[0].dataType === 'image') {
                        console.log(conc.metadata.en[0].data + '\')');
                        checkHolder
                            .append('div')
                            .style('background-image', 'url(\'' + conc.metadata.en[0].data + '\')')
                            .classed('multiChoiceImage', true);
                    }

                    checkHolder
                        .style('opacity', 0)
                        .transition()
                        .delay(i*100)
                        .duration(250)
                        .style('opacity', 1);

                } else {
                    optionHolder
                        .append('div')
                        .classed('responseButton', true)
                        .text(conc.value)
                        .datum(conc)
                        .on('click', function () {
                                addUserChatLine(conc.value);
                                removeResponseButtons();
                                rapi.respond([{
                                    subject: question.subject,
                                    relationship: question.relationship,
                                    object: conc.value,
                                    cf: 100
                                }], handleResponse);
                            }
                        );
                }
            });
        }
        if (question.plural) {
            addPluralAutoComplete(autoCompleteNames);
        } else {
            addSingularAutoComplete(autoCompleteNames);
        }
        d3.select('#sendButton')
            .on('click', function() {
                send(question);
            });
    }
}

function send(question, input) {
    var response = [];
    var userString = input ? input : d3.select('#userInput').property('value');
    addUserChatLine(userString);

    if (question.plural) {
        var splitString = userString.split( /,\s*/ );
        splitString.forEach(function(substring) {
            if (substring !== '') {
                response.push(
                    {
                        subject: question.type === 'Second Form Object' ? question.subject : substring,
                        relationship: question.relationship,
                        object: question.type === 'Second Form Object' ? substring : question.object,
                        cf: 100
                    }
                )
            }
        });
    } else {
        response.push(
            {
                subject: question.type === 'Second Form Object' ? question.subject : userString,
                relationship: question.relationship,
                object: question.type === 'Second Form Object' ? userString : question.object,
                cf: 100
            }
        )
    }
    clearUserInput();
    removeResponseButtons();
    rapi.respond(response, handleResponse);
}

function checkInputForMatches() {
    var allOptions = d3.selectAll('.responseButton')[0];

    allOptions.forEach(function(html) {
        var option = d3.select(html);
        if (option.select('input').property('checked')) {
            d3.select('#userInput').property('value', d3.select('#userInput').property('value') + ', ' + option.text());
        }
    })
}

function checkInputAndHighlightButtons() {
    var userInputText = d3.select('#userInput').property('value');
    var subStrings = userInputText.split( /,\s*/ );

    var allOptions = d3.selectAll('.responseButton')[0];

    allOptions.forEach(function(html) {
        var option = d3.select(html);

        if (!!~subStrings.indexOf(option.text())) {
            option.select('input')
                .property('checked', true);
            option.classed('selectedLabel', true);
        } else {
            option.select('input')
                .property('checked', false);
            option.classed('selectedLabel', false);
        }
    });
}

function showResults (results) {
    clearUserInput();

    if (results.length) {
        results.forEach(function (result, i) {
            var chatline = addRBChatLine('' + result.subject + ' ' + result.relationshipType + ' ' + result.object);

            chatline.select('p')
                .style('border-top-left-radius', function() { return i === 0 ? '5px' : '2px' });

            chatline
                .style('opacity', 0)
                .transition()
                .delay(i*100)
                .duration(100)
                .style('opacity', 1)

            if (rapi.showWhyAnalysis) {
                chatline.select('p')
                    .append('a')
                    .attr('href', window.location.protocol + '//' + window.location.host +
                        'components/rainbird-analysis-ui/whyAnalysis.html?' + result.factID)
                    .attr('target', '_blank')
                    .append('span')
                    .attr('class', 'glyphicon glyphicon-search')
                    .classed('whyAnalysisButton', true)
                    .on("mouseover", function () {
                        d3.select('#tooltiptext').transition().duration(500).style('opacity', 1);
                    })
                    .on("mouseout", function () {
                        d3.select('#tooltiptext').transition().duration(75).style('opacity', 0);
                    })
                    .on("mousemove", function () {
                        d3.select('#tooltiptext').style('top', d3.event.pageY + 'px');
                        d3.select('#tooltiptext').style('left', d3.event.pageX + 'px');
                    });
            }

            if (i < results.length-1 ) {
                chatline.select('p')
                    .classed('triangle-isosceles-left', false)
                    .classed('triangle-isosceles-left-group', true);
            }

        });
    } else {
        addRBChatLine('Sorry I couldn\'t find an answer');
    }
    start();
}

function addSingularAutoComplete(autoCompleteNames) {
    $( function() {
        $( "#userInput" )
            .autocomplete({
                minLength: 1,
                source: autoCompleteNames
            });
    });
}

function addPluralAutoComplete(autoCompleteNames) {
    $( function() {
        $( function() {
            function split( val ) {
                return val.split( /,\s*/ );
            }
            function extractLast( term ) {
                return split( term ).pop();
            }

            $( "#userInput" )
                .on( "keydown", function( event ) {
                    if ( event.keyCode === $.ui.keyCode.TAB &&
                        $( this ).autocomplete( "instance" ).menu.active ) {
                        event.preventDefault();
                    }
                })
                .autocomplete({
                    minLength: 1,
                    source: function( request, response ) {
                        response( $.ui.autocomplete.filter(
                            autoCompleteNames, extractLast( request.term ) ) );
                    },
                    focus: function() {
                        return false;
                    },
                    select: function( event, ui ) {
                        var terms = split( this.value );
                        terms.pop();
                        terms.push( ui.item.value );
                        terms.push( "" );
                        this.value = terms.join( ", " );
                        return false;
                    }
                });
        } );
    } );
}
