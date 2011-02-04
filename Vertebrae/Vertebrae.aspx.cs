using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Collections;

namespace Vertebrae
{
    public partial class Vertebrae : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static ArrayList GetTestArray()
        {
            return new ArrayList() 
            {
                new { Name = "Test1", Age = "1337" },
                new { Name = "Test2", Age = "22" }
            };
        }
    }
}