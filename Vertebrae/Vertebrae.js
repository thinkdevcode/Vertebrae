/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4-vsdoc.js" />

(function (window, undefined) {

    var root = this,

    vertebrae = {},

    view = {

        view: {

            add: function (name, jq) {
                this.cache = this.cache || {};
                if (!this.cache[name]) {
                    this.cache[name] = jq;
                }
            },

            upd: function (name, jq) {
                if (this.cache && this.cache[name]) {
                    this.cache[name] = jq;
                }
            },

            get: function (name) {
                if (this.cache) {
                    if (this.cache[name]) {
                        return this.cache[name];
                    }
                }
            }
        }
    },

    data = {

        data: {

            addHandler: function (name, url) {
                if (!this[name]) {
                    this[name] = function (obj, succ, err, pre) {
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: (obj === null) ? '{}' : JSON.stringify(obj),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            beforeSend: pre || function () { },
                            error: err || function () { },
                            success: function (e) {
                                if (typeof succ === 'function') {
                                    if (e.d instanceof Array) { succ(e.d); }
                                    else { succ(JSON.parse(e.d)); }
                                }
                            }
                        });
                    };
                }
            }
        }

    },

    event = {

        event: {

            addCustom: function (evntName, hndlrName) {
                this.custcache = this.custcache || {};
                var hndlr = this.getHandler(hndlrName);
                if (typeof hndlr === 'function') {
                    this.custcache[evntName] = this.custcache[evntName] || [];
                    this.custcache[evntName].push(hndlr);
                }
            },

            fire: function (evntName) {
                if (this.custcache && this.custcache[evntName]) {
                    _.each(this.custcache[evntName], function (fn) { fn(); });
                }
            },

            addHandler: function (name, hndlr) {
                this.cache = this.cache || {};
                if (!this.cache[name]) {
                    this.cache[name] = hndlr;
                }
            },

            getHandler: function (name) {
                if (this.cache[name]) {
                    return this.cache[name];
                }
            },

            add: function (ctrlName, evntName, hndlrName) {
                var hndlr = this.getHandler(hndlrName);
                if (typeof hndlr === 'function') {
                    var ctrl = view.view.get(ctrlName);
                    if (ctrl && typeof ctrl === 'object') {
                        ctrl.bind(evntName, hndlr);
                    }
                }
            }

        }
    };

    root.vertebrae = _.extend(vertebrae, view, data, event);

})();