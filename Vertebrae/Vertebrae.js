/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4-vsdoc.js" />

// Vertebrae Framework 
// Version: 0.2.5, Last updated: 2/09/2011
// 
// Project Home - http://www.pexelu.com/vert
// GitHub       - https://github.com/thinkdevcode/Vertebrae
// Contact      - gin4lyfe@gmail.com
// 
// See License.txt for full license
// 
// Copyright (c) 2011 Eugene Alfonso,
// Licensed under the MIT license.

(function (window, undefined) {

    var root = this,

    /*
    *
    *   Give your application some bones!!
    *
    */
    vertebrae = {

        version: '0.2.5',

        /*
        *
        *   Vertebrae 'View' Module
        *
        */
        view: {

            /*
            *   add() - add a jquery object to view cache
            *
            *       ctrlName [string] [not optional]
            *           the name of the control
            *
            *       jqObject [object] [not optional]
            *           the jQuery object to add to cache
            *
            */
            add: function (ctrlName, jqObject) {

                //create cache if doesn't exist
                this.cache = this.cache || {};

                //verify ctrlName exists and is a string
                if (ctrlName && typeof ctrlName === 'string') {

                    //verify jqObject exists and is an object
                    if (jqObject && typeof jqObject === 'object') {

                        //verify control doesnt already exist in cache
                        if (!this.cache[ctrlName]) {

                            //add control to cache
                            this.cache[ctrlName] = jqObject;
                        }
                    }
                }
            },

            /*
            *   upd() - update a jquery object in view cache
            *
            *       ctrlName [string] [not optional]
            *           the name of the control
            *
            *       jqObject [object] [not optional]
            *           the jQuery object to update in the cache
            *
            */
            upd: function (ctrlName, jqObject) {

                //verify ctrlName exists and is a string
                if (ctrlName && typeof ctrlName === 'string') {

                    //verify jqObject exists and is an object
                    if (jqObject && typeof jqObject === 'object') {

                        //verify cache exists and control exists in cache
                        if (this.cache && this.cache[ctrlName]) {

                            //update object
                            this.cache[ctrlName] = jqObject;
                        }
                    }
                }
            },

            /*
            *   get() - get the jQuery object from cache
            *
            *       ctrlName [string] [not optional]
            *           the name of the control
            *
            */
            get: function (ctrlName) {
                //verify ctrlName exists and is a string
                if (ctrlName && typeof ctrlName === 'string') {

                    //verify cache exists and the control inside of it
                    if (this.cache && this.cache[ctrlName]) {

                        //return the jQ object
                        return this.cache[ctrlName];
                    }
                }
            }

        },

        /*
        *
        *   Vertebrae 'Data' Module
        *
        */
        data: {

            /*
            *   addHandler() - create a handler to a data service
            *
            *       hndlrName [string] [not optional]
            *           the name of the handler
            *
            *       serviceURL [string] [not optional]
            *           the URL to the data source/service
            *
            */
            addHandler: function (hndlrName, serviceURL) {

                //verify handler name exists and its a string
                if (hndlrName && typeof hndlrName === 'string') {

                    //verify service url exists and its a string
                    if (serviceURL && typeof serviceURL === 'string') {

                        //verify handler name isnt already taken
                        if (!this[hndlrName]) {

                            //create new function with handler name
                            //  obj [object] OR [null] [not optional] 
                            //  succ [function] [optional]
                            //  err [function] [optional]
                            //  pre [function] [optional]
                            this[hndlrName] = function (obj, succ, err, pre) {

                                $.ajax({

                                    //use POST when dealing with .NET
                                    type: "POST",

                                    //ex: 'Default.aspx/GetUsers'
                                    url: serviceURL,

                                    //if no paramaters, pass in null, else stringify the json object (requires json2.js) 
                                    data: (obj === null) ? '{}' : JSON.stringify(obj),

                                    //content type used with .NET
                                    contentType: "application/json; charset=utf-8",

                                    //default data type 
                                    dataType: "json",

                                    //if pre-send callback exists, use it, else use blank function
                                    beforeSend: pre || function () { },

                                    //if error callback exists, use it, else use blank function
                                    error: err || function () { },

                                    //success function recieves json data from data service
                                    success: function (e) {

                                        //verify success callback exists and is a function
                                        if (typeof succ === 'function') {

                                            //if data that is returned is an array, do not parse
                                            if (e.d instanceof Array) {
                                                succ(e.d);
                                            }

                                            //data is json - parse and send back to success callback (requires json2.js)
                                            else {
                                                succ(JSON.parse(e.d));
                                            }
                                        }
                                    }
                                });
                            };
                        }
                    }
                }
            },

            /*
            *   regAjaxEvents() - register anajaxStart and ajaxStop functions (for .NET - must use scriptmanager) 
            *
            *       startHndlr [string] [not optional]
            *           the name of the handler
            *
            *       stopHndlr [string] [not optional]
            *           the URL to the data source/service
            *
            */
            regAjaxEvents: function (startHndlr, stopHndlr) {

                //verify Sys namespace exists
                if (Sys) {

                    if (typeof startHndlr === 'function') {
                        Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(startHndlr);
                    }

                    if (typeof stopHndlr === 'function') {
                        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(stopHndlr);
                    }
                }
            }

        },

        /*
        *
        *   Vertebrae 'Event' Module
        *
        */
        event: {

            /*
            *   fire() - fire a custom event
            *
            *       evntName [string] OR [array(strings)] [not optional]
            *           the event name or name of events to fire
            *
            */
            fire: function (evntName) {

                //verify event name is defined and event cache exists
                if (evntName && this.evntCache) {

                    //determine if evntName is a string
                    if (typeof evntName === 'string') {

                        //verify event exists in cache
                        if (this.evntCache[evntName]) {

                            //loop through event stack and fire event handlers
                            vertebrae.util.forEach(this.evntCache[evntName], function (fn) { fn(); });
                        }
                    }

                    //determine if evntName is an array
                    else if (evntName instanceof Array) {

                        //loop through events
                        vertebrae.util.forEach(evntName, function (evnt) {

                            //verify event exists in stack
                            if (this.evntCache[evnt]) {

                                //loop through event stack and fire event handlers
                                vertebrae.util.forEach(this.evntCache[evnt], function (fn) { fn(); });
                            }
                        });
                    }
                }
            },

            /*
            *   addHandler() - create a custom event handler
            *
            *       hndlrName [string] [not optional]
            *           the name of the handler
            *
            *       hndlrFn [function] [not optional]
            *           the handler callback
            *
            */
            addHandler: function (hndlrName, hndlrFn) {

                //verify handler name exists and is a string
                if (hndlrName && typeof hndlrName === 'string') {

                    //verify handler function exists and is a function
                    if (hndlrFn && typeof hndlrFn === 'function') {

                        //create handler cache if it doesnt exist
                        this.hndlrCache = this.hndlrCache || {};

                        //verify handler isnt already in cache (by name)
                        if (!this.hndlrCache[hndlrName]) {

                            //add handler to cache
                            this.hndlrCache[hndlrName] = hndlrFn;
                        }
                    }
                }
            },

            /*
            *   getHandler() - get a custom event handler from cache
            *
            *       hndlrName [string] [not optional]
            *           the name of the handler to get
            *
            */
            getHandler: function (hndlrName) {

                //verify handler name exists and is a string
                if (hndlrName && typeof hndlrName === 'string') {

                    //see if handler exists in cache
                    if (this.hndlrCache[hndlrName]) {

                        //return handler
                        return this.hndlrCache[hndlrName];
                    }
                }
            },

            /*
            *   add() - add an event
            *
            *       evntName [string] [not optional] 
            *           the event to bind to (can be custom event name or jQuery bind event)
            *
            *       hndlrName [string] OR [array(strings)] [not optional]  
            *           this can either be a string or an array of strings of event handler names
            *
            *       ctrlName [string] [optional]
            *           this is the jQuery object to perform a bind function on (only used for jQuery
            *           bind events - click, blur, focus, etc.)
            *                                       
            */
            add: function (evntName, hndlrName, ctrlName) {

                //create a cache for custom events if does not exist
                this.evntCache = this.evntCache || {};

                //verify evntName exists and is a string
                if (evntName && typeof evntName === 'string') {

                    //verify hndlrName exists and is a string
                    if (hndlrName && typeof hndlrName === 'string') {

                        //grab the handler from cache
                        var hndlr = this.getHandler(hndlrName);

                        //verify it exists and it is a function
                        if (hndlr && typeof hndlr === 'function') {

                            //verify ctrlName exists and is a string
                            if (ctrlName && typeof ctrlName === 'string') {

                                //grab the jQuery object from view cache
                                var ctrl = vertebrae.view.get(ctrlName);

                                //verify it exists is an object
                                if (ctrl && typeof ctrl === 'object') {

                                    //bind it
                                    ctrl.bind(evntName, hndlr);
                                }
                            }

                            // create a custom event
                            else {

                                //add a new event to event cache if one doesnt already exist
                                this.evntCache[evntName] = this.evntCache[evntName] || [];

                                //push the hndlr onto the events stack
                                this.evntCache[evntName].push(hndlr);
                            }
                        }
                    }

                    //if hndlrName is an array of handlers
                    else if (hndlrName instanceof Array) {

                        //verify ctrlName exists and is a string
                        if (ctrlName && typeof ctrlName === 'string') {

                            //grab the jQuery object from view cache
                            var ctrl = vertebrae.view.get(ctrlName);

                            //verify it exists is an object
                            if (ctrl && typeof ctrl === 'object') {

                                //loop through and bind events to jQuery object
                                vertebrae.util.forEach(hndlrName, function (fn) {
                                    ctrl.bind(evntName, fn);
                                });
                            }
                        }

                        // create a custom event
                        else {

                            //add a new event to custom cache if one doesnt already exist
                            this.evntCache[evntName] = this.evntCache[evntName] || [];

                            //loop through and push the hndlr's onto the events stack
                            vertebrae.util.forEach(hndlrName, function (fn) {
                                vertebrae.event.evntCache[evntName].push(vertebrae.event.getHandler(fn));
                            });
                        }
                    }
                }
            }

        },

        /*
        *
        *   Vertebrae 'Utility' Module
        *
        */
        util: {

            /*
            *   forEach() - get a custom event handler from cache
            *
            *       hndlrName [string] [not optional]
            *           the name of the handler to get
            *
            */
            forEach: function (array, fn) {

                var len = array.length;

                for (var i = 0; i < len; i++) {

                    //call fn with the item in the array and the index of item
                    if (fn.call(array, array[i], i) === false) {
                        break;
                    }
                }
            }

        },

        /*
        *
        *   Vertebrae 'Validation' Module
        *
        */
        val: {

            // *note* original function from: 
            // http://rgagnon.com/jsdetails/js-0063.html
            isDate: function (strValue) {
                /************************************************
                DESCRIPTION: Validates that a string contains only
                valid dates with 2 digit month, 2 digit day,
                4 digit year. Date separator can be ., -, or /.
                Uses combination of regular expressions and
                string parsing to validate date.
                Ex. mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy
                *************************************************/
                var objRegExp = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/
                if (!objRegExp.test(strValue))
                    return false;
                else {
                    var strSeparator = strValue.substring(2, 3)
                    var arrayDate = strValue.split(strSeparator);
                    var arrayLookup = { '01': 31, '03': 31,
                        '04': 30, '05': 31,
                        '06': 30, '07': 31,
                        '08': 31, '09': 30,
                        '10': 31, '11': 30, '12': 31
                    }
                    var intDay = parseInt(arrayDate[1], 10);
                    if (arrayLookup[arrayDate[0]] != null) {
                        if (intDay <= arrayLookup[arrayDate[0]] && intDay != 0)
                            return true;
                    }
                    var intMonth = parseInt(arrayDate[0], 10);
                    if (intMonth == 2) {
                        var intYear = parseInt(arrayDate[2]);
                        if (intDay > 0 && intDay < 29) {
                            return true;
                        }
                        else if (intDay == 29) {
                            if ((intYear % 4 == 0) && (intYear % 100 != 0) ||
                             (intYear % 400 == 0)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        }

    };

    root.vertebrae = vertebrae;

})(window);