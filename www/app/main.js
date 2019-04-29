define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('./messages');

    // Load library/vendor modules using
    // full IDs, like:
    var print = require('print');

    print(messages.getHello());

    // es5 doesn't support generator
    var task = messages.longRunningTask(12);
    var task2 = task.next();
    var task3 = task2.next();
    console.log(task);
    console.log(task2);
    console.log(task3);
});
