var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');

global.__rootDir = __dirname;

var app = express();

app.use('/public', express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../public/images'));
app.use('/components', express.static(__dirname + '/../components'));

app.use(bodyParser.json());
app.use(session({secret: 'vvha7 15 7h15 g1bb3r15h?'}));

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/tests/:id', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('X-Frame-Options', '*');
    return res.render('chatAgent', {
        api: 'http://localhost:8079'
    });
});

////  UNIT TESTS

app.get('/agent/:id/config', function (req, res) {
    var response;

    switch (req.params.id) {
        case 'test1':
            response = {
                agentDescription: "this is a description",
                agentName: "agent name",
                contextId: "test1",
                goals: [
                    {
                        _id: "86f68a6f-9f3b-4727-937d-0fea8c0a98d6",
                        description: "Who speaks what?",
                        rel: "has age of",
                        relIsGoal: false,
                        subject: "person",
                        subjectInstance: "user provided",
                        text: "%O"
                    }],
                kbId: "31cfd00f-e6c5-4c04-b314-0fd81aa8217c",
                kbName: "rb-661",
                kbUser: "lawrie2",
                showWhyAnalysis: false
            };
            break;
    }

    res.send(response);
});

app.post('/:id/query', function(req, res) {
    var response;

    console.log('query', req.params.id);

    switch (req.params.id) {
        case 'test1':
            response = {
                "question": {
                    "subject": "Ben",
                    "dataType": "date",
                    "relationship": "lives in",
                    "type": "Second Form Object",
                    "plural": false,
                    "allowCF": true,
                    "allowUnknown": false,
                    "canAdd": true,
                    "prompt": "Where does Ben live?",
                    "knownAnswers": [],
                    "concepts": [{
                        "conceptType": "country",
                        "type": "string",
                        "value": "England",
                        "name": "England",
                        "fsid": 1739
                    }, {
                        "conceptType": "country",
                        "type": "string",
                        "value": "France",
                        "name": "France",
                        "fsid": 1740}]
                },
                "sid": "dunnowhatthisis"
            };
            break;
    }

    res.send(response);
});

app.post('/:id/response', function(req, res) {
    var response;

    console.log('response', req.params.id);

    switch (req.params.id) {
        case 'test1':
            response = {
                "result": [{
                    "object": "English",
                    "subject": "Ben",
                    "factID": "WA:RF:cc077b38f44fd192f9c382d8f277cb46",
                    "relationship": "speaks",
                    "certainty": 75
                }],
                "stats": {
                    "getDBFact": {"calls": 5, "items": 2, "ms": 22},
                    "callDatasource": {"calls": 0, "ms": 0},
                    "ensureCache": {"ms": 168},
                    "setDBFact": {"calls": 1, "ms": 12},
                    "totalMS": 234,
                    "approxEngineMS": 0,
                    "invocationStartTime": 1479826750276
                },
                "sid": "dunnowhatthisis"
            };
            break;
    }

    res.send(response);
});

app.all('/*', function(req, res) {
    console.log(req.url, req.body);
});

// END UNIT TESTS

app.listen(8079);
console.info('Listening on port ' + 8079);
