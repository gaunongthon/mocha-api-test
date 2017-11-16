# README #

### What is this repository for? ###

* mocha-api-test
* Based on [Chakram] (https://github.com/dareid/chakram)

### How do I get set up? ###

* Dependencies:

```
#!javascript

npm install
```

### How do I run smoke test? ###

* Update bootstrap.js to have global.dev_endpoint point at your expected endpoint:

```
#!javascript
test\bootstrap.js
```


* Execute smoke test:

```
#!javascript
mocha test/api/smoketest/*
```
