# README #

### What is this repository for? ###

* mocha-api-test
* Based on [Chakram] (https://github.com/dareid/chakram)

### How do I get set up? ###

* Install virtual env
```
pip install virtualenv
```

* Create virtual env

```
virtualenv venv
```

* Start virtual env and install dependencies:

```
source venv/bin/activate
npm install
```

* Deactivate virtual env
```
deactivate
```

### How do I set up endpoints? ###

* Set endpoints:

```
config/dev.js
```

Adding a new endpoint should look like this:

```
global.endpoint1 = "http://your_endpoint_url"
```


### How do I execute test ? ###

* Running smoke test for all microservices

```
mocha test/api/smoketest/*
```
