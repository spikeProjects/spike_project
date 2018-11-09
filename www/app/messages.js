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
        }
    };
});
