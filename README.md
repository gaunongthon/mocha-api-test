# README #

### What is this repository for? ###

* opta-api-test
* Version: 0.1
* Based on [Chakram] (https://github.com/dareid/chakram)

### How do I get set up? ###

* Dependencies:

```
#!javascript

npm install
```

### How do I run smoke test? ###

* Update bootstrap.js to have smoke test point at your expected endpoint:

```
#!javascript
test\opta\bootstrap.js
```

Example:
```
#!javascript
global.dev_endpoint = "https://0d8aksreg6.execute-api.us-east-1.amazonaws.com/qa17";
```


* Execute smoke test:

```
#!javascript
mocha test/opta/api/smoketest/1.setup_users.js
```