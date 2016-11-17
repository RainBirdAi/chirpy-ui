(function() {   //We serve this page wrapped in a div with the api and apiKey properties
    //replace this with your own way of passing in the apikey and target url
    rapi.setYolandaURL(d3.select('#init').attr('api'));
    start();
})();

function selectGoal(goal) {
    rapi.currentGoal = goal;
    addUserChatLine(goal.description);
    removeResponseButtons();

    var waitForUserProvided = function() {
        addUserChatLine(d3.select('#userInput').property('value'));
        var ourQuery = {
            subject: goal.subjectInstance ? d3.select('#userInput').property('value') : null,
            relationship: goal.rel,
            object: goal.objectInstance ? d3.select('#userInput').property('value')  : null
        };
        rapi.query(ourQuery, handleResponse);
        closeAutoComplete();
        clearUserInput();
    };

    if (goal.subjectInstance === 'user provided' || goal.objectInstance === 'user provided') {
        closeAutoComplete();
        clearUserInput();
        removeRainbirdThinking();
        removeAutoComplete();
        if (goal.subject) {
            addRBChatLine('Which ' + goal.subject + '?');
        } else {
            addRBChatLine('Which ' + goal.object + '?');
        }
        d3.select('#sendButton').on('click', waitForUserProvided);
        d3.select('#userInput').on('keydown', function() {
            if (d3.event.key === 'Enter') {
                waitForUserProvided();
            }
        });
    } else {
        var ourQuery = {
            subject: goal.subjectInstance ? goal.subjectInstance : null,
            relationship: goal.rel,
            object: goal.objectInstance ? goal.objectInstance : null
        };
        rapi.query(ourQuery, handleResponse);
        closeAutoComplete();
        clearUserInput();
    }
}

function start () {
    d3.select('#sendButton').classed('disabled', true);
    d3.select('#sendButton').text('Send');
    d3.select('#userInput').on('keyup', function() {checkInputAndHighlightButtons('');});
    rapi.getAgentConfig( window.location.protocol + "//" + window.location.host + "/agent/" + getIDFromUrl() + "/config", function(error, agent, status)
    {
        if (error) {
            console.error(error, status);
        } else {

            d3.select('#userInput').on('keydown', function() {
                if (d3.event.key === 'Enter') {
                    agent.goals.some(function(goal) {
                        if(goal.description === d3.select('#userInput').property('value')) {
                            selectGoal(goal);
                            return true;
                        }
                    });
                }
            });

            console.log(agent);
            rapi.sessionID = agent.contextId;
            var autoComplete = [];
            agent.goals.forEach(function(goal) {
                autoComplete.push(goal.description);
                var optionHolder = d3.select('.optionHolder');
                optionHolder
                    .append('div')
                    .classed('responseButton', true)
                    .text(goal.description)
                    .on('click', function() {
                        selectGoal(goal);
                    });
                addSingularAutoComplete(autoComplete);
                resizeAndScroll();
            });
        }
    });
}


function getIDFromUrl() {
    var url = window.location.href;
    var urlArray = url.split('/');

    return urlArray[urlArray.length-1];
}

function handleResponse(err, data) {
    removeRainbirdThinking();
    if (err) {
        addRBChatLine('Sorry, error processing your request');
    } else if (data.question) {
        addQuestion(data.question);
    } else {
        showResults(data.result);
    }
    resizeAndScroll();
}

function resizeAndScroll() {
    d3.select('#rows').style('height', function() {
        var height = $('.chatHolder').height() - $('#user-inputs').height() - 40;
        $('#rows').animate({
                scrollTop: $('#innerRows').height()-height+50},
            400,
            "easeOutQuint"
        );
        return height;
    });
}

function removeResponseButtons () {
    d3.select('.optionHolder').selectAll('.responseButton').remove();
}

function clearUserInput() {
    d3.select('#userInput').property('value', '');
    $('#userInput').focus();
}

function addUserChatLine(text) {
    var chatHolder = d3.select('.chatHolder').select('#innerRows')
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
    var chatHolder = d3.select('.chatHolder').select('#innerRows')
        .append('div')
        .attr('id', 'loadingGIF')
        .append('img')
        .attr('src', '/public/images/loadingGIF.gif');
}
function removeRainbirdThinking () {
    var chatHolder = d3.select('#loadingGIF').remove();
}

function addRBChatLine (string) {
    var chatHolder = d3.select('.chatHolder').select('#innerRows')
        .append('div')
        .classed('chatLine', true);

    chatHolder
        .append('p')
        .classed('rbchat', true)
        .classed('triangle-isosceles-left', true)
        .text(string);

    chatHolder
        .style('opacity', 0)
        .transition()
        .duration(100)
        .style('opacity', 1);

    return chatHolder
}

function addQuestion (question) {
    addRBChatLine(question.prompt);
    d3.select('#userInput').on('keyup', function() {checkInputAndHighlightButtons(question);});
    if (question.allowUnknown) {
        d3.select('#sendButton').classed('disabled', false);
        d3.select('#sendButton').text('Skip');
    } else {
        d3.select('#sendButton').classed('disabled', true);
        d3.select('#sendButton').text('Send');
    }

    d3.select('#userInput').on('keydown', function() {
        if (d3.event.key === 'Enter') {
            if (checkInputAndHighlightButtons(question)) {
                send(question);
            } else {
                d3.select('#userInput')
                    .transition()
                    .duration(200)
                    .styleTween('margin-left', function() {
                        return function(t) { return Math.sin(t*Math.PI*10)*10 + 'px'; }
                    });
            }
        }
    });

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
        } else if(question.concepts) {
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
                    var responseButton = optionHolder.append('div');

                    responseButton
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
                    responseButton
                        .style('opacity', 0)
                        .transition()
                        .delay(i*10)
                        .duration(250)
                        .style('opacity', 1);
                }
            });
        }
        if (question.plural) {
            addPluralAutoComplete(autoCompleteNames);
        } else {
            addSingularAutoComplete(autoCompleteNames);
        }
    }
    d3.select('#sendButton') 
        .on('click', function() {
            if (checkInputAndHighlightButtons(question)) {
                send(question);
            }
        });
}

function send(question, input) {
    var response = [];
    var userString = input ? input : d3.select('#userInput').property('value');
    var nonWhiteSpace = userString.search( /\S/ );
    if (!~nonWhiteSpace) {
        addUserChatLine('Skipped');
        response.push({
            subject: question.type === 'Second Form Object' ? question.subject : null,
            relationship: question.relationship,
            object: question.type === 'Second Form Object' ? null : question.object,
            cf: 100,
            unanswered: true
        });
    } else {
        addUserChatLine(userString);
        if (question.plural) {
            var splitString = userString.split(/,\s*/);
            splitString.forEach(function (substring) {
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
    }
    closeAutoComplete();
    clearUserInput();
    removeResponseButtons();
    rapi.respond(response, handleResponse);
}

function closeAutoComplete() {
    $('#userInput').autocomplete('close');
}

function checkInputForMatches() {
    var allOptions = d3.selectAll('.responseButton')[0];

    allOptions.forEach(function(html) {
        var option = d3.select(html);
        if (option.select('input').property('checked')) {
            d3.select('#userInput').property('value', d3.select('#userInput').property('value') + ', ' + option.text());
        }
    });
}

function checkInputAndHighlightButtons(question) {
    var userInputText = d3.select('#userInput').property('value');
    var subStrings = userInputText.split( /,\s*/ );
    var nonWhiteSpace = userInputText.search( /\S/ );

    var allOptions = d3.selectAll('.responseButton')[0];
    var numberMatched = 0;

    allOptions.forEach(function(html) {
        var option = d3.select(html);

        if (!!~subStrings.indexOf(option.text())) {
            option.select('input')
                .property('checked', true);
            option.classed('selectedLabel', true);
            numberMatched++;
        } else {
            option.select('input')
                .property('checked', false);
            option.classed('selectedLabel', false);
        }
    });
    subStrings.forEach(function(subString) {
        if(subString.length === 0) {
            numberMatched++;
        }
    });

    if (!question.canAdd && numberMatched !== subStrings.length) {
        d3.select('#sendButton').classed('disabled', true);
        d3.select('#sendButton').text('Send');
        return false;
    } else if (!!~nonWhiteSpace) {
        d3.select('#sendButton').classed('disabled', false);
        d3.select('#sendButton').text('Send');
        return true;
    } else if (!~nonWhiteSpace && question.allowUnknown) {
        d3.select('#sendButton').classed('disabled', false);
        d3.select('#sendButton').text('Skip');
        return true;
    } else {
        d3.select('#sendButton').classed('disabled', true);
        d3.select('#sendButton').text('Send');
        return false;
    }
}

function showResults (results) {
    clearUserInput();

    if (results.length) {
        results.forEach(function (result, i) {
            var resultText = rapi.currentGoal.text;
            resultText = resultText.replace('%S', result.subject);
            resultText = resultText.replace('%R', result.relationshipType ? result.relationshipType : result.relationship);
            resultText = resultText.replace('%O', result.object);

            var chatline = addRBChatLine(resultText);

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
                        '/components/rainbird-analysis-ui/whyAnalysis.html?id=' + result.factID + '?api=' + rapi.yolandaUrl)
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

function removeAutoComplete() {
    $( function() {
        $( "#userInput" )
            .on( "keydown", function( event ) {
                if (event.keyCode === $.ui.keyCode.TAB) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 1,
                source: [],
                select: function( event, ui ) {
                    this.value = ui.item.value;
                    return false;
                },
                position: { my: "left bottom", at: "left top", collision: "flip" }
            });
    });
}

function addSingularAutoComplete(autoCompleteNames) {
    $( function() {
        $( "#userInput" )
            .on( "keydown", function( event ) {
                if (event.keyCode === $.ui.keyCode.TAB) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 1,
                source: autoCompleteNames,
                select: function( event, ui ) {
                    this.value = ui.item.value;
                    return false;
                },
                position: { my: "left bottom", at: "left top", collision: "flip" }
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
                    if (event.keyCode === $.ui.keyCode.TAB) {
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
                    },
                    position: { my: "left bottom", at: "left top", collision: "flip" }
                });
        } );
    } );
}
