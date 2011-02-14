<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Vertebrae.Vertebrae" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Vertebrae 0.2.10</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js" type="text/javascript"></script>
    <script src="json2.min.js" type="text/javascript"></script>
    <script src="Vertebrae.js" type="text/javascript"></script>

    <script type="text/javascript" language="javascript">
        

        //create application object
        var app = {};


        //give it some boooooooooooones
        _$.util.extend(app, vertebrae);


        //set the default name of page in case our data handler cant see it - used 
        //  mainly for default pages (index.html, default.aspx, etc)
        app.data.setDefaultPageName('Default.aspx');


        //create our ajax data handlers
        app.data.addHandler('GetTestArray');


        //this handler gets fired on page load and adds controls to view
        app.event.addHandler('SetView', function () {

            app.view.add('Link_FireEvent', $('#lnkFireEvent1'));
            app.view.add('Link_FireAjaxReq', $('#lnkAjaxReq'));

        });


        //this handler manipulates controls in the view
        app.event.addHandler('ViewEvents', function () {
            //but its empty right now lol
        });


        app.event.addHandler('Link_FireEvent_Click', function () {
            alert('hi! This got clicked');
        });


        app.event.addHandler('Link_FireAjaxReq_Click', function () {

            app.data.GetTestArray(null,
                function (data) {
                    $('body').append('<br />' + data.toString() + '<br />');
                },
                function () {
                    alert('error occured!');
                },
                function () {
                    app.event.fire('globalajax');
                    $('body').append('<br /> presend function fired before ajax request <br />');
            });
        });


        //this is an example handler you can fire on global ajax requests
        app.event.addHandler('GlobalAjaxHandler', function () {
            alert('starting ajax request');
        });


        //add a custom event (note - if view control name is given then a jQuery bind function called)
        app.event.add('pageload', ['SetView', 'ViewEvents']);
        app.event.add('globalajax', 'GlobalAjaxHandler');


        $(function () {
            app.event.fire('pageload');
            app.event.add('click', 'Link_FireEvent_Click', 'Link_FireEvent');
            app.event.add('click', 'Link_FireAjaxReq_Click', 'Link_FireAjaxReq');
        });


    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <a href="#" id="lnkFireEvent1">Fire event!</a>
        <a href="#" id="lnkAjaxReq">Fire Ajax Req!</a>
    </div>
    </form>
</body>
</html>
