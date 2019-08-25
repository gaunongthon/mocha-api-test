# README #


### What is this repository for? ###
This is an example about how to use mochajs for doing web services/APIs test.

Details:
- Based on Mochajs framework https://mochajs.org/
- Wrapped up by Chakram https://github.com/dareid/chakram

### Set up ###
```
npm run setup
```
### Set up serverUrl ###
Copy `env/testing.env.js`, then modifying the global.serverUrl.
### Execute test ###
Execute all test files in `/test` (Full Regression Test) against `testing` environment
```
npm run regression env/testing.env.js
```
Execute smoke test (a sub-set of test cases) against `testing` environment
```
npm run smoke env/testing.env.js 
```
Execute only 1 test file  against `testing`
```
mocha env/testing.env.js test/functional/template1.js
```
### View test report ###
HTML format report is saved at `mochawesome-report/mochawesome.html`.
Command line to view report from Terminal Console:
```
google-chrome mochawesome-report/mochawesome.html
```

:tada: :fireworks:
