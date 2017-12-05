// Karma configuration
// Generated on Wed Aug 19 2015 12:57:21 GMT-0700 (PDT)
var fs = require('fs'),
    xml2js = require('xml2js'),
    _ = require('underscore');

var appConfig = JSON.parse(fs.readFileSync('grunt_config.json', 'utf8')),
    pomFile = fs.readFileSync(__dirname + '/../pom.xml', 'utf8');

xml2js.parseString(pomFile, function(err, result) {
    if (err) {
        throw 'Could not get ' + appConfig.appName + ' application version info';
    }
    appConfig.appVersion = result.project.version[0];
    console.log('version', appConfig.appVersion)

    appConfig.appFolder = appConfig.appName + '-' + appConfig.appVersion;
    appConfig.appName = appConfig.appName;
});

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath : '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        //frameworks: ['mocha', 'requirejs', 'chai', 'sinon'],
        frameworks : ['jasmine-ajax', 'jasmine-jquery', 'jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files : [{
            pattern : 'app/scripts/**/*.js',
            included : false
        }, {
            pattern : 'test/unit/*spec.js',
            included : false
        }, {
            pattern : 'test/unit/**/*spec.js',
            included : false
        }, {
            pattern : 'test/data/*json.js',
            included : false
        }, 'test/test-main.js'],

        // list of files to exclude
        exclude : ['app/scripts/main.js', 'app/scripts/lib/*.js', 'app/scripts/config.js'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors : {
            'app/scripts/*.js' : ['coverage'],
            'app/scripts/collections/*.js' : ['coverage'],
            'app/scripts/controllers/*.js' : ['coverage'],
            'app/scripts/helpers/*.js' : ['coverage'],
            'app/scripts/layouts/*.js' : ['coverage'],
            'app/scripts/models/*.js' : ['coverage'],
            'app/scripts/viewcontainers/*.js' : ['coverage'],
            'app/scripts/views/*.js' : ['coverage'],
            'test/test-main.js' : ['lodash']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters : ['progress', 'html', 'coverage'],

        coverageReporter : {
            dir : 'reports/coverage',
            reporters : [
            // reporters not supporting the `file` property
            {
                type : 'html',
                subdir : 'report-html'
            }, {
                type : 'lcov',
                subdir : 'report-lcov'
            },
            // reporters supporting the `file` property, use `subdir` to directly
            // output them in the `dir` directory
            {
                type : 'cobertura',
                subdir : '.',
                file : 'cobertura.txt'
            }]
        },

        htmlReporter : {
            outputDir : 'reports/coverage/html-reporter', // where to put the reports
            templatePath : null, // set if you moved jasmine_template.html
            focusOnFailures : true, // reports show failures on start
            namedFiles : false, // name files instead of creating sub-directories
            pageTitle : null, // page title for reports; browser info by default
            urlFriendlyName : false,
            preserveDescribeNesting : true, // folded suites stay folded
            foldAll : false
        },

        lodashPreprocessor : {
            data : appConfig
        },

        // web server port
        port : 9876,

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel : config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers : ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun : false
    });
};
