/**
 * Created by lawrie on 17/11/2016.
 */
var assert = require('assert');
describe('CHIRPY', function() {
    
    function wait() {
        //browser.pause(5000);
    }

    it('should be able to start a goal by clicking the response button', function () {
        browser.url('http://localhost:8079/tests/test1');
        var responseButton = $('.responseButton');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');

        browser.click('#sendCoverage');
        wait();
    });

    it('should be able to start a goal by typing goal name and pressing enter', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'Who speaks what?');
        userInput.keys('\uE007');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');

        browser.click('#sendCoverage');
        wait();
    });

    it('should be able to start a goal by typing goal name clicking send', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'Who speaks what?');
        browser.click('#sendButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');

        browser.click('#sendCoverage');
        wait();
    });

    it('should not be able to start a goal by typing gibberish and pressing enter', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'totally not a goal');
        userInput.keys('\uE007');
        browser.getValue('#userInput');
        assert.equal(browser.getValue('#userInput'), 'totally not a goal');

        browser.click('#sendCoverage');
        wait();
    });

    it('should be able to ask and answer a second form object query', function () { //as in [user provided]-[speaks]-[null]
        browser.url('http://localhost:8079/tests/test1');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        text = browser.getText('.triangle-isosceles-left')[1];
        assert.equal(text, 'Where does Ben live?');

        var string = responseButton.getText();
        assert.equal(string[0], 'England');
        assert.equal(string[1], 'France');

        browser.click('#sendCoverage');
        wait();
    });

    it('should be able to complete one whole query', function () {
        browser.url('http://localhost:8079/tests/test1');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');

        rbchat.waitForExist(5000);
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        responseButton.waitForText('England', 5000);
        browser.click('.responseButton');

        browser.click('#sendCoverage');
        wait();
    });

    it('shouldnt be able to send a response after running a goal', function () {
        browser.url('http://localhost:8079/tests/test1');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');

        rbchat.waitForExist(5000);
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        responseButton.waitForText('England', 5000);
        browser.click('.responseButton');

        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');
        browser.click('#sendButton');
        assert.equal(browser.getValue('#userInput'), 'Ben');

        browser.click('#sendCoverage');
        wait();
    });

    it('should show plurals - clicking should add and remove options from the input field', function () {
        browser.url('http://localhost:8079/tests/testPlural');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        text = browser.getText('.triangle-isosceles-left')[1];
        assert.equal(text, 'Where does Ben live?');

        var string = responseButton.getText();
        assert.equal(string[0], 'England');
        assert.equal(string[1], 'France');

        $('.optionHolder .responseButton:nth-child(1)').click();
        assert.equal(browser.getValue('#userInput'), 'England');
        $('.optionHolder .responseButton:nth-child(2)').click();
        assert.equal(browser.getValue('#userInput'), 'England, France');
        $('.optionHolder .responseButton:nth-child(2)').click();
        assert.equal(browser.getValue('#userInput'), 'England');

        browser.click('#sendCoverage');
    });

    it('should show plurals - typing should highlight response buttons', function () {
        browser.url('http://localhost:8079/tests/testPlural');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        text = browser.getText('.triangle-isosceles-left')[1];
        assert.equal(text, 'Where does Ben live?');

        var string = responseButton.getText();
        assert.equal(string[0], 'England');
        assert.equal(string[1], 'France');

        browser.setValue('#userInput', 'England');

        browser.waitForExist('.selectedLabel',5000);
        assert.equal($('.selectedLabel').getText(), 'England');

        browser.click('#sendCoverage');
    });

    it('Autocomplete should work with plurals', function () {
        browser.url('http://localhost:8079/tests/testPlural');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        text = browser.getText('.triangle-isosceles-left')[1];
        assert.equal(text, 'Where does Ben live?');

        var string = responseButton.getText();
        assert.equal(string[0], 'England');
        assert.equal(string[1], 'France');

        browser.setValue('#userInput', 'Engl');
        browser.pause(1000);
        userInput.keys('\uE015');  //down
        userInput.keys('\uE004');  //tab
        browser.pause(100);
        userInput.keys('F');
        browser.pause(1000);
        userInput.keys('\uE015');
        userInput.keys('\uE004');

        browser.pause(1000);

        assert.equal(userInput.getValue(), 'England, France,');

        browser.click('#sendCoverage');
    });

    it('should be able to start an inference if last response was number only - PEN-180', function () {
        browser.url('http://localhost:8079/tests/testNumberReset');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        browser.setValue('#userInput', 10);
        userInput.keys('\uE007');

        browser.setValue('#userInput', 'Whe');
        browser.pause(1000);
        userInput.keys('\uE015');  //down
        userInput.keys('\uE004');  //tab
        browser.pause(100);
        userInput.keys('\uE007');

        browser.pause(100);

        var text = browser.getText('.triangle-isosceles-left')[3];
        assert.equal(text, 'Which person?');

        browser.click('#sendCoverage');
    });
});
