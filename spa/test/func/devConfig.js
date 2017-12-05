var SH_localhostPort = "7777";
var SH_testpageUrl = "http://localhost:" + SH_localhostPort + "/eventpage/";

casper.test.comment("---------------------------------------------------------------------------");
casper.test.comment("Casper running in DEV build config: expecting localhost server on port " + SH_localhostPort);
casper.test.comment("---------------------");

casper.SH_localhostPort = SH_localhostPort;
casper.SH_testpageUrl = SH_testpageUrl;
