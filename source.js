/**
 * Created by randre03 on 10/23/14.
 */
//namespace
var chain = {};

//MODEL

//list model API
chain.save = function(list) {
  localStorage["chain-app.list"] = JSON.stringify(list);
};
chain.load = function() {
  return JSON.parse(localStorage["chain-app.list"] || "[]");
};

//date model API
chain.today = function() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}
chain.resetDate = function() {
  return localStorage["chain-app.start-date"] = chain.today().getTime();
};
chain.startDate = function() {
  return new Date(parseInt(localStorage["chain-app.start-date"] || chain.resetDate()));
};
chain.dateAt = function(index) {
  var date = new Date(chain.startDate());
  date.setDate(date.getDate() + index);
  return date;
};


//CONTROLLER
chain.controller = function() {
  var list = chain.load();

  this.isChecked = function(index) {
    return list[index];
  };

  this.check = function (index, status) {
    if(chain.dateAt(index).getTime() <= chain.today().getTime()) {
      list[index] = status;
      chain.save(list);
    }
  };
};

//VIEW
chain.view = function(ctrl) {
  return m("table", chain.seven(function(y) {
    return m("tr", chain.seven(function(x) {
      var index = chain.indexAt(x, y)
      return m("td", chain.highlights(index), [
        m("input[type=checkbox]", chain.checks(ctrl, index))
      ]);
    }));
  }));
};

//binding helper #1
chain.checks = function (ctrl, index) {
  return {
    onclick: function () {
      ctrl.check(index, this.checked);
    },
    checked:  ctrl.isChecked(index)
  };
};

//binding helper #2
chain.highlights = function(index) {
  return {
    style: {
      background: chain.dateAt(index).getTime() == chain.today().getTime() ? "silver" : ""
    }
  }
};

chain.indexAt = function (x, y) {
  return y * 7 + x;
};


//helper utility
chain.seven = function(subject) {
  var output =[];
  for(var i=0; i<7; i++) output.push(subject(i));
  return output;
};

//render and start-up
m.module(document.body, chain);
