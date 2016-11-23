/**
 * Created by lawrie on 17/11/2016.
 */
var assert = require('assert');
describe('webdriver.io page', function() {
    xit('Chirpy title', function () {
        console.log('here1');
        browser.url('http://localhost:8079/public/chirpy.html');
        console.log('here2');
        var title = browser.getTitle();
        console.log(title);
        assert.equal(title, 'Rainbird Chat');
    });

    xit('should be able to start a goal by clicking the response button', function () {
        browser.url('http://localhost:8079/tests/test1');
        var responseButton = $('.responseButton');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
    });

    xit('should be able to start a goal by typing goal name and pressing enter', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'Who speaks what?');
        userInput.keys('\uE007');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
    });

    xit('should be able to start a goal by typing goal name clicking send', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'Who speaks what?');
        browser.click('#sendButton');
        rbchat.waitForExist(5000);
        var text = browser.getText('.triangle-isosceles-left');
        assert.equal(text, 'Which person?');
    });

    xit('should not be able to start a goal by typing gibberish and pressing enter', function () {
        browser.url('http://localhost:8079/tests/test1');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        userInput.waitForExist(5000);
        browser.setValue('#userInput', 'totally not a goal');
        userInput.keys('\uE007');
        browser.getValue('#userInput');
        assert.equal(browser.getValue('#userInput'), 'totally not a goal');
    });

    xit('should be able to ask and answer a second form object query', function () { //as in [user provided]-[speaks]-[null]
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

        assert.equal(responseButton.getText()[0], 'England');
        assert.equal(responseButton.getText()[0], 'France');
    });

    it('should be able to complete one whole query', function () { //as in [user provided]-[speaks]-[null]
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
        console.log(responseButton);
        browser.click('.responseButton');
    });

    it('shouldnt be able to send a response after running a goal', function () { //as in [user provided]-[speaks]-[null]
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
        console.log(responseButton);
        browser.click('.responseButton');

        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');
        browser.click('#sendButton');
        assert.equal(browser.getValue('#userInput'), 'Ben');
    });

    it('should show date picker', function () { //as in [user provided]-[speaks]-[null]
        browser.url('http://localhost:8079/tests/test2');
        var responseButton = $('.responseButton');
        var userInput = $('#userInput');
        var rbchat = $('.rbchat');

        responseButton.waitForExist(5000);
        browser.click('.responseButton');

        rbchat.waitForExist(5000);
        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');

        responseButton.waitForText('England', 5000);
        console.log(responseButton);
        browser.click('.responseButton');

        browser.setValue('#userInput', 'Ben');
        userInput.keys('\uE007');
        browser.click('#sendButton');
        assert.equal(browser.getValue('#userInput'), 'Ben');
    });
});
