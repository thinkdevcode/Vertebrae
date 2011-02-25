/// <reference path="http://damianedwards.com/files/jquery/jquery-1.5-vsdoc.js" />

// Vertebrae Framework 
// Version: 0.3.0, Last updated: 2/25/2011
// 
// Project Home - http://thinkdevcode.wordpress.com
// GitHub       - https://github.com/thinkdevcode/Vertebrae
// Dependancy   - https://github.com/douglascrockford/JSON-js (json2.js)
// Contact      - gin4lyfe@gmail.com
// 
// See License.txt for full license
// 
// Copyright (c) 2011 Eugene Alfonso,
// Licensed under the MIT license.

(function (window, undefined) {

    if (!jQuery) { return; }

    /*
    *
    *   Give your application some bones!!
    *
    */
    var vertebrae = {

        version: '0.3.0',

        /*
        *
        *   Vertebrae 'View' Module
        *
        */
        view: {

            /*
            *   add() - add jquery object(s) to view cache
            *
            *       ctrlName [string] OR [object] [not optional]
            *           the name of the control or a map of controls
            *
            *       jqObject [object] [not optional]
            *           the jQuery object to add to cache
            *
            */
            add: function (ctrlName, jqObject) {

                this.cache = this.cache || {};

                if (typeof ctrlName === 'string') {
                    if (jqObject instanceof jQuery) {

                        if (!this.cache[ctrlName]) {
                            this.cache[ctrlName] = jqObject;
                        }
                    }
                }

                if (typeof ctrlName === 'object') {
                    jQuery.extend(this.cache, ctrlName);
                }

            },

            /*
            *   upd() - update a jquery object in view cache
            *
            *       ctrlName [string] OR [object] [not optional]
            *           the name of the control or a map of controls
            *
            *       jqObject [object] [not optional]
            *           the jQuery object to update in the cache
            *
            */
            upd: function (ctrlName, jqObject) {

                if (typeof ctrlName === 'string') {
                    if (jqObject instanceof jQuery) {

                        if (this.cache) {
                            this.cache[ctrlName] = jqObject;
                        }
                    }
                }

                else if (typeof ctrlName === 'object') {
                    jQuery.extend(this.cache, ctrlName);
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

                if (typeof ctrlName === 'string') {

                    if (this.cache && this.cache[ctrlName]) {
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
            *       serviceName [string] OR [array(string)] [not optional]
            *           the URL(s) to the data source/service
            *
            */
            addHandler: function (serviceName) {

                if (typeof serviceName === 'string') {

                    if (!this[serviceName]) {

                        //create new function with handler name
                        //  obj [object] OR [null] [not optional] 
                        //  succ [function] [optional]
                        //  err [function] [optional]
                        //  pre [function] [optional]
                        //  sync [boolean] [optional]
                        this[serviceName] = function (obj, succ, err, pre, sync) {

                            var currpage = this.pageName();

                            jQuery.ajax({

                                //use POST when dealing with .NET
                                type: 'POST',

                                async: ((typeof sync === 'boolean') ? sync : true),

                                //ex: 'Default.aspx/GetUsers'
                                url: (currpage !== '') ?
                                        (currpage + '/' + serviceName) :
                                            (typeof this.defPageName === 'string') ?
                                                (this.defPageName + '/' + serviceName) :
                                                    null, //passing null will throw the error callback

                                //if no paramaters, pass in null, else stringify the json object (requires json2.js) 
                                data: (obj === null) ? '{}' : JSON.stringify(obj),

                                //content type used with .NET
                                contentType: 'application/json; charset=utf-8',

                                //default data type 
                                dataType: 'json',

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

                                        else {

                                            //data is json - parse and send back to success callback (requires json2.js)
                                            //todo - add better regex to determine if json object
                                            if (e.d.indexOf(':') != -1 && e.d.indexOf('{') != -1 && e.d.indexOf('}') != -1) {
                                                succ(JSON.parse(e.d));
                                            }

                                            //probably simple value - such as string - return solo value
                                            else {
                                                succ(e.d);
                                            }
                                        }
                                    }
                                }
                            });
                        };
                    }
                }
                else if (serviceName instanceof Array) {
                    jQuery.each(serviceName, function (i, x) { vertebrae.data.addHandler(x); });
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
                if (Sys) {
                    if (typeof startHndlr === 'function') {
                        Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(startHndlr);
                    }
                    if (typeof stopHndlr === 'function') {
                        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(stopHndlr);
                    }
                }
            },

            /*
            *   setDefaultPageName() - set the default page name to refer to when pageName() returns empty
            *
            *       pageName [string] [not optional]
            *           the name of the page ('Default.aspx')
            *
            */
            setDefaultPageName: function (pageName) {
                if (typeof pageName === 'string') {
                    this.defPageName = pageName;
                }
            },

            /*
            *   pageName() - return the current pages name (with extension)
            *
            */
            pageName: function () {
                return (window.location.pathname).substring((window.location.pathname).lastIndexOf('/') + 1);
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

                if (this.evntCache) {
                    if (typeof evntName === 'string') {

                        if (this.evntCache[evntName]) {
                            jQuery.each(this.evntCache[evntName], function (i, fn) { fn(); });
                        }
                    }

                    else if (evntName instanceof Array) {

                        jQuery.each(evntName, function (evnt) {

                            if (this.evntCache[evnt]) {
                                jQuery.each(this.evntCache[evnt], function (i, fn) { fn(); });
                            }
                        });
                    }
                }
            },

            /*
            *   addHandler() - create a custom event handler
            *
            *       hndlrName [string] OR [object] [not optional]
            *           the name of the handler - or object with multiple handlers
            *
            *       hndlrFn [function] [not optional]
            *           the handler callback
            *
            */
            addHandler: function (hndlrName, hndlrFn) {
                this.hndlrCache = this.hndlrCache || {};
                if (typeof hndlrName === 'string') {
                    if (typeof hndlrFn === 'function') {
                        if (!this.hndlrCache[hndlrName]) {
                            this.hndlrCache[hndlrName] = hndlrFn;
                        }
                    }
                }
                else if (typeof hndlrName === 'object') {
                    jQuery.extend(this.hndlrCache, hndlrName);
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
                if (typeof hndlrName === 'string') {
                    return this.hndlrCache[hndlrName];
                }
            },

            /*
            *   add() - add an event
            *
            *       evntName [string] [not optional] 
            *           the event to bind to (can be custom event name or jQuery bind event)
            *
            *       hndlrName [string] OR [array(strings)] OR [function] OR [array(function)] [not optional]  
            *           this can either be a string or an array of strings of event handler names, or 
            *           functions/array of functions
            *
            *       ctrlName [string] [optional]
            *           this is the jQuery object to perform a bind function on (only used for jQuery
            *           bind events - click, blur, focus, etc.)
            *                                       
            */
            add: function (evntName, hndlrName, ctrlName) {
                this.evntCache = this.evntCache || {};

                if (typeof evntName === 'string') {
                    if (typeof hndlrName === 'string') {

                        var hndlr = this.getHandler(hndlrName);

                        if (typeof hndlr === 'function') {
                            if (typeof ctrlName === 'string') {

                                var ctrl = vertebrae.view.get(ctrlName); //grab the jQuery object from view cache

                                if (ctrl instanceof jQuery) {
                                    ctrl.bind(evntName, hndlr);
                                }
                            }
                            // create a custom event
                            else {
                                this.evntCache[evntName] = this.evntCache[evntName] || [];
                                this.evntCache[evntName].push(hndlr);
                            }
                        }
                    }
                    else if (typeof hndlrName === 'function') {
                        if (typeof ctrlName === 'string') {
                            
                            var ctrl = vertebrae.view.get(ctrlName); //grab the jQuery object from view cache
                            if (ctrl instanceof jQuery) {
                                ctrl.bind(evntName, hndlrName);
                            }
                        }
                        // create a custom event
                        else {
                            this.evntCache[evntName] = this.evntCache[evntName] || [];
                            this.evntCache[evntName].push(hndlrName);
                        }
                    }
                    else if (hndlrName instanceof Array) {
                        if (typeof ctrlName === 'string') {
                            
                            var ctrl = vertebrae.view.get(ctrlName); //grab the jQuery object from view cache

                            if (ctrl instanceof jQuery) {
                                //loop through and bind events to jQuery object
                                jQuery.each(hndlrName, function (i, fn) {
                                    if (typeof fn === 'string') {
                                        ctrl.bind(evntName, vertebrae.event.getHandler(fn));
                                    }
                                    else if (typeof fn === 'function') {
                                        ctrl.bind(evntName, fn);
                                    }
                                });
                            }
                        }
                        // create a custom event
                        else {
                            //add a new event to custom cache if one doesnt already exist
                            this.evntCache[evntName] = this.evntCache[evntName] || [];
                            //loop through and push the hndlr's onto the events stack
                            jQuery.each(hndlrName, function (i, fn) {
                                if (typeof fn === 'string') {
                                    vertebrae.event.evntCache[evntName].push(vertebrae.event.getHandler(fn));
                                }
                                else if (typeof fn === 'function') {
                                    vertebrae.event.evntCache[evntName].push(fn);
                                }
                            });
                        }
                    }
                }
            }

        },

        tmpl: {

            /*
            *   mustache() - wrapper for Mustache.to_html() to make it pretty =)
            *
            *       tmpl [object] OR [string] [not optional]
            *           the jquery template object to which data will be bound or a selector string
            *
            *       data [object] [not optional]
            *           the model used by mustache framework to bind the template
            *
            */
            mustache: function (template, data, partial, stream) {
                if (Mustache && typeof data === 'object') {
                    if (!template instanceof jQuery) {
                        if (typeof template === 'string') {
                            template = $(template);
                        }
                    }
                    return $(Mustache.to_html(template.text(), data, partial, stream));
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

    return (window.vertebrae = window._$ = vertebrae);

})(window);