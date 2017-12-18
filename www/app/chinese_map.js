define(function (require) {
    // Load any app-specific modules with a relative require call,
var utils = require('./utils');
const d3 = require('d3');
// Load library/vendor modules using full IDs, like:
var print = require('print');
var json, data, slice;
json = require('data');
slice = require('slice');
data = json.data;

const fd = json.form_data;

var Raphael = require('raphael');

let renderOperator = function(data = {

    'rename_bubble_metric': 'rename_bubble_metric',
    'rename_color_metric': 'rename_color_metric',

    'bubble_max': 'bubble-max', //m1
    'bubble_min': 'bubble-min',

    'color_max': 'color-max', //m2
    'color_min': 'color-min',

    'show_bubbles': 'show_bubbles',
    'show_colors': 'show_colors' //show_colors
}) {
    let renameBubble = _ => {
        let flag = _ && data['show_bubbles'];
        let template = (flag ? `<li>
            <input value="${_}" class="renamed bubble" name="renamed-bubble" disabled />
        </li>` : ``);
        return template;
    }

    let renameColor = _ => {
        let flag = _ && data['show_colors'];
        let template = (flag ? `<li>
            <input value="${_}" class="renamed color" name="renamed-color" disabled />
        </li>` : ``);
        return template;
    }

    let showBubble = _ => {
        let template = (_ ? `<li class="bubble-max"><span></span>< ${data['bubble_max']}</li>
        <li class="bubble-min"><span></span>< ${data['bubble_min']}</li>` : ``);
        return template;
    }

    let showColorsValue = _ => {
        let template = (_ ? `<li class="gradient">
            <div class="color-max"> < ${data['color_max']}</div>
            <div class="color-min"> < ${data['color_min']}</div>
        </li>` : ``);
        return template;
    }

/*    let template = `<ul class="operate">
        ${renameBubble(data['rename_bubble_metric'])}
        ${showBubble(data['show_bubbles'])}
        ${renameColor(data['rename_color_metric'])}
        ${showColorsValue(data['show_colors'])}
    </ul>`;*/
    let template = `<ul class="operate">
        ${renameColor(data['rename_color_metric'])}
        ${showColorsValue(data['show_colors'])}
    </ul>`;

    return template;
};

Math.formatFloat = function(f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}

let renderMap,
	renderObj,
    adjustData,
    adjustPosition,
    setColor,
    bubbleFormat,
    colorFormat,
    params = {},
    R,
    china;

let areaAttr = {
    "fill": "#00a0de",
    "stroke": "#fff",
    "stroke-width": 1,
    "stroke-linejoin": "round"
};

var attrTest = {
	"fill" : "#000",
	"stroke" : "#ccc",
	"stroke-width" : 1,
	"stroke-linejoin" : "round"
};

bubbleFormat = d3.format(fd['bubble_value_format']);
colorFormat = d3.format(fd['color_value_format']);

const ext = d3.extent(data, function(d) { //the ladder here 
    return d.m1;
});

const extRadius = d3.extent(data, function(d) { //the ladder here 
    return d.m2;
});

params.bubble_max = bubbleFormat(ext[1], 3);
params.bubble_min = bubbleFormat(ext[0], 3);

params.color_max = colorFormat(extRadius[1], 3);
params.color_min = colorFormat(extRadius[0], 3);

params.show_bubbles = fd.show_bubbles;
params.show_colors = fd.show_colors;

params.rename_bubble_metric = fd.rename_bubble_metric || fd.metric;
params.rename_color_metric = fd.rename_color_metric || fd.secondary_metric;

$('#ChinaMap').prepend(renderOperator(params)); //slice_container

$('.bubble-max span').css({
    'width': fd.max_bubble_size * 2,
    'height': fd.max_bubble_size * 2,
    'border-radius': fd.max_bubble_size + 'px',
    'left': 30 - fd.max_bubble_size - 5 + 'px',
    'top': 30 - fd.max_bubble_size + 'px',
});

const radiusScale = d3.scale.linear()
    .domain([ext[0], ext[1]])
    .range([1, fd.max_bubble_size]);

const colorScale = d3.scale.linear()
    .domain([extRadius[0], extRadius[1]])
    .range(['#b5d5e5', '#00a0de']);

data = data.map((d) => Object.assign({}, d, {
    radius: radiusScale(d.m1),
    fillColor: colorScale(d.m2),
}));

renderObj = utils.renderMap();
china = renderObj.china;
china = utils.adjustData(china, data);
R = renderObj.r;

$('#tiplayer').length < 1 && $('body').append('<div id="tiplayer" style=" display:none;"></div>');

var tiplayer = $('#tiplayer');
var current;
var bbox;
var circle;
var amount;

for (var state in china) {

    bbox = china[state].path.getBBox();

    //no-1: show bubble and TODO: show bubble value
    if (fd['show_bubbles']) {

        circle = china[state].path.paper.circle(china[state]['centor'].x, china[state]['centor'].y, +china[state].radius).attr({
            "fill": "#ffd733",
            "stroke": "#a09658",
            "stroke-width": 0
        });

        //no-3: show bubble value
        if (fd.show_bubble_values) {
            china[state].path.paper.text(china[state]['centor'].x, china[state]['centor'].y, bubbleFormat(china[state].m1));
        }

        (function(circle, state) {
            $(circle[0]).css('cursor', 'pointer');
            //write tip 
            $(circle[0]).hover(function(e) {
                var _ST = this;

                if (e.type == 'mouseenter') {
                    tiplayer.text(china[state]['name'] + '\n' + bubbleFormat(china[state].m1)).css({
                        'opacity': '0.95',
                        'top': (e.pageY + 10) + 'px',
                        'left': (e.pageX + 10) + 'px',
                        'background': '#fff',
                        'padding': '3px 5px'
                    }).fadeIn('normal');

                } else {
                    if (tiplayer.is(':animated'))
                        tiplayer.stop();
                    tiplayer.hide();
                }

            }, function() {
                tiplayer.hide();
            });

        })(circle, state)

    } //TODO: determine the bubble value to show

    //no-2: set color of fill

    //binding the events of show color number
    var attr = new Object(areaAttr);
    if (fd.show_colors) {
        attr.fill = china[state].fillColor;
        china[state].path.attr(attr);

        (function(st, state) {
            $(st[0]).css('cursor', 'pointer');
            //write tip 
            $(st[0]).hover(function(e) {
                var _ST = this;

                //xxxx: no need to hover highlight 1
                /*                        st.animate({
                                            fill: st.color,
                                            stroke: "#eee"
                                        }, 300);*/

                // st.toFront();
                R.safari && R.safari();

                if (e.type == 'mouseenter') {
                    tiplayer.text(china[state]['name'] + '\n' + colorFormat(china[state].m2)).css({
                        'opacity': '0.85',
                        'top': (e.pageY + 10) + 'px',
                        'left': (e.pageX + 10) + 'px',
                        'background': '#fff',
                        'padding': '3px 5px'
                    }).fadeIn('normal');

                } else {
                    if (tiplayer.is(':animated'))
                        tiplayer.stop();
                    tiplayer.hide();
                }

            }, function(e) {
                //xxxx: no need to hover highlight 2
                /*  china[state]['path'].animate({
                        fill: china[state].fillColor,
                        stroke: "#ddd"
                    }, 300);*/
                tiplayer.hide();
            });

        })(china[state]['path'], state);

        //no-3: show color value
        if (fd.show_color_values) {
            // china[state].path.paper.text(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, format(china[state].m2));
            china[state].path.paper.text(china[state]['centor'].x, china[state]['centor'].y, colorFormat(china[state].m2));
        }
    } else {
        china[state].path.attr(areaAttr);
    }
};

utils.adjustPosition()&& $tiplayer.hide();

window.onresize = utils.adjustPosition;


});
