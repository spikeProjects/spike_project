define(function () {
    return {
        getHello: function () {
            return 'Hello World';
        },
        isPrime: function(num) {
            if (typeof num !== 'number' || !Number.isInteger(num)) {
                return false;
            }
            if (num <2) {
                return false;
            }
            if (num === 2) {
                return true;
            }
            if (num %2 ===0) {
                return  false;
            }
            var squarRoot = Math.sqrt(num);
            for (var i=3; i<=squarRoot; i+=2) {
                if (num%i ===0) {
                    return false;
                }
            }
            return true;
        },
        longRunningTask: function* longRunningTask(value1) {
            try {
              var value2 = yield step1(value1);            // {value: val1, done: false }
              var value3 = yield step2(value2);
              var value4 = yield step3(value3);
              var value5 = yield step4(value4);
              // Do something with value4
            } catch (e) {
              // Handle any error from step1 through step4
            }
        },
        fibonacci: function (num = 1000) {
            function * fibonacci () {
                let [prev, curr] = [0, 1];
                for (;;) {
                    yield curr;
                    [prev, curr] = [curr, prev + curr];
                }
            };
            for (let n of fibonacci()) {
                if (n>1000) {
                    console.log(n);
                    break;
                }
            }
        }
    };
});
