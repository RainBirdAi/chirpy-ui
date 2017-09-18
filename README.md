# chirpy-ui

chirpy-ui is a chat styled implementation of an 'agent' for use with [Rainbird](https://rainbird.ai/), supporting interactions and displaying the end result/results.

This repository can be used as a starting point for your own UI implementation.  It contains front-end code and a supporting backend server which can be used to quickly have a look at chirpy-ui without having to serve the code in your own application.

Rainbird is an AI-powered cognitive reasoning engine that enables companies to automate complex decision-making at scale.

## Getting Started

To see how chirpy-ui looks and to run an interaction against a basic knowledge map, please install the following pre-requisites and run the steps below:

### Pre-requisites

```
node
npm
bower
```

### Install and startup

```
npm install
bower install
node server.js
```

An interaction against an example knowledge map should be accessible on localhost:

http://localhost:8080/a2c1ebb9-aa02-4f6b-8e3a-3f21fffb481f

The example agent contains a 'speaks' goal which can be run by clicking on the 'speaks' button.  chirpy-ui should then support a basic interaction between the user and Rainbird until an answer is reached.

## Project Layout

### Front end

The front-end code is located in the ./public directory with chirpy.html being the container for the application.  It loads a supporting library containing the Rainbird API calls (rainbirdClientUtils) and also jQuery and d3.  

The main application is contained in chirpy.js which runs a function on page load to get the Rainbird API URL (referred to as the Yolanda URL) from a containing div.  The agent's configuration is then retrieved from a second Rainbird endpoint and the webpage is prepared.  The bundled ./server.js file loads a div containing the Yolanda URL to support this mechanism but this may be an aspect of the codebase which you change to suit your needs.

The file rainbirdClientUtils.js contains the jQuery Ajax calls to the Yolanda API.

### Back end

A basic back end has been included which can be used to quickly serve the front end code.  The included web server proxies some requests made by ./public/rainbirdClientUtils.js to the Rainbird Community environment in order to load the example agent.  When creating your own implementation, you will need the agent id which can be retrieved from the Rainbird configuration portal, the URLs of the configuration portal itself and the Rainbird API for the appropriate environment that you are connecting to.

## Running the tests

A set of tests can be found in the ./test directory.  The suite uses WebdriverIO, selenium-standalone and mocha.  Selenium-standalone should be installed and started in the background before running the tests:

```
npm install selenium-standalone@latest -g
selenium-standalone install
selenium-standalone start
node test/testServer.js
```
 
## Resources

* [Rainbird API documentation](https://app.rainbird.ai/rainbird_api_guide.pdf)
