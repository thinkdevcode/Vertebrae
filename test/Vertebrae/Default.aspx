<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Vertebrae.Vertebrae" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Vertebrae 0.2.13</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js" type="text/javascript"></script>
    <script src="json2.min.js" type="text/javascript"></script>
    <script src="Vertebrae.js" type="text/javascript"></script>

    <script type="text/javascript" language="javascript">

        //set the default name of page in case our data handler cant see it - used 
        //  mainly for default pages (index.html, default.aspx, etc)
        _$.data.setDefaultPageName('Default.aspx');


        //create our ajax data handlers
        _$.data.addHandler('GetTestArray');


        //this handler gets fired on page load and adds controls to view
        _$.event.addHandler('SetView', function () {

            _$.view.add({
            
                'Link_FireEvent'  : $('#lnkFireEvent1'),
                'Link_FireAjaxReq': $('#lnkAjaxReq')

            });

        });


        //this handler manipulates controls in the view
        _$.event.addHandler('ViewEvents', function () {
            //but its empty right now
        });


        _$.event.addHandler('Link_FireEvent_Click', function () {
            alert('hi! This got clicked');
        });


        _$.event.addHandler('Link_FireAjaxReq_Click', function () {

            _$.data.GetTestArray(null,
                function (data) {
                    $('body').append('<br />' + data.toString() + '<br />');
                },
                function () {
                    alert('error occured!');
                },
                function () {
                    _$.event.fire('globalajax');
                    $('body').append('<br /> presend function fired before ajax request <br />');
            });
        });


        //this is an example handler you can fire on global ajax requests
        _$.event.addHandler('GlobalAjaxHandler', function () {
            alert('starting ajax request');
        });


        //add a custom event (note - if view control name is given then a jQuery bind function called)
        _$.event.add('pageload', ['SetView', 'ViewEvents']);
        _$.event.add('globalajax', 'GlobalAjaxHandler');


        $(function () {
            _$.event.fire('pageload');
            _$.event.add('click', 'Link_FireEvent_Click', 'Link_FireEvent');
            _$.event.add('click', 'Link_FireAjaxReq_Click', 'Link_FireAjaxReq');
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
