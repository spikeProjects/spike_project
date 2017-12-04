define({
    "dataframe": {
        "records": [
            {
                "province": "广东省",
                "avg__population": 104303132,
                "avg__area": 18
            },
            {
                "province": "山东省",
                "avg__population": 95793065,
                "avg__area": 15.380000114440918
            },
            {
                "province": "河南省",
                "avg__population": 94023567,
                "avg__area": 16.700000762939453
            },
            {
                "province": "四川省",
                "avg__population": 80418200,
                "avg__area": 48.13999938964844
            },
            {
                "province": "江苏省",
                "avg__population": 78659903,
                "avg__area": 10.260000228881836
            },
            {
                "province": "河北省",
                "avg__population": 71854204,
                "avg__area": 18.739999771118164
            },
            {
                "province": "湖南省",
                "avg__population": 65683722,
                "avg__area": 21.18000030517578
            },
            {
                "province": "安徽省",
                "avg__population": 59500510,
                "avg__area": 13.970000267028808
            },
            {
                "province": "湖北省",
                "avg__population": 57237740,
                "avg__area": 18.59000015258789
            },
            {
                "province": "浙江省",
                "avg__population": 54426891,
                "avg__area": 10.199999809265136
            },
            {
                "province": "广西壮族自治区",
                "avg__population": 46026629,
                "avg__area": 23.600000381469726
            },
            {
                "province": "云南省",
                "avg__population": 45966239,
                "avg__area": 38.33000183105469
            },
            {
                "province": "江西省",
                "avg__population": 44567475,
                "avg__area": 16.700000762939453
            },
            {
                "province": "辽宁省",
                "avg__population": 43746323,
                "avg__area": 14.59000015258789
            },
            {
                "province": "黑龙江省",
                "avg__population": 38312224,
                "avg__area": 45.47999954223633
            },
            {
                "province": "陕西省",
                "avg__population": 37327378,
                "avg__area": 20.559999465942383
            },
            {
                "province": "福建省",
                "avg__population": 36894216,
                "avg__area": 12.130000114440918
            },
            {
                "province": "山西省",
                "avg__population": 35712111,
                "avg__area": 15.630000114440918
            },
            {
                "province": "贵州省",
                "avg__population": 34746468,
                "avg__area": 17.600000381469726
            },
            {
                "province": "重庆市",
                "avg__population": 28846170,
                "avg__area": 8.229999542236328
            },
            {
                "province": "吉林省",
                "avg__population": 27462297,
                "avg__area": 18.739999771118164
            },
            {
                "province": "甘肃省",
                "avg__population": 25575254,
                "avg__area": 45.439998626708984
            },
            {
                "province": "内蒙古自治区",
                "avg__population": 24706321,
                "avg__area": 118.30000305175781
            },
            {
                "province": "台湾省",
                "avg__population": 23373517,
                "avg__area": 3.5999999046325683
            },
            {
                "province": "上海",
                "avg__population": 23019148,
                "avg__area": 0.6299999952316284
            },
            {
                "province": "新疆维吾尔自治区",
                "avg__population": 21813334,
                "avg__area": 166
            },
            {
                "province": "Beijing",
                "avg__population": 19612368,
                "avg__area": 1.6799999475479126
            },
            {
                "province": "天津市",
                "avg__population": 12938224,
                "avg__area": 1.1299999952316284
            },
            {
                "province": "海南省",
                "avg__population": 8671518,
                "avg__area": 3.4000000953674316
            },
            {
                "province": "香港特别行政区",
                "avg__population": 7184000,
                "avg__area": 0.10999999940395355
            },
            {
                "province": "宁夏回族自治区",
                "avg__population": 6301350,
                "avg__area": 6.639999866485596
            },
            {
                "province": "青海省",
                "avg__population": 5626722,
                "avg__area": 72.2300033569336
            },
            {
                "province": "西藏自治区",
                "avg__population": 3002166,
                "avg__area": 122.83999633789062
            },
            {
                "province": "澳门特别行政区",
                "avg__population": 614500,
                "avg__area": 0.003280000062659383
            },
            {
                "province": "上海市",
                "avg__population": 1,
                "avg__area": 1
            }
        ],
        "columns": [
            "province",
            "avg__population",
            "avg__area"
        ]
    },
    "query": "SELECT province AS province,\n       AVG(population) AS avg__population,\n       AVG(area) AS avg__area\nFROM pilot.chinese_population\nGROUP BY province\nORDER BY avg__population DESC LIMIT 5000",
    "data": [
        {
            "province": "广东省",
            "m2": 18,
            "m1": 104303132,
            "code": "guangdong"
        },
        {
            "province": "山东省",
            "m2": 15.380000114440918,
            "m1": 95793065,
            "code": "shandong"
        },
        {
            "province": "河南省",
            "m2": 16.700000762939453,
            "m1": 94023567,
            "code": "henan"
        },
        {
            "province": "四川省",
            "m2": 48.13999938964844,
            "m1": 80418200,
            "code": "sichuan"
        },
        {
            "province": "江苏省",
            "m2": 10.260000228881836,
            "m1": 78659903,
            "code": "jiangsu"
        },
        {
            "province": "河北省",
            "m2": 18.739999771118164,
            "m1": 71854204,
            "code": "hebei"
        },
        {
            "province": "湖南省",
            "m2": 21.18000030517578,
            "m1": 65683722,
            "code": "hunan"
        },
        {
            "province": "安徽省",
            "m2": 13.970000267028808,
            "m1": 59500510,
            "code": "anhui"
        },
        {
            "province": "湖北省",
            "m2": 18.59000015258789,
            "m1": 57237740,
            "code": "hubei"
        },
        {
            "province": "浙江省",
            "m2": 10.199999809265136,
            "m1": 54426891,
            "code": "zhejiang"
        },
        {
            "province": "广西壮族自治区",
            "m2": 23.600000381469726,
            "m1": 46026629,
            "code": "guangxi"
        },
        {
            "province": "云南省",
            "m2": 38.33000183105469,
            "m1": 45966239,
            "code": "yunnan"
        },
        {
            "province": "江西省",
            "m2": 16.700000762939453,
            "m1": 44567475,
            "code": "jiangxi"
        },
        {
            "province": "辽宁省",
            "m2": 14.59000015258789,
            "m1": 43746323,
            "code": "liaoning"
        },
        {
            "province": "黑龙江省",
            "m2": 45.47999954223633,
            "m1": 38312224,
            "code": "heilongjiang"
        },
        {
            "province": "陕西省",
            "m2": 20.559999465942383,
            "m1": 37327378,
            "code": "shaanxi"
        },
        {
            "province": "福建省",
            "m2": 12.130000114440918,
            "m1": 36894216,
            "code": "fujian"
        },
        {
            "province": "山西省",
            "m2": 15.630000114440918,
            "m1": 35712111,
            "code": "shanxi"
        },
        {
            "province": "贵州省",
            "m2": 17.600000381469726,
            "m1": 34746468,
            "code": "guizhou"
        },
        {
            "province": "重庆市",
            "m2": 8.229999542236328,
            "m1": 28846170,
            "code": "chongqing"
        },
        {
            "province": "吉林省",
            "m2": 18.739999771118164,
            "m1": 27462297,
            "code": "jilin"
        },
        {
            "province": "甘肃省",
            "m2": 45.439998626708984,
            "m1": 25575254,
            "code": "gansu"
        },
        {
            "province": "内蒙古自治区",
            "m2": 118.30000305175781,
            "m1": 24706321,
            "code": "neimenggu"
        },
        {
            "province": "台湾省",
            "m2": 3.5999999046325683,
            "m1": 23373517,
            "code": "taiwan"
        },
        {
            "province": "上海",
            "m2": 0.6299999952316284,
            "m1": 23019148,
            "code": "shanghai"
        },
        {
            "province": "新疆维吾尔自治区",
            "m2": 166,
            "m1": 21813334,
            "code": "xinjiang"
        },
        {
            "province": "北京市",
            "m2": 1.6799999475479126,
            "m1": 19612368,
            "code": "beijing"
        },
        {
            "province": "天津市",
            "m2": 1.1299999952316284,
            "m1": 12938224,
            "code": "tianjin"
        },
        {
            "province": "海南省",
            "m2": 3.4000000953674316,
            "m1": 8671518,
            "code": "hainan"
        },
        {
            "province": "香港特别行政区",
            "m2": 0.10999999940395355,
            "m1": 7184000,
            "code": "hongkong"
        },
        {
            "province": "宁夏回族自治区",
            "m2": 6.639999866485596,
            "m1": 6301350,
            "code": "ningxia"
        },
        {
            "province": "青海省",
            "m2": 72.2300033569336,
            "m1": 5626722,
            "code": "qinghai"
        },
        {
            "province": "西藏自治区",
            "m2": 122.83999633789062,
            "m1": 3002166,
            "code": "xizang"
        },
        {
            "province": "澳门特别行政区",
            "m2": 0.003280000062659383,
            "m1": 614500,
            "code": "aomen"
        },
        {
            "province": "上海市",
            "m2": 1,
            "m1": 1,
            "code": "shanghai"
        }
    ],
    "form_data": {
        "flt_eq_4": "",
        "standalone": "",
        "flt_eq_1": "",
        "collapsed_fieldsets": "",
        "flt_op_0": "in",
        "flt_op_5": "in",
        "flt_col_7": "",
        "secondary_metric": "avg__area",
        "flt_col_3": "",
        "flt_eq_5": "",
        "flt_op_7": "in",
        "time_grain_sqla": "Time Column",
        "flt_eq_0": "",
        "rename_bubble_metric": "",
        "flt_col_1": "",
        "show_colors": true,
        "flt_col_4": "",
        "flt_op_2": "in",
        "granularity_sqla": "None",
        "where": "",
        "since": "100 years ago",
        "rename_color_metric": "人均面积",
        "json": "true",
        "show_bubbles": true,
        "flt_op_9": "in",
        "max_bubble_size": "25",
        "flt_op_3": "in",
        "entity": "province",
        "viz_type": "chinese_map",
        "flt_op_4": "in",
        "flt_eq_6": "",
        "having": "",
        "force": "true",
        "metric": "avg__population",
        "slice_id": "32",
        "show_color_values": true,
        "flt_op_6": "in",
        "flt_eq_7": "",
        "slice_name": "ffffffff",
        "show_bubble_values": true,
        "flt_eq_2": "",
        "async": "",
        "flt_col_2": "",
        "flt_op_1": "in",
        "flt_col_9": "",
        "flt_eq_9": "",
        "flt_col_8": "",
        "flt_col_0": "",
        "flt_op_8": "in",
        "extra_filters": "",
        "flt_eq_8": "",
        "previous_viz_type": "chinese_map",
        "flt_col_6": "",
        "flt_col_5": "",
        "bubble_value_format": ".3s",
        "flt_eq_3": "",
        "color_value_format": ".3s",
        "until": "now"
    },
    "status": "success",
    "cache_key": "d5f3f575f9b87afc2d1726116d0721ee",
    "cached_dttm": "2017-12-04T01:20:56",
    "cache_timeout": 3600,
    "json_endpoint": "/p/explore_json/table/10/?flt_eq_0=&rename_bubble_metric=&show_bubble_values=y&show_bubble_values=false&flt_col_0=&show_colors=y&show_colors=false&new_slice_name=&datasource_name=pilot.chinese_population&optionsRadios=datasource&having=&force=true&new_dashboard_name=&viz_type=chinese_map&full_tb_name=&previous_viz_type=chinese_map&metric=avg__population&goto_dash=false&collapsed_fieldsets=&granularity_sqla=None&show_color_values=y&show_color_values=false&save_to_dashboard_id=&flt_op_0=in&time_grain_sqla=Time+Column&slice_name=ffffffff&bubble_value_format=.3s&datasource_type=table&since=100+years+ago&until=now&rename_color_metric=%E4%BA%BA%E5%9D%87%E9%9D%A2%E7%A7%AF&where=&datasource_id=10&color_value_format=.3s&rdo_save=overwrite&database_id=&show_bubbles=y&show_bubbles=false&secondary_metric=avg__area&add_to_dash=false&entity=province&userid=1&max_bubble_size=25",
    "csv_endpoint": "/p/explore/table/10/?flt_eq_0=&csv=true&show_bubble_values=y&show_bubble_values=false&flt_col_0=&show_colors=y&show_colors=false&new_slice_name=&datasource_name=pilot.chinese_population&optionsRadios=datasource&having=&force=true&new_dashboard_name=&viz_type=chinese_map&full_tb_name=&previous_viz_type=chinese_map&metric=avg__population&goto_dash=false&collapsed_fieldsets=&granularity_sqla=None&show_color_values=y&show_color_values=false&save_to_dashboard_id=&flt_op_0=in&time_grain_sqla=Time+Column&slice_name=ffffffff&bubble_value_format=.3s&datasource_type=table&since=100+years+ago&until=now&rename_color_metric=%E4%BA%BA%E5%9D%87%E9%9D%A2%E7%A7%AF&where=&datasource_id=10&color_value_format=.3s&rdo_save=overwrite&database_id=&rename_bubble_metric=&show_bubbles=y&show_bubbles=false&secondary_metric=avg__area&add_to_dash=false&entity=province&userid=1&max_bubble_size=25",
    "is_cached": false,
    "filter_endpoint": "/p/filter/table/10/?flt_eq_0=&rename_bubble_metric=&show_bubble_values=y&show_bubble_values=false&flt_col_0=&show_colors=y&show_colors=false&new_slice_name=&datasource_name=pilot.chinese_population&action=&having=&force=true&new_dashboard_name=&viz_type=chinese_map&full_tb_name=&previous_viz_type=chinese_map&metric=avg__population&optionsRadios=datasource&goto_dash=false&collapsed_fieldsets=&granularity_sqla=None&show_color_values=y&show_color_values=false&save_to_dashboard_id=&flt_op_0=in&time_grain_sqla=Time+Column&slice_name=ffffffff&bubble_value_format=.3s&datasource_type=table&since=100+years+ago&until=now&rename_color_metric=%E4%BA%BA%E5%9D%87%E9%9D%A2%E7%A7%AF&where=&datasource_id=10&color_value_format=.3s&json=true&rdo_save=overwrite&database_id=&show_bubbles=y&show_bubbles=false&secondary_metric=avg__area&add_to_dash=false&entity=province&slice_id=32&userid=1&max_bubble_size=25",
    "standalone_endpoint": "/p/explore/table/10/?flt_eq_0=&rename_bubble_metric=&show_bubble_values=y&show_bubble_values=false&flt_col_0=&show_colors=y&show_colors=false&new_slice_name=&datasource_name=pilot.chinese_population&optionsRadios=datasource&having=&force=true&new_dashboard_name=&viz_type=chinese_map&full_tb_name=&previous_viz_type=chinese_map&metric=avg__population&goto_dash=false&collapsed_fieldsets=&granularity_sqla=None&show_color_values=y&show_color_values=false&save_to_dashboard_id=&flt_op_0=in&time_grain_sqla=Time+Column&slice_name=ffffffff&bubble_value_format=.3s&datasource_type=table&since=100+years+ago&until=now&rename_color_metric=%E4%BA%BA%E5%9D%87%E9%9D%A2%E7%A7%AF&where=&datasource_id=10&color_value_format=.3s&rdo_save=overwrite&database_id=&show_bubbles=y&show_bubbles=false&standalone=true&secondary_metric=avg__area&add_to_dash=false&entity=province&userid=1&max_bubble_size=25",
    "column_formats": {},
    "error": null
});
