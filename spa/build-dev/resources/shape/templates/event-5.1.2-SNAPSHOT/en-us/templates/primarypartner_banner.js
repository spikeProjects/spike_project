(function(){dust.register("event-5.1.2-SNAPSHOT/primarypartner_banner",body_0);function body_0(chk,ctx){return chk.write("<div class=\"partner-banner ").helper("eq",ctx,{"block":body_1},{"key":ctx._get(false, ["isHost"]),"value":"true","type":"boolean"}).write("\"><div class=\"partner-logo\"><span class=\"partner-logo-iconset sh-iconset sh-iconset-primarypartner ").notexists(ctx._get(false, ["isHost"]),ctx,{"block":body_2},null).write("\"></span></div><div class=\"partner-information\"><div class=\"partner-information-details\"><div class=\"partner-designation\">").reference(ctx._get(false, ["designation"]),ctx,"h").write("</div><div class=\"partner-gettickets-banner hide\"><a rel=\"external\" href=\"#\" class=\"see-partner-tickets-link\" target=\"_blank\">Get more tickets for<span class=\"primaryPerformer\"></span></a></div></div></div><div class=\"partner-performer-logo\"></div></div>");}function body_1(chk,ctx){return chk.write("host");}function body_2(chk,ctx){return chk.write("hide");}return body_0;})();