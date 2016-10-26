var rapi = {
    respond: function (answers, callback) {
        $.ajax({
            type: 'POST',
            url: rapi.yolandaUrl + '/' + rapi.sessionID + "/response",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({answers:answers}),
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
    setYolandaURL: function(url) {
        rapi.yolandaUrl = url;
    },
    sessionID: '',
    yolandaUrl: '',
    showWhyAnalysis: false
};
