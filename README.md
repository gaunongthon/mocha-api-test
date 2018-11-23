# README #

### What is this repository for? ###

* mocha-api-test
* Based on [Chakram] (https://github.com/dareid/chakram)

### How do I get set up? ###

Install dependencies:
```
apt-get update
apt-get install npm
apt-get install nodejs-legacy
npm install
npm install -g mocha
```

### How do I set up endpoints? ###

Set endpoints:
```
config/dev.js
```

Adding a new endpoint should look like this:
```
global.endpoint1 = "http://your_endpoint_url"
```

### How do I execute test ? ###

Running smoke test for all microservices
```
mocha test/api/smoketest/*
```

### How do I view test report? ###
Report will be automatically opened after a run. To change it, go to `test\mocha.opts`, update `autoOpen=false`.
```
google-chrome mochawesome-report/mochawesome.html
```
