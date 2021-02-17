const readline = require('readline');

module.exports = async function (question, required = false) {
    let r;
    do {
        r = await entry(question);
    } while (required && !r);

    return r;
}

async function entry(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            return resolve(answer);
        });
    });
}