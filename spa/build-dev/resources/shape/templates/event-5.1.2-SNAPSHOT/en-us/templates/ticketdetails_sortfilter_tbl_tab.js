(function(){dust.register("event-5.1.2-SNAPSHOT/ticketdetails_sortfilter_tbl_tab",body_0);function body_0(chk,ctx){return chk.write("<div class=\"sortfilter-tbl\"><div class=\"sectioncell\">").helper("if",ctx,{"else":body_1,"block":body_2},{"test":"sectionName == 'General Admission' && seatNumbers == 'General Admission'"}).write("</div><div class=\"rowcell ").exists(ctx._get(false,["globals","event_meta","isParking"]),ctx,{"block":body_3},null).write("\">").reference(ctx._get(false,["seats","0","row"]),ctx,"h").write("</div><div class=\"pricecell\">").section(ctx._get(false, ["usePrice"]),ctx,{"block":body_4},null).write("</div><div class=\"valuecell\"><div class=\"valuebarimage\"></div></div></div>");}function body_1(chk,ctx){return chk.reference(ctx._get(false, ["sectionName"]),ctx,"h");}function body_2(chk,ctx){return chk.write("General Admission");}function body_3(chk,ctx){return chk.write("invisible");}function body_4(chk,ctx){return chk.partial("/*@echo appNameVersioned*//ticketdetails_price",ctx,{"eachText":"/ea"});}return body_0;})();