var rapi = {
    start: function (kbID, callback) {
        $.ajax({
            type: 'GET',
            url: rapi.yolandaUrl + "/start/" + kbID,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + rapi.APIKey);
            },
            success: function (data, status) {
                rapi.sessionID = data.id;
                rapi.showWhyAnalysis = data.showWhyAnalysis;
                callback(data);
            },
            error: function (data, status) {
                console.error(data, status);
            }
        });
    },
    respond: function (answers, callback) {
        $.ajax({
            type: 'POST',
            url: rapi.yolandaUrl + '/' + rapi.sessionID + "/response",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({answers:answers}),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + rapi.APIKey);
            },
            success: function (data, status) {
                callback(data);
            },
            error: function (data, status) {
                console.error(data);
            }
        });
    },
    query: function(query, callback) {
        $.ajax({
            type: 'POST',
            url: rapi.yolandaUrl + '/' + rapi.sessionID + "/query",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(query),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + rapi.APIKey);
            },
            success: function (data, status) {
                console.log('data', data);
                callback(data);
            },
            error: function (data, status) {
                console.error(data);
            }
        });
    },
    getAgentConfig: function(url, callback) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (agent) {
                callback(agent);
            },
            error: function (data, status) {
                callback(null, data, status);
            }
        });
    },
    setAPIKey: function(key) {
        rapi.APIKey = btoa(key + ':');
    },
    setYolandaURL: function(url) {
        rapi.yolandaUrl = url;
    },
    sessionID: '',
    APIKey: '',
    yolandaUrl: '',
    showWhyAnalysis: false
};




//var request = require('superagent');
//
//function isUrl (item) {
//    return item && item.indexOf('://') != -1;
//}
//
//function buildParams(urlString, b, c) {
//    return {url: urlString, apiKey:b, kmId:c};
//}
//
//function processParameters (a,b,c) {
//    if (isUrl(a)) {
//        return buildParams(a,b,c);
//    } else if (isUrl(b)) {
//        return buildParams(b,a,c);
//    } else if (isUrl(c)) {
//        return buildParams(c,a,b);
//    } else {
//        return null;
//    }
//}
//
//
//function attemptStart(session, allowSwap, callback) {
//    request
//        .get(session.parameters.url + '/start/' + session.parameters.kmId + '')
//        .set('Authorization', 'Basic ' + new Buffer(session.parameters.apiKey + ':').toString('base64'))
//        .end(function (err, response) {
//            if (err && err.message === 'Unauthorized') {
//                if (allowSwap) {
//                    var temp = session.parameters.kmId;
//                    session.parameters.kmId = session.parameters.apiKey;
//                    session.parameters.apiKey = temp;
//                    attemptStart(session, false, callback);
//                } else {
//                    callback(new Error('Failed to start a session'));
//                }
//            } else if (response && response.body && response.body.id) {
//                session.id = response.body.id;
//                callback();
//            } else {
//                callback(err);
//            }
//        });
//}
//
//function doQuery(session, data, callback) {
//    request
//        .post(session.parameters.url + '/' + session.id +  '/query')
//        .send(data)
//        .end(function (error,response){
//            callback(error, error ? null : response.body);
//        });
//}
//
//function doRespond(session, data, callback) {
//    request
//        .post(session.parameters.url + '/' + session.id +  '/response')
//        .send(data)
//        .end(function (error,response){
//            callback(error, error ? null : response.body);
//        });
//}
//
//function RainbirdSession(a, b, c) {
//    this.parameters = processParameters(a, b, c);
//    var p = this.parameters;
//
//    if (!p || (!p.url || !p.apiKey || !p.kmId)) {
//        throw new Error('The Url, apiKey and kmId are all required.');
//    }
//
//    this.start = function (callback) {
//        attemptStart(this, true, callback);
//    };
//
//    this.query = function(data, callback) {
//        doQuery(this, data, callback);
//    }
//
//    this.respond = function(data, callback) {
//        doRespond(this, data, callback);
//    }
//}
//
//module.exports = RainbirdSession;
