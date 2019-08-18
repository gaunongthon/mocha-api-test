# README #


### What is this repository for? ###
This is an example about how to use mochajs, superagent, chai for doing web services/APIs test.

### How do I get set up? ###
```
npm install
npm install -g mocha
npm install -g mochawesome
```

### Set up endpoint ###

To set up endpoint, opening file `config/qa.env.js`, then modifying the global.endpoint:
```
global.endpoint = "http://your_endpoint_url"
```
In order to build a template, I am using the following endpoint
```
global.endpoint = "https://reqres.in"
```

### Eexecute test ###

Execute all test files in `/test/smoketest`
```
npm run smoke
```

Execute only 1 test file
```
mocha test/smoketest/smokesuite.js
```

### View test report ###

HTML format report is saved at `mochawesome-report/mochawesome.html`.
Command line to view report from Terminal Console:
```
google-chrome mochawesome-report/mochawesome.html
```

:tada: :fireworks:
