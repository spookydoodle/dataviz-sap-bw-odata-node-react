# dataviz-sap-bw-odata-node-react
A simple data visualization application on Node.js and React.js requesting data from backend SAP BW system.

## Intro
This document describes three steps required to build a web application on Node.js and React.js with the purpose of analysis and visualization of data sourced from a backend SAP Business Warehouse (BW) system.

## Table of contents:
1. Create an oData service to expose data using a BEx query from backend SAP BW system
    1. Resources
    1. SAP Gateway configuration
    1. Check & setup settings for EQ and oData
    1. Create BEx query for oData service
    1. Generate native Gateway service
    1. Create and publish oData service for a query
    1. Get oData URL
    1. Results
    1. Authorization
    1. Transport collection
1. Set up server environment on Node.js
    1. Create data source field mapping file
1. Set up client React app
    1. D3 data viz components

Step number three which describes setting up the client and building react data visualization components is applicable to any source system.

## Project

### Step 1: Create an oData service to expose data from backend SAP BW system

#### Resources
Below part of this article was written based on below resources as well as my own observations:
Resource 1: https://blogs.sap.com/2019/02/19/how-to-do-odata-services-from-bex-query/ 
Resource 2: https://wiki.scn.sap.com/wiki/display/BI/Steps+to+Create+an+ODATA+service+for+a+BW+Query

#### SAP Gateway configuration
This step is only required the first time an oData service is created in the system. 

Go to transaction *SPRO* and select: 
*SAP NetWeaver – SAP Gateway - OData channel – Configuration – Connection Settings – SAP Gateway to SAP System – Manage SAP System Aliases*

![GitHub Logo](/public/images/spro-system-alias.png)
Format: ![Alt Text](url)

Click on Create System Alias icon and enter below details:
*System Alias*: LOCAL
*RFC Destination*: NONE
*Local Gateway*: Enabled
*For Local App*: Disabled
*OData on Backend*: Disabled
*Target System ID*: Leave blank
*Target Client*: Leave blank
*Software Version*: DEFAULT
*Web Service Provider System*: Leave blank
*Description*: System Alias Local

![GitHub Logo](/public/images/system-alias.png)
Format: ![Alt Text](url)

#### Check and setup settings for EQ and oData
This step is also only required the first time an oData service is created in the system. 
Go to transaction *SE38* and run program EQ_RS_AUTOSETUP

#### Create BEx query for oData service
Create a BW query and tick the option *Remote Access By oData*.

![GitHub Logo](/public/images/query.png)
Format: ![Alt Text](url)

**Limitations and query functionalities**
There are some limitations when building a query for oData service (for example no hierarchies and no structures allowed) but majority of functionalities, such as: currency conversion, display settings and conditions, are processed correctly (see SAP note 2367553 ODataQuery features and limitation).

**Query variables**
oData service allows to set values in query variables but not all types can be made use of. Only mandatory single values and intervals can be passed to the oData URL. There is no way to pass multiple selections or multiple single values in the URL (it is possible to do so using filter URL parameters, though). Also using optional variables in the URL string will generate an error. To optionally filter the data use the ‘filter’ URL parameter.

**Query filters**
Both filters and default values are applied

**Dimensions**
All dimensions from rows and free characteristics will be available in the output. It does not really make a difference in which place they are added. What does matter is the dimension display settings. Most importantly:
* Dimension display setting (Key / Text / Key and Text) has impact on the number of generated key – value pairs. Selecting Key and Text will generate two separate properties while only Key or only Text, one.
* Text Output Format setting (Short/Medium/Long Text) is reflected in the JSON output
* Setting Show Result Rows to Always will generate objects with result rows which could be desired, but could also lead to duplication of numbers in the client app, depending on the way the data is used there. Think ahead and make sure you use the right setting here.

**Key Figure settings**
*	Measures generate two JSON properties for the value (one raw and one formatted) and optionally one for the measure unit. You can make use of measure formatting from the query such as decimals or scaling factor.  

#### Generate native Gateway service
It might be necessary to run this standard SAP function module which performs *generate native Gateway service* functionality, if the service is not available automatically after creating a query.
Go to transaction *SE37* and execute function module RSEQ_NAT_GENERATION. Enter query technical name in I_S_QUERY field and click on the *execute* icon.

![GitHub Logo](/public/images/generate-service.png)
Format: ![Alt Text](url)

This should generate three messages:
* SAP Gateway Model '<model_name>' Version '0001' created
* SAP Gateway Service '<service_name>' Version '0001' created
* SAP GW Model '<service_name> 'Version '0001' assigned to SAP GW Service '' Version ''

![GitHub Logo](/public/images/generate-service-messages.png)
Format: ![Alt Text](url)

![GitHub Logo](/public/images/generate-service-messages-2.png)
Format: ![Alt Text](url)

#### Create and publish oData service for a query
Go to transaction */n/IWFND/MAINT_SERVICE* and click on *Add Service*.

![GitHub Logo](/public/images/add-service.png)
Format: ![Alt Text](url)

Enter System Alias *LOCAL* and click on *Get Services*.

![GitHub Logo](/public/images/get-services.png)
Format: ![Alt Text](url)

A list of available services should appear. Search for the newly created service and click on it. Select the right package and press OK. The new service is created.

#### Get oData URL
Find the added service and click on it. You should see an active ICF node in the bottom left corner. If for some reason the service status is not green, you can activate it there (click on ICF Node – Activate). To get the URL click on *Call Browser* button.

![GitHub Logo](/public/images/call-browser.png)
Format: ![Alt Text](url)

The default URL will have format
http://<server>:<port>/sap/opu/odata/sap/service_name/?$format=xml 

In this example it would be:
http://<server>:<port>/sap/opu/odata/sap/ T_ODATA_SRV /?$format=xml 

The first time you run the URL, you will be asked to select a certificate to authenticate yourself to the server and to enter your BW credentials. See the next point to see how to set up authorization for users to access the data.
Read here how you can make use of all oData URL parameters to select desired dimensions and measures, filter data, order by dimension etc.
* Resource 1: https://wiki.scn.sap.com/wiki/display/BI/BW+OData+Queries
* Resource 2: https://help.sap.com/viewer/64e2cdef95134a2b8870ccfa29cbedc3/7.4.19/en-US/c9384c774bcc4837b84bee3679520fb4.html

#### Metadata
To see metadata add /$metadata parameter to the URL. This will generate query information such as the list of variables and columns available in the output (both technical names and descriptions). Interval and selection variables will generate two parameters in the URL, which you can check in the metadata output. Unfortunately, only available in .xml format.
http://<server>:<port>/sap/opu/odata/sap/T_ODATA_SRV/$metadata/

![GitHub Logo](/public/images/results-metadata.png)
Format: ![Alt Text](url)

#### Results
To see results in JSON format, add */QuerynameResults?$format=json* to the URL. Be careful with running the URL’s without specifying which dimensions to select. If a query includes many dimensions on very granular level (like *Article* or *Order ID*), you might end up pulling too many records from the source system causing performance issues. Think of it as running a query in Analysis for Excel, selecting a full fiscal year and adding all available dimensions, incl. *Article* and *Order ID*, to rows or columns.

It is therefore advised to consciously request the dimensions using the *$select* parameter. Let’s say that we need to request *Amount* [0AMOUNT] aggregated by *Country* [0COUNTRY]. Our URL will look like this:
http://<server>:<port>/sap/opu/odata/sap/T_ODATA_SRV/T_ODATAResults?$format=json&$select=0COUNTRY,A0AMOUNT,A0AMOUNT_E

Results should look like below:

```
// yyyymmddhhmmss
// <url>

{
  "d": {
    "results": [
      {
        "__metadata": {
          "id": "<url>('V2.81.14.0_1.2.2.0%3A0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.9.0.0.0.0.0.0.X.0.0.0.0.0.0.1.0_IEQXXXXXXXX')",
          "uri": "<url>('V2.81.14.0_1.2.2.0%3A0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.9.0.0.0.0.0.0.X.0.0.0.0.0.0.1.0_IEQXXXXXXXX')",
          "type": "<service_name>.<query_name>Result"
        },
        "A0COUNTRY": "DE",
        "A0AMOUNT": "1234",
        "A0AMOUNT _E": "EUR"
      }
    ]
  }
}
```

It is best to assure proper error handling in your node application in order to prevent from accidental requests of too much data.

#### Authorization
**What to consider**
To be able to request data from backend BW system, you need to assure that users have the right authorizations. Depending on the application that will be developed on top of the oData service, you can either decide to create one service user to communicate between BW and the client app or assign authorization to existing standard users. That decision purely depends on business requirements and agreements regarding data confidentiality within an organization.
The first option is preferable if the data, which will be shown in the web application, is not confidential and can be shown to users without applying additional filtering depending on users’ access rights. Here user credentials can be hardcoded in the client application. For example, a dashboard with production data which is intended to be displayed on a wall in a warehouse.
The latter should be used if you need to make use of user authorizations to InfoObjects, such as Reporting Units or Management structures, by applying authorization exit variables in BW query filter. Here we would need to implement a login form in our application and pass credentials in the server route. An example would be a dynamic web application with sales analysis by customers and products intended to be used globally by managers or analysts, who should be able to see only sales within their region or business unit.
Later in this document, you can find information how to handle both scenarios in the client application.

**Add authorization object S_SERVICE to BW role**
The authorization object required to access data via the oData service is S_SERVICE *Check at Start of External Service*. 
There are two authorizations required to access the data:
*	SAP Gateway: Service Groups Metadata
*	SAP Gateway Business Suite Enablement – Service
To investigate what exactly needs to be added to a BW role, first create a test user with standard user authorizations. Use its credentials to log in when running the oData URL. You should see an error which looks like this:

![GitHub Logo](/public/images/auth-error-1.png)
Format: ![Alt Text](url)

Go to transaction *SU53* and display error messages for the test user you used to access oData URL. You should see the details of missing authorizations. See the authorization object details and service ID.

![GitHub Logo](/public/images/su53-1.png)
Format: ![Alt Text](url)

Go to transaction *PFCG* and edit the role to which you want to add the authorization. Go to Authorizations tab and click on the pencil icon by *Edit Authorization Data and Generate Profiles*.

![GitHub Logo](/public/images/pfcg-1.png)
Format: ![Alt Text](url)

Click on *Add Manually*, add S_SERVICE and click OK.

![GitHub Logo](/public/images/s-service.png)
Format: ![Alt Text](url)

Here you need to make a decision whether you want to control precisely which services are added to the role or if you want to add authorizations to all created services at one go. That decision again depends on how strictly the organization’s authorization concept is implemented in the system.
To add all services at one go just add * *All Values* in *Program, transaction or function*. 

![GitHub Logo](/public/images/s-service-2.png)
Format: ![Alt Text](url)

If you want to control access to each created oData query (service), select *TADIR Service* and add the ID of the service which you can copy from the error log in *SU53* (*SAP Gateway: Service Groups Metadata*). 
To paste the ID switch from *Object Name* to *Technical Name* by clicking on the button pointed by the arrow on the screenshot below. Paste the id in the Name column and press enter. 

![GitHub Logo](/public/images/s-service-3.png)
Format: ![Alt Text](url)

Click *Save* and then *Generate* icons.

![GitHub Logo](/public/images/s-service-4.png)
Format: ![Alt Text](url)

Then repeat the process again to find the ID for the second authorization *SAP Gateway Business Suite Enablement – Service*.
Run the URL using the same test user credentials. This time the error will look like this:

![GitHub Logo](/public/images/auth-error-2.png)
Format: ![Alt Text](url)

Refresh the error log in *SU53*. Copy the new ID and add it to the role in the same place as before.

![GitHub Logo](/public/images/su53-2.png)
Format: ![Alt Text](url)

Role authorization settings should look like below.

![GitHub Logo](/public/images/pfcg-2.png)
Format: ![Alt Text](url)

Now user has sufficient authorizations to see the data. Run the URL and you should see the results.

#### Transport collection

* Resource 1: https://launchpad.support.sap.com/#/notes/2424613 
* Resource 2: https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/

Three things should be transported in below sequence:
* System Alias LOCAL (Customizing)
* Query with oData enabled (Workbench)
*	Service for above query together with its model and active ICF node (Customizing)
Make sure that the system alias added to the service is marked as “Default System”.

![GitHub Logo](/public/images/default-system.png)
Format: ![Alt Text](url)

It might happen that after transporting from development environment to QA or Production, you will see some errors because usually not all objects are added to the transport correctly.
See this [blog post](https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/) (Resource 2) which explains how to add required objects to the transport. 

**Error:** Not Found
```
<error xmlns:xsi="http://www.w3.org/2001/XMLSchema-Instance">
<code>HTTP/404/E/Not Found</code>
<message> Service /sap/opu/odata/sap/FCP_U034_OQ001_SRV/ call was terminated because the corresponding service is not available.The termination occurred in system BWD with error code 404 and for the reason Not found. Please select a valid URL. If it is a valid URL, check whether service /sap/opu/odata/sap/FCP_U034_OQ001_SRV/ is active in transaction SICF. If you do not yet have a user ID, contact your system administrator. </message>
</error>
```

**Solution:** Check in */n/IWFND/MAINT_SERVICE* if your ICF Node is active. If not, activate it.

![GitHub Logo](/public/images/activate-icf-node.png)
Format: ![Alt Text](url)

![GitHub Logo](/public/images/activate-icf-node-2.png)
Format: ![Alt Text](url)

**Error:** No System Alias found for Service 'XXX' and user 'X'
**Solution:** Check in */n/IWFND/MAINT_SERVICE* if your service was transported with a system alias added. If not, go to the service in Development environment, remove the system alias and add it again. Make sure you mark it as Default System. Write the changes in transport and transport again.

**Error:** No service found for namespace …
```
{
  "error": {
    "code": "/IWBEP/CM_MGW_RT/026",
    "message": {
      "lang": "en",
      "value": "No service found for namespace /SAP/, name FCP_U034_OQ001_SRV, version 0001"
    },
    "innererror": {
      "application": {
        "component_id": "",
        "service_namespace": "/SAP/",
        "service_id": "FCP_U034_OQ001_SRV",
        "service_version": "0001"
      },
      "transactionid": "16C1FD27D54D00C0E005ED8CAAAB83A0",
      "timestamp": "20200604105347.5709890",
      "Error_Resolution": {
        "SAP_Transaction": "For backend administrators: run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
        "SAP_Note": "See SAP Note 1797736 for error analysis (https://service.sap.com/sap/support/notes/1797736)"
      },
      "errordetails": [
        
      ]
    }
  }
}

```

**Solution:** Check if the system alias is marked as Default System. If not then go to /n/IWFND/MAINT_SERVICE in development environment, remove the alias and add again. This time make sure you mark the alias as Default System. Transport to QA/Prod.
If that doesn’t help then check if the service and model were transported correctly.
-	Go to transaction /n/IWBEP/REG_SERVICE and search for your service name. If it is not found, it was not transported from Development
-	Go to transaction /n/IWBEP/REG_MODEL and search for your service model. 

To collect the service and model follow the steps described in this [blog post](https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/) (Resource 2)


### Step 2: Set up server environment on Node.js

#### Create data source field mapping file

### Step 3: Set up React client app
