(function(){dust.register("event-5.1.2-SNAPSHOT/ticketdetails_price",body_0);function body_0(chk,ctx){return chk.write("<div class=\"amount-value hidden\">").helper("format",ctx,{},{"value":ctx._get(false, ["amount"]),"style":"money","currency":ctx._get(false, ["currency"])}).write("</div><div class=\"dollar-value partials\">").helper("format",ctx,{},{"value":ctx._get(false, ["amount"]),"style":"money","currency":ctx._get(false, ["currency"]),"substyle":"style1"}).write("</div><div class=\"priceEachText\">").helper("eq",ctx,{"block":body_1},{"key":ctx._get(false,["globals","event_meta","country"]),"value":"CA"}).reference(ctx._get(false, ["eachText"]),ctx,"h").write("</div>");}function body_1(chk,ctx){return chk.reference(ctx._get(false, ["currency"]),ctx,"h");}return body_0;})();