var chart_Config = new Array(jModel.length + 1);
var nodes = new Array(jModel.length);
var config = {
    container: "#basic-example",
    connectors: {
        type: 'bCurve'
    },
    node: {
        HTMLclass: 'nodeExample1',
        collapsable: true
    }
};

chart_Config[0] = config;

for (k = 0; k < jModel.length; k++) {
    var varname = jModel[k]["id"];
    eval('var ' + varname + '= new Object()');
    eval(varname + '.text = new Object();');
    eval(varname + '.text.id = jModel[k]["id"];');
    eval(varname + '.text.name = jModel[k]["name"];');
    if (jModel[k]["parent"] == null) {
        eval(varname + '.text.parent = "null"');
    } else {
        eval(varname + '.text.parent = jModel[k]["parent"];');
    }
    eval(varname + '.text.quantity = jModel[k]["quantity"];');
    eval('chart_Config[k+1] = ' + varname + ';');
};

var check_table = new Array();

for (j = 1; j < chart_Config.length; j++) {
    if (chart_Config[j]["text"]["parent"] != "null") {
        for (i = 1; i < chart_Config.length; i++) {
            if (chart_Config[j]["text"]["parent"] == chart_Config[i]["text"]["id"]) {
                chart_Config[j]["parent"] = chart_Config[i];
            };
        };
    };
};