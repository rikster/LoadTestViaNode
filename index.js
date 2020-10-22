"use strict";
const childProc = require("child_process");
const CHILD_PROCESSES = 50;
//const URL = 'http://theage.com.au/';
const URL = 'http://localhost:5000/api/calcMonthlyMortgagePayment';
const BODY = {
    "loanAmount": 500000,
    "interestRate": 4.5,
    "termInYears": 25
};

(async () => {
    let times = [];
    let children = [];

    for (let i = 0; i < CHILD_PROCESSES; i++) {
        let childProcess = childProc.spawn("node", ["test.js", `--url=${URL}`, `--body=${BODY}`])
        children.push(childProcess);
    }

    let responses = children.map(function wait(child) {
        return new Promise(function c(res) {
            child.stdout.on('data', (data) => {
                console.log(`test stdout : ${data}`);
                times.push(parseInt(data));
            });
            child.on("exit", function (code) {
                if (code === 0) {
                    res(true);
                } else {
                    res(false);
                }
            });
        });
    });

    responses = await Promise.all(responses);

    if (responses.filter(Boolean).length == responses.length) {
        const sum = times.reduce((a, b) => a + b, 0);
        const avg = (sum / times.length) || 0;
        console.log(`average: ${avg}`);
        console.log("success!");
    } else {
        console.log("failures!");
    }
})();
