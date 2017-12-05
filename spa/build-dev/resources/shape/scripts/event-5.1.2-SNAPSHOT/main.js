require([
    'app'
], function(app) {

    console.log('---main--- app:', app);
    app.initialize();
    app.start();
});
