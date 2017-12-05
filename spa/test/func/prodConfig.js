var SH_localhostPort = "8888";
var SH_testpageUrl = "http://localhost:" + SH_localhostPort + "/eventpage/";

casper.test.comment("----------------------------------------------------------------------------");
casper.test.comment("Casper running in PROD build config: expecting localhost server on port " + SH_localhostPort);
casper.test.comment("----------------------");

casper.SH_localhostPort = SH_localhostPort;
casper.SH_testpageUrl = SH_testpageUrl;
