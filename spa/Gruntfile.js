//'use strict';

var path = require('path');
var sep = path.sep;
var fs = require('fs');
var xml2js = require('xml2js');
var appConfig = JSON.parse(fs.readFileSync('grunt_config.json', 'utf8'));
var common = 'common';
var scriptsPropsFileName = appConfig.scriptsPropsFileName || 'i18nPropsForScripts';
var i18nRegExp = /\/([a-zA-Z]{2}-[a-zA-Z]{2})\//;


var pomConfig = new xml2js.Parser().parseString(fs.readFileSync('../pom.xml'), function(err, result) {
    appConfig.appVersion = result.project.version[0];
});

appConfig.appFolder = appConfig.appName + '-' + appConfig.appVersion;

if (appConfig.appCommonVersion) {
   common = 'common-' + appConfig.appCommonVersion;
}

module.exports = function(grunt) {

    var dispatch = require('dispatch');
    var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

    grunt.log.writeln('App name with versioning - from pom.xml: ' + appConfig.appFolder);

    grunt.log.writeln('App common name with versioning - from grunt_config: ' + common);

    function stripConsoleLogs(contents, debugOnly) {
        if (debugOnly) {
            return contents.replace(/\s*console\.debug.+/g, '');
        } else {
            return contents.replace(/\s*console\..+/g, '');
        }
    }

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        config: appConfig,
        appName: '<%= config.appName %>',
        banner: '/*! <%= pkg.name %> v<%= pkg.version %>  (build <%= grunt.template.today("yyyy-mm-dd") %>)\n' +
            ' * <%= pkg.description %>\n *\n' +
            ' * <%= pkg.logo %>\n *\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * <%= pkg.copyright %>\n' +
            ' * <%= pkg.license %>\n' +
            ' */\n',
        consoleNoop: 'if(typeof console === "undefined"){zz=function(){};console={log:zz,debug:zz,info:zz,warn:zz,error:zz,assert:zz,clear:zz,trace:zz};}',
        buildDevPath: 'build-dev',
        buildProdPath: 'build-prod',
        buildSeoPath: 'build-seo',
        buildTestPath: 'build-test',
        buildLibPath: 'build-lib',
        buildTmpPath: 'build-tmp',
        resourcesPath: appConfig.resourcesPath,
        scriptsPropsFileName: scriptsPropsFileName,
        deploymentTargetPath: appConfig.deploymentTargetPath,
        commonFolder: '/' + common,
        scriptsFolder: '/scripts',
        stylesFolder: '/styles',
        imagesFolder: '/images',
        templatesFolder: '/templates',
        i18nFolder: '/i18n',
        componentsFolder: '/components',
        modulesFolder: '/modules',
        appFolder: appConfig.appFolder,
        appUrlPath: appConfig.appUrlPath,
        indexTemplate: 'page_layout',
        templateExtension: 'dust',
        testPath: 'test',
        localhostPortDev: 7777,
        localhostPortProd: 8888,
        localhostPortTest: 9999,
        featureResourcesPath: '<%= resourcesPath %>/<%= appFolder %>',
        commonResourcesPath: '<%= resourcesPath %><%= commonFolder %>',
        featureScriptsPath: '<%= resourcesPath %><%= scriptsFolder %>/<%= appFolder %>',
        featureOptimizedScriptsPath: '<%= resourcesPath %><%= scriptsFolder %>/<%= appFolder %>/optimized/',
        featureStylesPath: '<%= resourcesPath %><%= stylesFolder %>/<%= appFolder %>',
        featureImagesPath: '<%= resourcesPath %><%= imagesFolder %>/<%= appFolder %>',
        featureTemplatesPath: '<%= resourcesPath %><%= templatesFolder %>/<%= appFolder %>',
        featureBrandCurrent: 'blue_new',
        featureBrandNext: 'ticket-out',
        i18nRootPath: '<%= resourcesPath %><%= i18nFolder %>',
        commonScriptsPath: '<%= resourcesPath %><%= scriptsFolder %><%= commonFolder %>',
        commonStylesPath: '<%= resourcesPath %><%= stylesFolder %><%= commonFolder %>',
        commonImagesPath: '<%= resourcesPath %><%= imagesFolder %><%= commonFolder %>',
        commonTemplatesPath: '<%= resourcesPath %><%= templatesFolder %><%= commonFolder %>',
        commonI18nPath: '<%= resourcesPath %><%= i18nFolder %><%= commonFolder %>',
        commonComponentsPath: '<%= resourcesPath %><%= componentsFolder %><%= commonFolder %>',
        commonModulesPath: '<%= resourcesPath %><%= modulesFolder %><%= commonFolder %>',
        commonRootSourcePath: 'app-common/ui-war/src/main/spa/',
        commonRootSourcePathDev: '<%= commonRootSourcePath %>/<%= buildDevPath %>',

        commonScriptsSourcePathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/scripts',
        commonStylesSourcePathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/styles',
        commonTemplatesSourcePathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/templates',
        commonImagesSourcePathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/images',
        commonI18nSourcePathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/i18n',
        commonComponentsRootPathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/components',
        commonModulesRootPathDev: '<%= commonRootSourcePathDev %><%= resourcesPath %>/modules',
        appCommonRelativePath: '../../../app-common/ui-war/src/main/spa/build-dev/resources',
        appCommonBuildTestPath: '<%= buildTestPath %>/app-common',

        // Task configuration.
        // TODO: wait for a better configurable version of bower: current implementation creates unwanted directory structure and does not add version number to the file name
        /*bower: {
            install: {
                options: {
                    targetDir: 'app/scripts/lib',
                    cleanup: false,
                    install: true
                }
            }
        },*/

        // Task for running a background shell command
        bgShell: {
            runNode: {
                cmd: 'node ./node_modules/nodemon/nodemon.js index.js',
                bg: true
            }
        },

        // Task to bump version number in both package.json and foobunny.js
        // (they need to remain in sync)
        // Unless otherwise indicated, the task will commit the changes.
        // To bump only, run:
        //    grunt bump-only:[major|minor|patch]
        bump: {
            options: {
                files: ['package.json', 'app/scripts/foobunny/foobunny.js'],
                commitFiles: ['-a']
            }
        },

        //Task for running functional tests
        //note: it's using the "includes" option since "pre" option causes phantomJS to hang
        casper: {
            dev: {
                options: {
                    test: true,
                    direct: true,
                    includes: '<%= testPath %>/func/devConfig.js',
                    'log-level' : 'warning'//,
                    // this viewportSize is passed through to phantomJs
                    //viewportSize: {width:1000, height:800}
                },
                src: ['<%= testPath %>/func/*.js', '!<%= testPath %>/func/*Config.js']
            },
            prod: {
                options: {
                    test: true,
                    direct: true,
                    includes: '<%= testPath %>/func/prodConfig.js',
                    'log-level': 'warning'
                },
                src: ['<%= testPath %>/func/*.js', '!<%= testPath %>/func/*Config.js']
            }
        },

        //Task for deleting files/folders for build directories
        clean: {
            dev: ['<%= buildDevPath %>/*'],
            prod: ['<%= buildProdPath %>/*'],
            test: ['<%= buildTestPath %>/*'],
            lib: ['<%= buildLibPath %>/*'],
            tmp: ['<%= buildTmpPath %>/*']
        },

        // compress: { //TODO: come back to this if necessary.
        //   options: {
        //     archive: 'archive.zip'
        //   },
        //   // files: {
        //   //   "build-prod-compressed": ["build-prod/**/*"]
        //   //    {src: ['path/**'], dest: 'internal_folder2/'},
        //   // }
        //   files: [
        //     { src: ['build-prod/**'], dest: 'build-prod-compressed'}
        //   ]
        // },
        //Task for concatenating files
        //TODO: may have some overlap w/ Require task. Investigate.
        concat: {
            options: {
                separator: '\n'
            },
            dev: {
                rename: function(dest, src) {
                    // console.log('\nsrc: ', src);
                    // console.log('\dest: ', dest);
                    var i18n;
                    if (i18n = i18nRegExp.exec(src)) {
                        var pair = i18n[1].split('-');
                        var language = pair[0];
                        var country = pair[1];
                        var converted = language.toLowerCase() + '-' + country.toLowerCase();
                        dest = dest + converted + '/';
                    }
                    dest = dest + 'templates-bundle.js';
                    // console.log('--------dest: ', dest);
                    return dest;
                },
                expand: true,
                nonnull: true,
                dest: '<%= buildDevPath %><%= featureTemplatesPath %>/',
                src: ['<%= buildDevPath %><%= featureTemplatesPath %>/**/**/*.js']
            },
            prod: {
                rename: function(dest, src) {
                    // console.log('\nsrc: ', src);
                    // console.log('\dest: ', dest);
                    var i18n;
                    if (i18n = i18nRegExp.exec(src)) {
                        var pair = i18n[1].split('-');
                        var language = pair[0];
                        var country = pair[1];
                        var converted = language.toLowerCase() + '-' + country.toLowerCase();
                        dest = dest + converted + '/';
                    }
                    dest = dest + 'templates-bundle.js';
                    // console.log('--------dest: ', dest);
                    return dest;
                },
                expand: true,
                nonnull: true,
                dest: '<%= buildProdPath %><%= featureTemplatesPath %>/',
                src: ['<%= buildProdPath %><%= featureTemplatesPath %>/**/**/*.js']
            },
            test: {
                src: ['app/scripts/**/*.js'],
                dest: '<%= buildTestPath %>/<%= pkg.name %>.js'
            }
        },
        // Simple Connect server for unit test results page,
        // and to serve the html skeleton of app pages.
        connect: {
            dev: {
                options: {
                    hostname: '0.0.0.0',
                    port: 7777,
                    base: './<%= buildDevPath %>',
                    middleware: function(connect, options) {
                        // Return array of whatever middlewares you want
                        return [
                            //setup api proxy
                            proxySnippet,
                            // allow any /foo URL to be served by index.html
                            dispatch({
                                '/(.*)': function(req, res, next, path) {
                                    //NOTE: poor man's test to allow any file at the root level
                                    //to be served correctly
                                    if (path.indexOf('.') === -1) {
                                        grunt.log.writeln('req.url: ' + req.url);
                                        //redirect to root index.html
                                        req.url = '/';
                                    }
                                    next();
                                }
                            }),
                            connect.static(options.base[0]),
                            connect.directory(options.base[0])
                        ];
                    }
                },
                // config to proxy api calls "/api/xxxx" to port 7778
                proxies: appConfig.proxies

            },
            prod: {
                options: {
                    hostname: '0.0.0.0',
                    port: 8888,
                    base: './<%= buildProdPath %>',
                    keepalive: true,
                    middleware: function(connect, options) {
                        // Return array of whatever middlewares you want
                        return [
                            //setup api proxy
                            proxySnippet,
                            //NOTE: this is a temporary solution to allow
                            //any /foo URL to be served by index.html
                            dispatch({
                                    '/(.*)': function(req, res, next, path) {
                                    //NOTE: poor man's test to allow any file at the root level
                                    //to be served correctly
                                    if (path.indexOf('.') === -1) {
                                        grunt.log.writeln('req.url: ' + req.url);
                                        //redirect to root index.html
                                        req.url = '/';
                                    }
                                    next();
                                }
                            }),
                            connect.static(options.base[0]),
                            connect.directory(options.base[0])
                        ];
                    }
                },
                // config to proxy api calls "/api/xxxx" to port 7778
                proxies: appConfig.proxies
            },
            test: {
                options: {
                    port: 9999,
                    base: './<%= buildTestPath %>'
                }
            }
        },
        //Task to copy files from one dir to another.
        //TODO: may be some overlap. Investigate. If keeping, may need to be more specialized.
        copy: {
            dev: {
                files: [
                    { src: ['**/*.js'], dest: '<%= buildDevPath %><%= featureScriptsPath %>/', expand: true, cwd: 'app/scripts'},
                    { src: ['**/*.json'], dest: '<%= buildDevPath %><%= featureScriptsPath %>/', expand: true, cwd: 'app/scripts'},
                    { src: ['**/*.html'], dest: '<%= buildDevPath %><%= appUrlPath %>/', expand: true, cwd: 'app'},
                    { src: ['*.ico'], dest: '<%= buildDevPath %>/', expand: true, cwd: 'app'},
                    { src: ['*.txt'], dest: '<%= buildDevPath %>/', expand: true, cwd: 'app'},
                    { src: ['globalContext.json', '<%= appName %>.html'], dest: '<%= buildDevPath %><%= resourcesPath %>/unified-controller/<%= appName %>/', expand: true, cwd: ''},
                    {
                        src: ['**/*.js'],
                        dest: '<%= buildDevPath %><%= featureScriptsPath %>',
                        expand: true,
                        cwd: 'build-tmp/resources/shape/scripts'
                    }, {
                        src: ['*.css'],
                        dest: '<%= buildDevPath %><%= featureStylesPath %>',
                        expand: true,
                        cwd: 'build-tmp/resources/shape/styles'
                    }
                ]
            },
            devCommon: {
                files: [
                    { src: ['**/*.js'], dest: '<%= buildDevPath %><%= commonScriptsPath %>/', expand: true, cwd: '<%= commonScriptsSourcePathDev %><%= commonFolder %>'},
                    { src: ['**/*.js'], dest: '<%= buildDevPath %><%= commonTemplatesPath %>/', expand: true, cwd: '<%= commonTemplatesSourcePathDev %><%= commonFolder %>'},
                    { src: ['**/*.js'], dest: '<%= buildDevPath %><%= commonI18nPath %>/', expand: true, cwd: '<%= commonI18nSourcePathDev %><%= commonFolder %>'},
                    { src: ['**/*.css'], dest: '<%= buildDevPath %><%= commonStylesPath %>/', expand: true, cwd: '<%= commonStylesSourcePathDev %><%= commonFolder %>'},
                    { src: ['**/*.*'], dest: '<%= buildDevPath %><%= commonImagesPath %>/', expand: true, cwd: '<%= commonImagesSourcePathDev %><%= commonFolder %>'},
                    { src: ['**/*.*'], dest: '<%= buildDevPath %><%= commonComponentsPath %>/', expand: true, cwd: '<%= commonComponentsRootPathDev %><%= commonFolder %>'},
                    { src: ['**/*.*'], dest: '<%= buildDevPath %><%= commonModulesPath %>/', expand: true, cwd: '<%= commonModulesRootPathDev %><%= commonFolder %>'}
                ]
            },
            libprod: {
                files: [
                    { src: ['require*.js'], dest: '<%= buildProdPath %>/<%= commonScriptsPath %>/lib/', expand: true, cwd: 'app-common/scripts/lib'},
                    { src: ['json2.js'], dest: '<%= buildProdPath %>/<%= commonScriptsPath %>/lib/', expand: true, cwd: 'app-common/scripts/lib'},
                    { src: ['foobunny*.js'], dest: '<%= buildProdPath %>/<%= commonScriptsPath %>/lib/', expand: true, cwd: 'app-common/scripts/lib'},
                    { src: ['vendor*.js'], dest: '<%= buildProdPath %>/<%= commonScriptsPath %>/lib/', expand: true, cwd: 'app-common/scripts/lib'}
                ]
            },
            prod: {
                files: [
                    { src: ['**/*.js'], dest: '<%= buildProdPath %><%= featureScriptsPath %>/', expand: true, cwd: 'app/scripts'},
                    { src: ['**/*.map'], dest: '<%= buildProdPath %><%= featureScriptsPath %>/', expand: true, cwd: 'app/scripts'},
                    { src: ['*.ico'], dest: '<%= buildProdPath %>/', expand: true, cwd: 'app'},
                    { src: ['*.txt'], dest: '<%= buildProdPath %>/', expand: true, cwd: 'app'},
                    { src: ['globalContext.json', '<%= appName %>.html'], dest: '<%= buildProdPath %><%= resourcesPath %>/unified-controller/<%= appName %>/', expand: true, cwd: ''},
                    {
                        src: ['**/*.js'],
                        dest: '<%= buildProdPath %><%= featureScriptsPath %>',
                        expand: true,
                        cwd: 'build-tmp/resources/shape/scripts'
                    }, {
                        src: ['*.css'],
                        dest: '<%= buildProdPath %><%= featureStylesPath %>',
                        expand: true,
                        cwd: 'build-tmp/resources/shape/styles'
                    }
                ]
            },
            deployDev: {
                files: [
                    { src: ['**/*.*'], dest: '<%= deploymentTargetPath %>/', expand: true, cwd: '<%= buildDevPath %>'},
                    { src: ['**/*.*'], dest: '<%= deploymentTargetPath %>/../templates<%= appUrlPath %>/', expand: true, cwd: 'app/templates'}
                ]
            },
            test: {
                files: [
                    { src: ['**/*.js'], dest: '<%= buildTestPath %><%= featureScriptsPath %>/', expand: true, cwd: 'app/scripts'},
                    { src: ['**/*.html'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'app'},
                    { src: ['*.ico'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'app'},
                    { src: ['*.txt'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'app'},
                    { src: ['**/*', '!templates/**/*', '!18n/**/*'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'test'}
                ]
            },
            imgDev: {
                files: [
                    { src: ['**/*.*'], dest: '<%= buildDevPath %><%= featureImagesPath %>/', expand: true, cwd: 'app/images'}
                ]
            },
            imgProd: {
                files: [
                    { src: ['**/*.*'], dest: '<%= buildProdPath %><%= featureImagesPath %>/', expand: true, cwd: 'app/images'}
                ]
            },
            imgTest: {
                files: [
                    { src: ['**/*.*'], dest: '<%= buildTestPath %><%= featureImagesPath %>/', expand: true, cwd: 'app/images'}
                ]
            },
            unitTestCommon: {
                files: [
                    { src: ['**/*.*'], dest: '<%= appCommonBuildTestPath %>', expand: true, cwd: '<%= appCommonRelativePath %>'}
                ]
            }
        },

        //Task to minify html and copy to prod directory.
        htmlmin: {
            dev: {
                files: [
                    { src: ['*.html'], dest: '<%= buildDevPath %>/', expand: true, cwd: 'app'}
                ]
            },
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    { src: ['**/*.html'], dest: '<%= buildProdPath %><%= appUrlPath %>/', expand: true, cwd: 'app'}
                ]
            },
            test: {
                files: [
                    { src: ['*.html'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'app'}
                ]
            }
        },

        //Task to run jshint on configured directories.
        jshint: {
            gruntfile: {
                // options: {
                //   jshintrc: '.jshintrc'
                // },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: 'app/scripts/.jshintrc'
                },
                src: ['app/scripts/**/*.js', 'app-common/scripts/**/*.js', '!app-common/scripts/lib/**/*.js']
            },
            test: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['test/**/*.js', '!test/lib/**/*.js']
            }
        },

        // Task to compile SASS files and copy them to dev or prod directories.
        sass: {
            dev: {
                // options: {
                //     modifyVars: {
                //         commonImagesPath: '"<%= featureImagesPath %>"'
                //     }
                // },
                files: [{
                    src: ['<%= featureBrandCurrent %>/app.scss'],
                    dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.css'
                }, {
                    src: ['<%= featureBrandNext %>/app.scss'],
                    dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.<%= featureBrandNext %>.css'
                }, {
                    src: ['76ers/app.scss'],
                    dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.override.76ers.css'
                }]
            },
            prod: {
                // options: {
                //     modifyVars: {
                //         commonImagesPath: '"<%= featureImagesPath %>"'
                //     }
                // },
                files: [{
                    src: ['<%= featureBrandCurrent %>/app.scss'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.css'
                }, {
                    src: ['<%= featureBrandNext %>/app.scss'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.<%= featureBrandNext %>.css'
                }, {
                    src: ['76ers/app.scss'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.override.76ers.css'
                }]
            },
            test: {
                files: [{
                    src: ['<%= featureBrandCurrent %>/app.scss'],
                    dest: '<%= buildTestPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.css'
                }, {
                    src: ['<%= featureBrandNext %>/app.scss'],
                    dest: '<%= buildTestPath %><%= featureStylesPath %>/',
                    expand: true,
                    flatten: true,
                    cwd: 'app/styles',
                    ext: '.override.<%= featureBrandNext %>.css'
                }]
            }
        },

        //Task to minfiy CSS
        cssmin: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= buildDevPath %><%= featureStylesPath %>',
                    src: ['*.css', '!*.min.css', '!*.<%= featureBrandNext %>.css', '!*.override.*.css'],
                    dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                    ext: '.min.css'
                },
                {
                    expand: true,
                    cwd: '<%= buildDevPath %><%= featureStylesPath %>',
                    src: ['*.<%= featureBrandNext %>.css'],
                    dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                    ext: '.<%= featureBrandNext %>.min.css'
                }, {
                        expand: true,
                        cwd: '<%= buildDevPath %><%= featureStylesPath %>',
                        src: ['*.76ers.css'],
                        dest: '<%= buildDevPath %><%= featureStylesPath %>/',
                        ext: '.override.76ers.min.css'
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: '<%= buildProdPath %><%= featureStylesPath %>',
                    src: ['*.css', '!*.min.css', '!*.<%= featureBrandNext %>.css', '!*.override.*.css'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: '<%= buildProdPath %><%= featureStylesPath %>',
                    src: ['*.<%= featureBrandNext %>.css'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    ext: '.<%= featureBrandNext %>.min.css'
                }, {
                    expand: true,
                    cwd: '<%= buildProdPath %><%= featureStylesPath %>',
                    src: ['*.76ers.css'],
                    dest: '<%= buildProdPath %><%= featureStylesPath %>/',
                    ext: '.override.76ers.min.css'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: '<%= buildTestPath %><%= featureStylesPath %>',
                    src: ['*.css', '!*.min.css', '!*.<%= featureBrandNext %>.css', '!*.override.*.css'],
                    dest: '<%= buildTestPath %><%= featureStylesPath %>/',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: '<%= buildTestPath %><%= featureStylesPath %>',
                    src: ['*.<%= featureBrandNext %>.css'],
                    dest: '<%= buildTestPath %><%= featureStylesPath %>/',
                    ext: '.<%= featureBrandNext %>.min.css'
                }, {
                    expand: true,
                    cwd: '<%= buildTestPath %><%= featureStylesPath %>',
                    src: ['*.76ers.css'],
                    dest: '<%= buildTestPath %><%= featureStylesPath %>/',
                    ext: '.override.76ers.min.css'
                }]
            }
        },

        //Task to run require.js optimizer.
        requirejs: {
            dev: {
                options: {
                    // set build path as working directory
                    baseUrl: '<%= buildDevPath %><%= featureScriptsPath %>',
                    // set output path as specified in app config
                    out: '<%= buildDevPath %><%= featureOptimizedScriptsPath %><%= config.requirejsoptimizer.out %>',
                    // set included and excluded files as specified in app config
                    include: appConfig.requirejsoptimizer.include,
                    exclude: appConfig.requirejsoptimizer.exclude,
                    // no uglify optimization for dev build
                    optimize: 'none',
                    // set build-time paths object with empty paths required for requirejs task
                    // WARNING: Actual runtime paths is defined in the app's config.js. Please keep these two definitions in sync
                    paths: appConfig.requirejsoptimizer.paths
                }
            },
            blueprintJS_dev: {
                options: {
                    // set build path as working directory
                    baseUrl: '<%= buildDevPath %><%= featureScriptsPath %>',
                    include: ['./lib/raphael-2.1.4.js', './lib/hammer-1.1.3.js', './lib/blueprint.js'],
                    // set output path as specified in app config
                    out: '<%= buildDevPath %><%= featureOptimizedScriptsPath %>/blueprint-bundle.js',
                    //allowSourceOverwrites: true,
                    // set uglify optimization for prod build
                    optimize: 'none'
                }
            },
            prod: {
                options: {
                    // set build path as working directory
                    baseUrl: '<%= buildProdPath %><%= featureScriptsPath %>',
                    // set output path as specified in app config
                    out: '<%= buildProdPath %><%= featureOptimizedScriptsPath %><%= config.requirejsoptimizer.out %>',
                    // set included and excluded files as specified in app config
                    include: appConfig.requirejsoptimizer.include,
                    exclude: appConfig.requirejsoptimizer.exclude,
                    // set uglify optimization for prod build
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    // callback to do any transformation of the content in each file, if necessary
                    onBuildRead: function(moduleName, path, contents) {
                        contents = stripConsoleLogs(contents);
                        return contents;
                    },
                    // set build-time paths object with empty paths required for requirejs task
                    // WARNING: Actual runtime paths is defined in the app's config.js. Please keep these two definitions in sync
                    paths: appConfig.requirejsoptimizer.paths
                }
            },
            blueprintJS_prod: {
                options: {
                    // set build path as working directory
                    baseUrl: '<%= buildProdPath %><%= featureScriptsPath %>',
                    include: ['./lib/raphael-2.1.4.js', './lib/hammer-1.1.3.js', './lib/blueprint.js'],
                    // set output path as specified in app config
                    out: '<%= buildProdPath %><%= featureOptimizedScriptsPath %>/blueprint-bundle.js',
                    //allowSourceOverwrites: true,
                    // set uglify optimization for prod build
                    optimize: 'uglify2'
                }
            }
        },

        watch: {
            gruntfile: {
                files: ['<%= jshint.gruntfile.src %>'],
                tasks: ['jshint:gruntfile']
            },
            app: {
                files: ['<%= jshint.app.src %>'],
                tasks: ['jshint:app']
            },
            test: {
                files: ['<%= jshint.test.src %>', '<%= jshint.app.src %>', '<%= testPath %>/templates/**/*.dust'],
                tasks: ['buildTest', 'jshint:test'],
                options: {
                    livereload: false
                }
            },
            casper: {
                files: ['<%= casper.dev.src %>'],
                tasks: ['testFunc']
            },
            dev: {
                files: ['app/**/*', 'modules/**/*', '!**/node_modules/**'],
                tasks: ['build']
            },
            deploy: {
                files: ['app/**/*', 'app-common/**/*'],
                tasks: ['deploy']
            }
        },

        //Task to compile dust files.
        dustjs: {
            dev: {
                files: [
                    { src: ['**/*.dust'], dest: '<%= buildDevPath %><%= featureTemplatesPath %>/', expand: true, cwd: '<%= buildDevPath %><%= i18nRootPath %>/', ext: '.js'}
                ],
                options: {
                    fullname: function(filepath) {
                        return appConfig.appFolder + '/' + filepath.replace(/.*templates[^\w]*/i, '').replace(/\.dust/, '');
                    }
                }
            },
            prod: {
                files: [
                   { src: ['**/*.dust'], dest: '<%= buildProdPath %><%= featureTemplatesPath %>/', expand: true, cwd: '<%= buildProdPath %><%= i18nRootPath %>/', ext: '.js'}
                ],
                options: {
                    fullname: function(filepath) {
                        return appConfig.appFolder + '/' + filepath.replace(/.*templates[^\w]*/i, '').replace(/\.dust/, '');
                    }
                }
            },
            test: {
                files: [
                    { src: ['**/*.dust'], dest: '<%= buildTestPath %><%= featureTemplatesPath %>/', expand: true, cwd: 'app/templates', ext: '.js'},
                    { src: ['**/*.dust'], dest: '<%= buildTestPath %>/', expand: true, cwd: 'test/templates', ext: '.js'}
                ],
                options: {
                    fullname: function(filepath) {
                        return appConfig.appFolder + '/' + filepath.replace(/.*templates[^\w]*/i, '').replace(/\.dust/, '');
                    }
                }
            }
        },

        eslint: {
            src: ['./app/scripts/**/*.js']
        },

        mocha_phantomjs: {
            all: ['<%= buildTestPath %>/unit.html'],
            browser: ['test/**/*.html'],
            options: {
                ignoreResourceErrors: true,
                webSecurityEnabled: false,
                localToRemoteUrlAccessEnabled: true,
                reporter: 'Nyan',
                run: true
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        //Task to run mocha tests in a headless Phantom.js instance.
        mocha: {
            all: ['<%= buildTestPath %>/unit.html'],
            log: true,
            browser: ['test/**/*.html'],
            options: {
                ignoreResourceErrors: false,
                webSecurityEnabled: false,
                localToRemoteUrlAccessEnabled: true,
                reporter: 'Spec',
                logErrors: true,
                run: true
            }
        },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
        js: '<%= buildDevPath %><%= featureResourcesPath %>/scripts/**/*.js',
        css: '<%= buildDevPath %><%= featureResourcesPath %>/styles/**/*.css',
        img: '<%= buildDevPath %><%= featureResourcesPath %>/images/**/*.*'
    },

    /*
    ** Precompile task used for the i18n
    **
    ** @option {Object} localeFilesExpandPatterns - A object value, normally it should specify the i18n/locales folder in the app source folder and where all the soruce files should be coped into the deployment build environment, this value normally is a pattern value which can be passed into the grunt API `grunt.file.expandMapping`
    ** @option {Array} implementedLocalesList - specify the implemented locales list for this application
    ** @option {Function} getTemplateFilePath - return the template file path in deployment folder structure, make sure the returned template file path should be in the same folder with the associated properties file like below:
                                             i18n/<locale>/tempaltes/
                                                                    --header.poperties
                                                                    --header.dust
                          The key point in this example is the header.dust must be put together with the header.properties in the same folder
    ** @option {Function} getScriptsPropsFilePath - return the generated javascript properties file path in deployment folder structure
    ** @option {String} scriptsPropsFileName - specify the generated javascript properties file name
    */
    sh_precompile: {
        dev: {
            options: {
                localeFilesExpandPatterns: {
                  src: ['**/*.properties'],
                  dest: '<%= buildDevPath %><%= i18nRootPath %>',
                  cwd: 'app/i18n',
                  rename: function(dest, matchedSrcPath, options) {
                      return path.join(dest, matchedSrcPath);
                  }
                },
                implementedLocalesList: appConfig.implementedLocalesList,
                getTemplateFilePath: function(settings) {
                    var task = settings.task,
                        i18nRootPath = grunt.config.get([task.name, task.target, 'options', 'localeFilesExpandPatterns', 'dest']),
                        locale = settings.locale,
                        filepath = settings.filepath,
                        templatespath = '',
                        destpath = '';

                    templatespath = filepath.split(sep).slice(1).join(sep);
                    destpath = path.join(i18nRootPath, locale, templatespath);

                    return destpath;
                },
                getScriptsPropsFilePath: function(settings) {
                    var locale = settings.locale,
                        scriptsPropsFileName = settings.scriptsPropsFileName,
                        buildDevPath = grunt.config.get('buildDevPath'),
                        featureScriptsPath = grunt.config.get('featureScriptsPath'),
                        destpath = '';
                    destpath = path.join(buildDevPath, featureScriptsPath, locale, scriptsPropsFileName + '.js');

                    return destpath;
                },
                keyPrefix: '<%= config.appPrefix %>',
                scriptsPropsFileName: '<%= scriptsPropsFileName %>'
            },
            src: ['app/templates/**/*.dust']
        },
        prod: {
            options: {
                localeFilesExpandPatterns: {
                  src: ['**/*.properties'],
                  dest: '<%= buildProdPath %><%= i18nRootPath %>',
                  cwd: 'app/i18n'
                },
                implementedLocalesList: appConfig.implementedLocalesList,
                getTemplateFilePath: function(settings) {
                    var task = settings.task,
                        i18nRootPath = grunt.config.get([task.name, task.target, 'options', 'localeFilesExpandPatterns', 'dest']),
                        locale = settings.locale,
                        filepath = settings.filepath,
                        templatespath = '',
                        destpath = '';

                    templatespath = filepath.split(sep).slice(1).join(sep);
                    destpath = path.join(i18nRootPath, locale, templatespath);

                    return destpath;
                },
                getScriptsPropsFilePath: function(settings) {
                    var locale = settings.locale,
                        scriptsPropsFileName = settings.scriptsPropsFileName,
                        buildProdPath = grunt.config.get('buildProdPath'),
                        featureScriptsPath = grunt.config.get('featureScriptsPath'),
                        destpath = '';

                    destpath = path.join(buildProdPath, featureScriptsPath, locale, scriptsPropsFileName + '.js');

                    return destpath;
                },
                keyPrefix: '<%= config.appPrefix %>',
                scriptsPropsFileName: '<%= scriptsPropsFileName %>'
            },
            src: ['app/templates/**/*.dust']
        }
    },
    //Preprocess to replace the variables in index.html with context values
    //For prod, replace in minified html(index.html in build-prod)
    preprocess: {
        dev: {
            options: {
                inline: true,
                context: {
                    appNameVersioned: appConfig.appFolder,
                    appVersion: appConfig.appVersion,
                    appCommonNameVersioned: common,
                    appCommonVersion: appConfig.appCommonVersion,
                    appCommonLocalStaticHost: appConfig.appCommon.local.staticHost, //Used only for local development
                    appCommonLocalIcmsHost: appConfig.appCommon.local.icmsHost, //Used only for local development
                    appHomepageVersioned: appConfig.appHomepage.version,
                    appHomepageStaticHost: appConfig.appHomepage.staticHost, //Used only for local development
                    appSearchVersioned: appConfig.app.search.version,
                    appSearchStaticHost: appConfig.app.search.staticHost,
                    targetHost: appConfig.targetHost,
                    defaultLocale: appConfig.locale
                }
            },
            src: [
                '<%= buildDevPath %>/index.html',
                '<%= buildDevPath %><%= resourcesPath %>/unified-controller/<%= appName %>/globalContext.json',
                '<%= buildDevPath %><%= featureTemplatesPath %>/**/templates-bundle.js',
                '<%= buildDevPath %><%= featureStylesPath %>/**/*.css'
            ]
        },
        prod: {
            options: {
                inline: true,
                context: {
                    appNameVersioned: appConfig.appFolder,
                    appVersion: appConfig.appVersion,
                    appCommonNameVersioned: common,
                    appCommonVersion: appConfig.appCommonVersion,
                    appHomepageVersioned: appConfig.appHomepage.version,
                    targetHost: appConfig.targetHost
                }
            },
            src: [
                '<%= buildProdPath %>/index.html',
                '<%= buildProdPath %><%= resourcesPath %>/unified-controller/<%= appName %>/globalContext.json',
                '<%= buildProdPath %><%= featureTemplatesPath %>/**/templates-bundle.js',
                '<%= buildProdPath %><%= featureStylesPath %>/**/*.css'
            ]
        }
    }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-bg-shell');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dustjs');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-sh-precompile');
    grunt.loadNpmTasks('grunt-preprocess');

    // Our Common Components Here:
    grunt.loadTasks('node_modules/@stubhub/common-build-files/grunt-tasks/app');


    // builds need to do the following (in brackets needs to run in prod build only):
    // - clean
    // - optimize and copy images   -> this should use 'imagemin:dev' but has version issues, so we use 'copy:imgDev' for now
    // - compile (and concat) and copy styles
    // - compile templates
    // - (optimize, concat and uglify) and copy scripts                  \
    // - (minify) and copy html     -> is an individual task for PROD     -> single copy task for DEV
    // - copy auxiliary files       -> is an individual task for PROD    /


    // test task to run unit tests
    grunt.registerTask('testUnit',
        ('Unit tests').red + ('\nRuns the unit tests').yellow,
        ['buildTest', 'karma']);

    // test task to run both unit and functional tests
    grunt.registerTask('test',
        ('Unit plus functional tests').red + ('\nRuns the unit and functional tests for the DEV build').yellow,
        ['testUnit', 'testFunc']);

    //build task to compile and copy source code to build-test
    grunt.registerTask('buildTest',
        ('TEST build').red + ('\nCompiles and copies source code to ').yellow + ('build-test').red + (' folder').yellow,
        ['clean:test', 'copy:imgTest', 'compileSass:test', 'cssmin:test', 'dustjs:test', 'copy:test']);

    // build task to compile and copy source code to build-dev
    grunt.registerTask('build',
        ('DEV build').red + ('\nCompiles and copies source code to ').yellow + ('build-dev').red + (' folder').yellow,
        ['clean:dev', 'clean:tmp', 'sh_clean', 'sh_modules', 'copy:imgDev', 'compileSass:dev', 'cssmin:dev', 'sh_precompile:dev', 'dustjs:dev', 'concat:dev', 'copy:dev', 'requirejs:dev', 'requirejs:blueprintJS_dev', 'preprocess:dev']);

    // server task to start PROD server
    grunt.registerTask('serverProd',
        ('PROD server').red + ('\nBuilds code and starts a web server for the PROD build at ').yellow + ('http://localhost:8888/' + appConfig.appUrlPath + '/').white,
        ['buildProd', 'configureProxies:prod', 'connect:prod']);

    // tests task to run functional tests for PROD build
    grunt.registerTask('testFuncProd',
        ('PROD functional tests').red + ('\nRuns the functional tests for the PROD build').yellow,
        ['casper:prod']);

    // build task to compile and copy source code to build-prod
    grunt.registerTask('buildProd',
        ('PROD build').red + ('\nCompiles, optimizes and copies source code to ').yellow + ('build-prod').red + (' folder').yellow,
        ['clean:prod', 'clean:tmp', 'sh_clean', 'sh_modules', 'copy:imgProd', 'compileSass:prod', 'cssmin:prod', 'sh_precompile:prod', 'dustjs:prod', 'concat:prod', 'copy:prod', 'requirejs:prod', 'htmlmin:prod', 'requirejs:blueprintJS_prod', 'preprocess:prod']);

    // test task to run functional tests for DEV build
    grunt.registerTask('testFunc',
        ('<<<<< DEV functional tests <').red.bold + ('\nRuns the functional tests for the DEV build').yellow,
        ['casper:dev']);

    // server task to start TEST server
    grunt.registerTask('serverTest',
        ('<<<<< DEV unit test server <').red.bold + ('\nStarts a web server for the UNIT TEST results at ').yellow + ('http://localhost:9999/unit.html').white,
        ['buildTest', 'connect:test', 'watch:test']);

    // server task to start DEV server
    grunt.registerTask('server',
        ('<<<<< DEV server < ').red.bold + ('\nBuilds code and starts a web server for the DEV build at ').yellow + ('http://localhost:7777/' + appConfig.appUrlPath + '/').white + (' and watches for code changes').yellow,
        ['build', 'configureProxies:dev', 'connect:dev', 'watch:dev']);

    // task to copy DEV build to a DEPLOYMENT folder
    grunt.registerTask('deploy',
        ('<<<<< DEPLOY DEV build < ').red.bold + ('\nBuilds DEV code and DEPLOYs to a separate local server and watches for code changes').yellow,
        ['build', 'copy:deployDev', 'watch:deploy']);

    // Injects Sass globals and compiles Sass
    grunt.registerTask('compileSass', function(env) {
        console.log('compileSass', env);

        // Write Sass Globals to _globals_.scss file
        fs.writeFileSync("app/styles/_globals_.scss", "/* Written by GruntFile */\r\n$img_path: \"" + grunt.config.get("featureImagesPath") + "\";");
        
        grunt.task.run('sass:' + env);
    });
};
