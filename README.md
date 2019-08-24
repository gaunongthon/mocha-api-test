# README #


### What is this repository for? ###
This is an example about how to use mochajs, superagent, chai for doing web services/APIs test.

### Set up ###
```
npm run setup
```
### Set up a new environment ###
To create a new environment, duplicate `env/testing.env.js` and update serverUrl.
```
global.serverUrl = "http://your_endpoint_url"
```
### Execute test ###

Execute all test files in `/test/smoketest` on `testing` environment
```
npm run smoke env/testing.env.js
```

Execute only 1 test file on `testing` environment
```
mocha env/testing.env.js test/smoketest/smokesuite.js
```

### View test report ###

HTML format report is saved at `mochawesome-report/mochawesome.html`.
Command line to view report from Terminal Console:
```
google-chrome mochawesome-report/mochawesome.html
```

:tada: :fireworks:
