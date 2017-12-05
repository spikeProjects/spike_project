casper.echo('#####################');
casper.echo('Functional tests for app-eventpage-splitscreen');
casper.echo('#####################');

casper.start(SH_testpageUrl);

casper.then(function() {
  this.test.comment("Page should exist");
  this.test.assert(this.getCurrentUrl() === SH_testpageUrl, 'Page can be accessed');

  //NOTE: this will fail. It's just an example.
  this.test.comment("DOM elements should exist");
  this.test.assertExists('#foo_view', '#foo_view DOM element should exist');

});

casper.run(function() {
  // check that all assertions have been executed
  this.test.done();
});
