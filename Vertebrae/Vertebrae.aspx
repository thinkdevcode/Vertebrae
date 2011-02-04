<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Vertebrae.aspx.cs" Inherits="Vertebrae.Vertebrae" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Vertebrae</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script>
    <script src="json2.min.js" type="text/javascript"></script>
    <script src="underscore.min.js" type="text/javascript"></script>
    <script src="Vertebrae.js" type="text/javascript"></script>

    <script type="text/javascript" language="javascript">


        // Create our application skeleton
        var test1 = {};


        // Give it some bones!!
        _.extend(test1, vertebrae);


        ///////////////////////////////////////////////////////////
        //      EVENTS

        // addEventHandler( nameOfHandler, callback)
        //
        test1.event.addHandler('myTestEvent1', function () { alert('myTestEvent1'); });
        test1.event.addHandler('myTestEvent11', function () { alert('myTestEvent11'); });
        test1.event.addHandler('myTestEvent111', function () { alert('myTestEvent111'); });


        // Since you can bind jQuery events, you can optionally receive event paramaters
        test1.event.addHandler('myTestEvent2', function (e) {
            e.preventDefault(); 
            alert('myTestEvent2'); 
        });


        // addCustEvent( nameOfEvent, nameOfEventHandler )
        //
        // Create a custom event and pass it a handler
        test1.event.addCustom('pageload', 'myTestEvent1');
        test1.event.addCustom('pageload', 'myTestEvent11');
        test1.event.addCustom('pageload', 'myTestEvent111');


        ///////////////////////////////////////////////////////////
        //      DATA

        // addDataHandler( nameOfMethod, urlOfMethod )
        //
        // Create a data handler to some webmethod (for .NET)
        test1.data.addHandler('getTestArray', 'Vertebrae.aspx/GetTestArray');


        ///////////////////////////////////////////////////////////

        $(function () {

            // addControl( nameOfControl, jQueryObject )
            //
            // *note* the jq object needs to be created before you can add it
            test1.view.add('FireEvent1', $('#lnkFireEvent1'));


            // addEvent( nameOfControl, eventType, nameOfHandler )
            //
            // basically a wrapper for jQuery.bind()
            test1.event.add('FireEvent1', 'click', 'myTestEvent2');


            // fireEvent( nameOfEvent )
            //
            // this is for firing custom events
            test1.event.fire('pageload');

            // bones.data.handlerName(parameters[object], success[function], error[function], presend[function])
            //
            // parameter that gets passed to your success callback is either already parsed JSON or an array
            test1.data.getTestArray(null,                   //parameters (null if none)
                    function (data) {                       //on success callback
                        $('body').append('on success callback for getTestArray<br />');
                        alert('Name: ' + data[0].Name + ' Age: ' + data[0].Age);
                    },
                    function () {                           //on error callback
                        $('body').append('on error callback for getTestArray<br />');
                    },
                    function () {                           //on presend callback
                        $('body').append('presend callback for getTestArray<br />');
                    }
                );

        });

    
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <a href="#" id="lnkFireEvent1">Fire event!</a>
    </div>
    </form>
</body>
</html>
