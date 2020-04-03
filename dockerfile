FROM node:10-slim
ARG TEST_TYPE=smoke
WORKDIR /mocha_test
RUN npm install
RUN npm install -g mocha
RUN npm install -g mochawesome
COPY . .
RUN echo "TEST_TYPE: ${TEST_TYPE}"
CMD ["npm","run", "smoke_testing_env"]