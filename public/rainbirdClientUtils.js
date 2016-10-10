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
                rapi.showWhyAnalysis = agent.showWhyAnalysis;
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
