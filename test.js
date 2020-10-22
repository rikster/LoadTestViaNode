const axios = require("axios");
const argv = require('minimist')(process.argv.slice(2));

function test(url, body) {
    axios.interceptors.request.use(function (config) {
        config.metadata = {startTime: new Date()}
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        response.config.metadata.endTime = new Date()
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime
        return response;
    }, function (error) {
        return Promise.reject(error);
    });

    url = url.replace(/['"]+/g, ''); //strip inverted commas, else you will get ECONNREFUSED error
    body = url.body;

    axios({
        method: "post",
        url: url,
        responseType: "json",
        data: body
    })
        .then((response) => {
            //console.log('success')
            //console.log(response.duration);
            process.stdout.write(response.duration.toString());
            process.exitCode = 0;
        })
        .catch((error) => {
            console.log(error.message);
            process.exitCode = 1;
        })
}

test(argv.url, argv.body);