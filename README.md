# README #


### What is this repository for? ###
This is an example about how to use mochajs for doing web services/APIs test.

Details:
- Based on Mochajs framework https://mochajs.org/
- Wrapped up by Chakram https://github.com/dareid/chakram

### How do I get set up? ###
For Windows, download nodejs from: https://nodejs.org/en/download/

For Linux install dependencies:
See latest and instruction at: https://github.com/nodesource/distributions#debinstall
```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Open Terminal (or GitBash in Windows https://git-scm.com/downloads), installing framework's dependencies with the following commands:
```
sudo npm install
sudo npm install -g mocha
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

Execute all test files in `/test`
```
mocha test/*/*
```

Execute only 1 test file
```
mocha test/functional/template1.js
```

There is a cool way to execute test with customised options. See `/test/smoke.opts` for an example how to run smoke test:
```
mocha --opts test/smoke.opts
```

### View test report ###

HTML format report is saved at `mochawesome-report/mochawesome.html`.
Command line to view report from Terminal Console:
```
google-chrome mochawesome-report/mochawesome.html
```

:tada: :fireworks:
