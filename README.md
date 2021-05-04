# dataviz-sap-bw-odata-node-react
A base for a data visualization application with server running on Node.js requesting data from backend SAP BW system and client built using React.js. View code on [this repository](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react). 

See also [this repository](https://github.com/spookydoodle/dataviz) and [this page](https://dataviz.spookydoodle.com) to view code for a cool data vizualization app using D3 and React.js

# Intro
This document describes three steps required to build a web application on Node.js and React.js with the purpose of analysis and visualization of data sourced from a backend SAP Business Warehouse (BW) system.

# Table of contents:
1. [Create an oData service to expose data using a BW query from backend SAP BW system](#create-an-odata-service-to-expose-data-from-backend-sap-bw-system)
    1. [Resources](#resources)
    1. [SAP Gateway configuration](#sap-gateway-configuration)
    1. [Check & setup settings for EQ and oData](#check-and-setup-settings-for-eq-and-odata)
    1. [Create BW query for oData service](#create-bw-query-for-odata-service)
    1. [Generate native Gateway service](#generate-native-gateway-service)
    1. [Create and publish oData service for a query](#create-and-publish-odata-service-for-a-query)
    1. [Get oData URL](#get-odata-url)
    1. [Metadata](#metadata)
    1. [Results](#results)
    1. [Authorization](#authorization)
    1. [Transport collection](#transport-collection)
1. [Set up server environment on Node.js](#set-up-server-environment-on-nodejs)
    1. [Resources](#server-resources)
    1. [Purpose](#purpose)
    1. [Server folder structure](#server-folder-structure)
    1. [Set up index.js and app.js](#set-up-index-and-app)
    1. [Create object mapping file](#create-object-mapping-file)
    1. [Credentials](#credentials)
    1. [oData URL manipulation class](#odata-url-manipulation-class)
    1. [Data Cache](#data-cache)
    1. [Routes](#routes)
1. [Set up client React app](#set-up-react-client-app)
    1. [Resources](#client-resources)
    1. [Start scripts](#start-scripts)
    1. [Proxy](#proxy)
    1. [Service scripts](#service-scripts)
    1. [Display results in the app](#display-results-in-the-app)
1. [D3 data viz components](#d3-data-viz-components)

Step number three which describes setting up the client and building react data visualization components is applicable to any source system.

# Project

## Create an oData service to expose data from backend SAP BW system

### Resources
This part of this documentation was written based on below resources as well as own experiences:
* [Resource 1](https://blogs.sap.com/2019/02/19/how-to-do-odata-services-from-bex-query/): https://blogs.sap.com/2019/02/19/how-to-do-odata-services-from-bex-query/ 
* [Resource 2](https://wiki.scn.sap.com/wiki/display/BI/Steps+to+Create+an+ODATA+service+for+a+BW+Query): https://wiki.scn.sap.com/wiki/display/BI/Steps+to+Create+an+ODATA+service+for+a+BW+Query
* [Resource 3](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/): https://www.odata.org/documentation/odata-version-2-0/uri-conventions/
* [Resource 4](https://launchpad.support.sap.com/#/notes/2367553): https://launchpad.support.sap.com/#/notes/2367553
* [Resource 5](https://wiki.scn.sap.com/wiki/display/BI/BW+OData+Queries): https://wiki.scn.sap.com/wiki/display/BI/BW+OData+Queries
* [Resource 6](https://help.sap.com/viewer/64e2cdef95134a2b8870ccfa29cbedc3/7.4.19/en-US/c9384c774bcc4837b84bee3679520fb4.html): https://help.sap.com/viewer/64e2cdef95134a2b8870ccfa29cbedc3/7.4.19/en-US/c9384c774bcc4837b84bee3679520fb4.html
* [Resource 7](https://launchpad.support.sap.com/#/notes/2424613 ): https://launchpad.support.sap.com/#/notes/2424613 
* [Resource 8](https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/): https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/

### SAP Gateway configuration
This step is only required the first time an oData service is created in the system. 

Go to transaction `SPRO` and select: 
*SAP NetWeaver – SAP Gateway - OData channel – Configuration – Connection Settings – SAP Gateway to SAP System – Manage SAP System Aliases*

<img src="public/images/spro-system-alias.png" width="500"/>

Click on *Create System Alias* icon and enter below details:
* System Alias: *LOCAL*
* RFC Destination: *NONE*
* Local Gateway: *Enabled*
* For Local App: *Disabled*
* OData on Backend: *Disabled*
* Target System ID: *Leave blank*
* Target Client: *Leave blank*
* Software Version: *DEFAULT*
* Web Service Provider *System: Leave blank*
* Description: *System Alias Local*

<img src="public/images/system-alias.png" width="500"/>

### Check and setup settings for EQ and oData
This step is also only required the first time an oData service is created in the system. 
Go to transaction `SE38` and run program *EQ_RS_AUTOSETUP*

### Create BW query for oData service
Create a BW query and tick the option *Remote Access By oData*.

<img src="public/images/query.png" width="500"/>

**Limitations and query functionalities**
* There are some limitations when building a query for oData service, for example: no multiple hierarchies and no additional structures allowed
* Majority of functionalities, such as: currency conversion, display settings and conditions, are processed correctly (see SAP note [2367553](https://launchpad.support.sap.com/#/notes/2367553) ODataQuery features and limitation).

**Query variables**
* oData service allows to set values in query variables but not all types can be made use of. 
* Only mandatory single values and intervals can be passed to the oData URL. 
* There is no way to pass multiple selections or multiple single values in the URL. It is possible to do so using filter URL parameters.
* Using optional variables in the URL string will generate an error. To optionally filter the data use the `$filter` URL parameter.

**Query (fixed/default) filters**
* Both filters and default values are applied

**Dimensions**
* All dimensions from rows and free characteristics will be available in the output. It does not really make a difference in which place they are added. 
* Dimension display settings are important, especially:
    * *Display* setting *Key / Text / Key and Text* has impact on the number of generated key-value pairs. Selecting *Key and Text* will generate two separate object properties while only *Key* or only *Text*, one.
    * *Text Output Format* setting *Short/Medium/Long Text* is reflected in the JSON output
    * Setting *Show Result Rows* to *Always* will generate objects with result rows which could be desired, but could also lead to duplication of numbers in the client app, depending on how the data is used there. Think ahead and make sure you use the right setting here.
* Order of characteristics is the one defined during the designtime (not sure what that means exactly tbh) and it cannot be changed any way, which is very annoying. Order might matter when making use of result rows or in some special scenarios like exception aggregation. For example accumulative sum along rows. Probably it's safer to just accumulate values using javascript data operations on raw data from a query.

**Key Figure settings**
*	Measures generate two JSON properties for the value (one raw and one formatted) and optionally one for the measure unit. You can make use of measure formatting from the query such as decimals or scaling factor.  
* Technical names of formulas and selections - make your life easier by adding a technical name to all key figures (local formulas or selections). They impact property names in result JSON. If you don't add them, the property name will be equal to the technical name of base key figure or restricted/calculated key figure used in the key figure structure. If there are several selections in the query with the same KF/CKF/RKF, then the property name will be equal to the 25-character-long UID (visible in Outline panel in BWMT) (or maybe even will result in an error). So keep in mind that the name might change, therefore it is advised to add a local technical name and to not ever modify it.

<img src="public/images/key-figure-name.png" width="500"/>

```
// YYYYMMDDHHSS
// http://<server_name>:<port_number>/sap/opu/odata/sap/<service_name>/<query_name>Results

{
  "d": {
    "results": [
      {
        "__metadata": {
          "id": "http://<server_name>:<port_number>/sap/opu/odata/sap/<service_name>/<query_name>Results('V2.86.221.32_1.2.2.0%3A6.2.2.3.15.8.0.13.2.72.2.2.4.3.3.2.25.10.0.2.9.6.10.10.2.3.0.X.1.1.1.1.1.1.1.1_IEQ...')",
          "uri": "http://<server_name>:<port_number>/sap/opu/odata/sap/<service_name>/<query_name>Results('V2.86.221.32_1.2.2.0%3A6.2.2.3.15.8.0.13.2.72.2.2.4.3.3.2.25.10.0.2.9.6.10.10.2.3.0.X.1.1.1.1.1.1.1.1_IEQ...')",
          "type": "<service_name>.<query_name>Result"
        },
        "ID": "V2.86.221.32_1.2.2.0:6.2.2.3.15.8.0.13.2.72.2.2.4.3.3.2.25.10.0.2.9.6.10.10.2.3.0.X.1.1.1.1.1.1.1.1_IEQck2017116265886Description Red...",
        "TotaledProperties": "",
        "A0CALWEEK": "201711",
        "A0CALWEEK_T": "11.2017",
        "MY_TECH_NAME": "8",
        "MY_TECH_NAME_F": "8",
        "Parameters": {
          "__deferred": {
            "uri": "http://<server_name>:<port_number>/sap/opu/odata/sap/<service_name>/<query_name>Results(...)/Parameters"
          }
        }
      }
    ]
  }
}
```

### Generate native Gateway service
It might be necessary to run this standard SAP function module which performs *generate native Gateway service* functionality, if the service is not available automatically after creating a query.
Go to transaction `SE37` and execute function module *RSEQ_NAT_GENERATION*. Enter query technical name in `I_S_QUERY` field and click on the *execute* icon.

<img src="public/images/generate-service.png" width="500"/>

This should generate three messages:
* SAP Gateway Model '<model_name>' Version '0001' created
* SAP Gateway Service '<service_name>' Version '0001' created
* SAP GW Model '<service_name> 'Version '0001' assigned to SAP GW Service '' Version ''

<img src="public/images/generate-service-messages.png" width="500"/>
<img src="public/images/generate-service-messages-2.png" width="500"/>

### Create and publish oData service for a query
Go to transaction `/n/IWFND/MAINT_SERVICE` and click on *Add Service*.

<img src="public/images/add-service.png" width="500"/>

Enter System Alias *LOCAL* and click on *Get Services*.

<img src="public/images/get-services.png" width="500"/>

A list of available services should appear. Search for the newly created service and click on it. Select the right package and press OK. The new service is created.

### Get oData URL
Find the added service and click on it. You should see an active ICF node in the bottom left corner. If for some reason the service status is not green, you can activate it there (click on ICF Node – Activate). To get the URL click on *Call Browser* button.

<img src="public/images/call-browser.png" width="500"/>

The default URL will have format:

`http://<server>:<port>/sap/opu/odata/sap/service_name/?$format=xml`

In this example it would be:

`http://<server>:<port>/sap/opu/odata/sap/ T_ODATA_SRV /?$format=xml`

The first time you run the URL, you will be asked to select a certificate to authenticate yourself to the server and to enter your BW credentials. See the next point to see how to set up authorization for users to access the data.
Read [here](https://wiki.scn.sap.com/wiki/display/BI/BW+OData+Queries) and [here](https://help.sap.com/viewer/64e2cdef95134a2b8870ccfa29cbedc3/7.4.19/en-US/c9384c774bcc4837b84bee3679520fb4.html) how you can make use of all oData URL parameters to select desired dimensions and measures, filter data, order by dimension etc.

### Metadata
To see metadata add `/$metadata` parameter to the URL. This will generate query information such as the list of variables and columns available in the output (both technical names and descriptions). Interval and selection variables will generate two parameters in the URL, which you can check in the metadata output. Unfortunately, only available in `.xml` format.

`http://<server>:<port>/sap/opu/odata/sap/T_ODATA_SRV/$metadata/`

<img src="public/images/results-metadata.png" width="500"/>

### Results
To see results in JSON format, add `/QuerynameResults?$format=json` to the URL. Be careful with running the URL’s without specifying which dimensions to select. If a query includes many dimensions on very granular level (like *Article* or *Order ID*), you might end up pulling too many records from the source system causing performance issues. Think of it as running a query in *Analysis for Excel*, selecting a full fiscal year and adding all available dimensions, incl. *Article* and *Order ID*, to rows or columns.

It is therefore advised to consciously request the dimensions using the *$select* parameter. Let’s say that we need to request *Amount* [0AMOUNT] aggregated by *Country* [0COUNTRY]. Our URL will look like this:

`http://<server>:<port>/sap/opu/odata/sap/T_ODATA_SRV/T_ODATAResults?$format=json&$select=0COUNTRY,A0AMOUNT,A0AMOUNT_E`

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

### Authorization
**What to consider**

To be able to request data from backend BW system, you need to assure that users have the right authorizations. 

Depending on the application that will be developed on top of the oData service, you can either decide to create one service user to communicate between BW and the client app or assign authorization to existing standard users. That decision purely depends on business requirements and agreements regarding data confidentiality within an organization.

The first option is preferable if the data, which will be shown in the web application, is not confidential and can be shown to users without applying additional filtering depending on users’ access rights. Here user credentials can be hardcoded in the client application. For example, a dashboard with produced quantites which is intended to be displayed on a wall in a warehouse.

The latter should be used if there is a need to make use of user authorization to InfoObjects, such as Reporting Units or Divisions, by applying authorization exit variables in BW query filters. Here we would need to implement a login form in our application and pass credentials in the server route. An example would be a dynamic web application with sales analysis by customers and products intended to be used globally by managers or analysts, who should be able to see only sales within their region or division.

Later in this document, you can find information how to handle both scenarios in the client application.

**Add authorization object S_SERVICE to BW role**

The authorization object required to access data via the oData service is `S_SERVICE` *Check at Start of External Service*. 
There are two authorizations required to access the data:
* SAP Gateway: Service Groups Metadata
* SAP Gateway Business Suite Enablement – Service

To investigate what exactly needs to be added to a BW role, first create a test user with standard user authorizations. Use its credentials to log in when running the oData URL. You should see an error which looks like this:

```
{
    "error": {
        "code": "/IWFND/CM_CONSUMER/101",
        "message": {
            "lang": "en",
            "value": "No authorization to access Service 'ZT_ODATA_SRV_0001'"
        },
        "innererror": {
            "application": {
                "component_id": "",
                "service_namespace": "/SAP/",
                "service_id": "T_ODATA_SRV",
                "service_version": "0001"
            },
            "transactionId": "XXX",
            "timestamp": "YYYMMDD",
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

Go to transaction `SU53` and display error messages for the test user you used to access oData URL. You should see the details of missing authorizations. See the authorization object details and service ID.

<img src="public/images/su53-1.png" width="500"/>

Go to transaction `PFCG` and edit the role to which you want to add the authorization. Go to Authorizations tab and click on the pencil icon by *Edit Authorization Data and Generate Profiles*.

<img src="public/images/pfcg-1.png" width="500"/>

Click on *Add Manually*, add `S_SERVICE` and click *OK*.

<img src="public/images/s-service.png" width="500"/>

Here you need to make a decision whether you want to control precisely which services are added to the role or if you want to add authorizations to all created services at one go. That decision again depends on how strictly the organization’s authorization concept is implemented in the system.

To add all services at one go just add * *All Values* in *Program, transaction or function*. 

<img src="public/images/s-service-2.png" width="500"/>

If you want to control access to each created oData query (service), select *TADIR Service* and add the ID of the service which you can copy from the error log in `SU53` (*SAP Gateway: Service Groups Metadata*). 
To paste the ID switch from *Object Name* to *Technical Name* by clicking on the button pointed by the arrow on the screenshot below. Paste the id in the Name column and press enter. 

<img src="public/images/s-service-3.png" width="500"/>

Click *Save* and then *Generate* icons.

<img src="public/images/s-service-4.png" width="500"/>

Then repeat the process again to find the ID for the second authorization *SAP Gateway Business Suite Enablement – Service*.
Run the URL using the same test user credentials. This time the error will look like this:

```
{
    "error": {
        "code": "/IWBEP/CM_MGW_RT/000",
        "message": {
            "lang": "en",
            "value": "User does not have the sufficient authorizations"
        },
        "innererror": {
            "application": {
                "component_id": "",
                "service_namespace": "/SAP/",
                "service_id": "T_ODATA_SRV",
                "service_version": "0001"
            },
            "transactionId": "XXX",
            "timestamp": "YYYMMDD",
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

Refresh the error log in `SU53`. Copy the new ID and add it to the role in the same place as before.

<img src="public/images/su53-2.png" width="500"/>

Role authorization settings should look like below.

<img src="public/images/pfcg-2.png" width="500"/>

Now user has sufficient authorizations to see the data. Run the URL and you should see the results.

### Transport collection

See SAP note [2424613](https://launchpad.support.sap.com/#/notes/2424613) for information.

Three things should be transported in below sequence:
* System Alias LOCAL (Customizing)
* Query with oData enabled (Workbench)
* Service for above query together with its model and active ICF node (Customizing)
Make sure that the system alias added to the service is marked as *Default System*.

<img src="public/images/default-system.png" width="500"/>

It might happen that after transporting from development environment to QA or Production, you will see some errors because usually not all objects are added to the transport correctly.
See this [blog post](https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/) which explains how to add required objects to the transport. 

Some errors you might see:

**Error:** Not Found
```
<error xmlns:xsi="http://www.w3.org/2001/XMLSchema-Instance">
<code>HTTP/404/E/Not Found</code>
<message> Service /sap/opu/odata/sap/FCP_U034_OQ001_SRV/ call was terminated because the corresponding service is not available.The termination occurred in system BWD with error code 404 and for the reason Not found. Please select a valid URL. If it is a valid URL, check whether service /sap/opu/odata/sap/FCP_U034_OQ001_SRV/ is active in transaction SICF. If you do not yet have a user ID, contact your system administrator. </message>
</error>
```

**Solution:** Check in `/n/IWFND/MAINT_SERVICE` if your ICF Node is active. If not, activate it.

<img src="public/images/activate-icf-node.png" width="250"/>

<img src="public/images/activate-icf-node-2.png" width="250"/>


**Error:** No System Alias found for Service 'XXX' and user 'X'

**Solution:** Check in `/n/IWFND/MAINT_SERVICE` if your service was transported with a system alias added. If not, go to the service in Development environment, remove the system alias and add it again. Make sure you mark it as Default System. Write the changes in transport and transport again.


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

**Solution:** Check if the system alias is marked as *Default System*. If not then go to `/n/IWFND/MAINT_SERVICE` in development environment, remove the alias and add again. This time make sure you mark the alias as Default System. Transport to QA/Prod.
If that doesn’t help then check if the service and model were transported correctly.
-	Go to transaction `/n/IWBEP/REG_SERVICE` and search for your service name. If it is not found, it was not transported from Development
-	Go to transaction `/n/IWBEP/REG_MODEL` and search for your service model. 

To collect the service and model follow the steps described in this [blog post](https://blogs.sap.com/2016/03/21/how-to-change-dev-class-tmp-for-the-repository-objects-of-an-odata-service/)


## Set up server environment on Nodejs

### Server Resources
* [Resource 1](https://www.acorel.nl/2016/12/consuming-sap-odata-services-from-angularjs-and-or-node-js/): https://www.acorel.nl/2016/12/consuming-sap-odata-services-from-angularjs-and-or-node-js/

### Purpose
Once we have completed the first part, which is setting up the way data is exposed from a backend SAP BW system, we need to set up our application’s server. The server is built on Node.js using the express framework. In the future the application will be extended with a MongoDB for writing additional data, such as comments and users.

There are a few reasons why we need to set up a server.

**CORS policy**

Pulling data directly to a client application will be blocked by cross-origin errors. To avoid this issue we will set up the server and add a proxy between the server and the client to enable data fetching.

**Re-structuring of the data**

A data warehouse (structured database), specifically a SAP BW, has its own specific way of exposing data, which is not entirely convenient to use in a JavaScript application. The JSON API accessed via the oData URL contains properties with very long and not intuitive names, especially for a developer with a limited knowledge of SAP systems. 

**Building an oData URL manipulation class/library**

The use of URL parameters in oData from SAP BW can be very powerful but also a bit confusing for a developer who is not familiar with SAP systems. We will build our own JavaScript class or mini library on the server to easily pass correct parameters and values to the oData URL.
Read [here](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/) how to use oData URL parameters.

**Data fetch optimization**
Often times, the app will need to run many simple queries to feed its components. The aim is to move as many calculations, aggregations, filtering etc.. to the data warehouse, instead of doing them on the front-end. In the end the designated data bases were built in order to perform them in the most optimal way. Having a separate backend server allows us to decide which and how many queries are ran simultaneously in order to speed things up for the client. Browsers have a limit of six simultaneous requests. A backend server can do many more and combine them in a single request sent to the client.

**Data cache**
Not all applications need constant communication with BW. Some dashboards show static data that needs to be refreshed only once or twice a day. A backend server can build up a cache of the data requested from BW and received as a few kB of data in JSON format. This will allow to reduce traffic between the BW data center and the hosting platform and assure faster loading time for the end user.


### Server folder structure
* -**server** – app, index, config, package.json, seeds data
* --**common** – helper methods, constants, etc.
* --**data** – create urls, get data methods
* ---**mapping** – query information file
* --**routes**
* --**testing**

### Set up index and app
[**index.js**](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/index.js)

The [`index.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/index.js) script should start the server and should be kept as simple as possible.

```
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
```

[**app.js**](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/app.js)

The [`app.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/app.js) file exposes the app as a library. Here we use the express framework.

In the server folder, install *express*, *body-parser* and *request*. Also add *nodemon* globally and as a devdependency in order to automatically refresh the application after saving changes.

With npm:
```
npm i express body-parser request –save
npm i –g nodemon –save-dev
```

Or with yarn:
```
yarn add express body-parser request
yarn add nodemon –dev
```

See `package.json` to view dependencies and add scripts.


The application can be run by executing the `nodemon index.js` script. Before it is possible to do so, it is required to set up the `app.js` and routes.

The [`app.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/app.js) initializes the express application and handles routes. Routers are stored in a separate folder and imported in the `app.js`.

```
const express = require('express');
const { config } = require('./common/config');
const healthRouter = require('./routers/health');
const salesRouter = require('./routers/sales');

const app = express();

// Define main router
const indexRouter = express.Router();

// Define hello page for index - should be available for health checks on ALB
indexRouter.get('/', (req, res) => {
    res.status(200).send(`
    <h1>Hello from BW Node.js server.</h1>
    <p>Contact us via abc@def.com</p>
    `);
});

// Health page displays info about uptime and connection to the data center (SAP BW / SAP HANA BW)
indexRouter.use(config.baseUrl.health, healthRouter);

// Sales routes used in the Retail Flash application - connect to SAP BW via oData
indexRouter.use(config.baseUrl.api, salesRouter);

// Configure router to be based on a path where it's deployed
// Example: ALB listeners on AWS EC2 could have a rule defined for path '/bw*', app is hosted on example.com/bw
app.use(config.baseUrl.index, indexRouter);

module.exports = app;
```

### Create object mapping file
In BW, each object has usually a key and a text property, and each measure has a value and (optionally) a unit (currency, pieces, m2 etc.). Therefore, it is useful to group all properties of one object together. This way it is later easier to use the whole object with its properties in the client app.

In order to restructure data, it is necessary to build a mapping file with query details and a list of expected dimensions and measures. Such file will also allow to keep all metadata in one place, which can be useful especially when the data source structure changes. There are often multiple objects for the same thing in BW and depending on the business use, it might be necessary at some point to use another technical name for the same object. Creation of a mapping file will allow us to do such change only in one place, instead of everywhere in our code. Also, thanks to the restructuring we will be able to access the data using standard JavaScript object names, instead of long technical names from BW. For example to get a *Country* name from the data we can simply refer to `results.country.text`, instead of `results[“A0COUNTRY_T”]`. Using strings everywhere in the code is generally evil.

The [mapping file](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/mapping/queryInfo.js) is located in [`server/data/mapping/queryInfo.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/mapping/queryInfo.js) and contains details as seen below:

```
const queryInfo = {
    service: 'T_ODATA_SRV',
    query: 'T_ODATA',
    variables: {
        date: 'VAR_DATE',
    },
    dimensions: {
        country: {
            key: "0COUNTRY",
            text: "0COUNTRY_T",
        },
        division: {
            key: "0MATERIAL__0DIVISION",
            text: "0MATERIAL__0DIVISION_T",
        },
        period: {
            key: '0FISCPER',
            text: '0FISCPER_T',
        },
    },
    measures: {
        qty: {
            value: "AAAABBBBCCCCDDDDEEEEFFFF1",
        },
        sales: {
            value: "A0AMOUNT",
            unit: "A0AMOUNT_E",
        },
    },
}

module.exports = queryInfo;
```

The aim here is to re-structure the data from BW to a more JavaScript-like API. So to visualize, to change this BW output:

```
// yyyymmddhhmmss
// <url>

{
  "d": {
    "results": [
      {
        "__metadata": {
          "id": "<url>('V2.81.14.0_1.2.2.0%3A0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.9.0.0.0.0.0.0.X.0.0.0.0.0.0.1.0_IEQXXXXXXXX')",
          "uri": "<url>('V2.81.14.0_1.2.2.0%3A0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.9.0.0.0.0.0.0.X.0.0.0.0.0.0.1.0_ IEQXXXXXXXX')",
          "type": "<service_name>.<query_name>Result"
        },
        "A0COUNTRY": "DE",
        "A0AMOUNT": "1234",
        " A0AMOUNT _E": "EUR"
      }
    ]
  }
}
```

To a clean JSON which looks like this:

```
[
    {
        country: {
            key: "DE",
            text: “Germany”,
        }
        amount: {
            value: "1234",
            unit: “EUR”,
        }
    }
]
```
See [Routes](#routes) to see which methods are responsible for this change of JSON structure.

### Credentials
To access the data the application needs to be connected to the internal network and use credentials of a BW user with sufficient authorizations. Credentials are passed in `Base64` encoded format `username:password`. 

**Solution 1** - One service user with one set of authorizations to communicate between backend SAP BW system and the web app.

Use `process.env` to securely store credentials in the deployment environment. 
See [`system.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/system.js)

**Solution 2** - Allow users to log in using an input form to use their BW authorizations.

TODO: Add input forms to pass username and password and encode it using Base64 and pass to the server route with request

### oData URL manipulation class
Select data using chainable methods of a class [`BWoData`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/BWoData.js) which is defined in `server/data/`

Read [here](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/) how you can make use of all oData URL parameters.

### Data Cache
See [`DataCache.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/DataCache.js) from `server/data/`. For static data, a small data cache method can be built. If there is no need to refresh the data each time a user opens the app, you can reduce the amount of traffic between the data center and the hosting platform and also speed up the loading time of all components which need data from BW.


### Routes
See method [`getBWData.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/getBWData.js) from `server/data/` which stores a general methods to fetch data from a BW query using oData and to save it in DataCache. See [this blog post](https://www.acorel.nl/2016/12/consuming-sap-odata-services-from-angularjs-and-or-node-js/) for a demo presenting how to pull data to a node application using request. 

This method reuses the structure from the `queryInfo.dimensions` and `queryInfo.measures` and replaces the technical names from BW, which were placed as values, with the actual values from the oData results. It should be used for all routes leading to SAP BW data.

In the route file, which is directly used in the `app.js`, we can define the routes, and therefore selections, which we need for the client app. For example, we can create a get route `/api/sales/countries` which selects *Country*, *Quantity* and *Sales* amounts.

See [`generateURLs.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/generateURLs.js) from `server/data/` to see how the oData queries are created.

If the same selections are available in two queries and you want to merge results in one request, you can pass both queries in the array in the third parameter of `getBWData`. they will be executed in a Promise.all() statement. 

```
const express = require('express');
const { fetchAll, getFromCache } = require('../data/getBWData');
const { updateTimes, checkUpdateFreq } = require('../constants/updateTimes');
const DataCache = require('../data/DataCache');
const { query } = require('../data/generateURLs');

// Define a router for sales
const router = express.Router();

const routeDefinitions = [
    {
        path: '/countries',
        name: 'Countries',
        BWoDataArr: [query].map(el => el.countries),
    },
    {
        path: '/divisions',
        name: 'Divisions',
        BWoDataArr: [query].map(el => el.divisions),
    },
    {
        path: '/periods',
        name: 'Fiscal Periods',
        BWoDataArr: [query].map(el => el.periods),
    },
];

// Add base path for all above paths
const baseUrl = '/sales';

// All above requests follow exactly the same logic
routeDefinitions.forEach(async ({ path, name, BWoDataArr }, i) => {
    // Initialize Data Cache for route
    // Delay each request so that one query is not executed several times 
    // in exactly the same moment (SAP BW tend to have performance issues)
    const resultsCache = new DataCache(name, () => fetchAll(BWoDataArr), updateTimes, checkUpdateFreq, 1000 * 10 * i);

    // Create Get request route
    router.get(`${baseUrl}${path}`, async (req, res) => {
        const response = await getFromCache(resultsCache);

        res.status(response.status).send(response);
    });
});

// Hello route
router.get('/', (req, res) => {
    res.status(200).send(`
    <h1>Hello from BW API.</h1>
    <p>Contact us via abc@def.com</p>
    `);
});

module.exports = router;
```

See the definition of [`getBWData`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/getBWData.js) method in `server/data`, which handles several kinds of responses from the source system (bad request, authorization etc.) and transforms the output to the desired one using the helper method [createObj](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/convertObj.js)


As a result the structure from the [`queryInfo.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/server/data/mapping/queryInfo.js):
```
dimensions: {
    country: {
        key: "0COUNTRY ",
        text: "0COUNTRY_T",
    },
    division: {
         key: "0MATERIAL__0DIVISION",
        text: "0MATERIAL__0DIVISION_T",
    },git 
},
measures: {
    qty: {
        value: "AAAABBBBCCCCDDDDEEEEFFFF1",
     },
     sales: {
         value: "A0AMOUNT",
         unit: "A0AMOUNT_E",
    },
},
```

...will be translated to the final API to be fetched by client:
```
// 20200608194735
// http://localhost:5000/api/sales/

{
  "info": "This is dummy data for demo purposes",
  "results": [
    {
      "country": {
        "key": "DE",
        "text": "Germany"
      },
      "division": {
        "key": "A",
        "text": "A Products"
      },
      "qty": {
        "value": 123
      },
      "sales": {
        "value": 2345.25,
        "unit": "EUR"
      }
    },
    {
      "country": {
        "key": "DE",
        "text": "Germany"
      },
      "division": {
        "key": "B",
        "text": "B Products"
      },
      "qty": {
        "value": 346
      },
      "sales": {
        "value": 6378.5,
        "unit": "EUR"
      }
    }
  ]
}
```

## Set up React client app

### Client resources
* [Resource 1](https://reactjs.org/docs/create-a-new-react-app.html): https://reactjs.org/docs/create-a-new-react-app.html 
* [Resource 2](https://create-react-app.dev/docs/proxying-api-requests-in-development/): https://create-react-app.dev/docs/proxying-api-requests-in-development/

### Create react app
Create an app called *client* inside the main folder.
```
npx create-react-app client
```

### Start scripts
Go to `package.json` in the main app folder (so outside `client` and `server`) and install *concurrently* as we will need it to run both server and client at the same time.

Add below scripts to run the whole application using `npm run dev`.
```
"scripts": {
        "install-all": "yarn install && yarn --cwd client install && yarn --cwd server install",
        "client": "npm run start --prefix client",
        "server": "npm run start --prefix server",
        "dev": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\"",
        "start": "npm run dev"
    },
```

### Proxy
Add proxy for communication between the client and the server in `package.json` in the `client` folder. 
This is to resolve CORS errors. The port number must correspond to the port number used on the server, in our example it is 5000.
```
    "proxy": "http://localhost:5000",
```

### Service scripts
We need to define service methods to pull data from our server API to the client. We will use *axios* library to handle that.

Install *axios* in the client and add as a dependency.

```
npm i axios –-save
```
Or with yarn:
```
yarn add axios
```

In the `client/src` folder, create a folder called *services* and add there a file corresponding to a route file from the server. In this demo app the fille is called [`salesService.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/client/src/services/salesService.js).

```
import axios from 'axios';

export default {
    get: async () => {
        let res = await axios.get(`/api/sales`);
        return res.data.results || [];
    },
};
```

### Display results in the app
To see that the data is passed from BW to server and from server to client, go to [`App.js`](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/client/src/App.js) and import the [service file](https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react/blob/master/client/src/services/salesService.js). Then add a simple code to display data.

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import salesService from './services/salesService';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    salesService.get().then(data => this.setState({ data: data }));
  }

  render() {
    const { data } = this.state;

    return data ? (
      <React.Fragment>
        {data.map(row => <h1>{row.country.text} - {row.sales.value}</h1>)}
      </React.Fragment>
    ) : (
        <React.Fragment>
          dataviz app
        </React.Fragment>
      )
  }
}

export default App;
```

Our API returns:

<img src="public/images/server-dummy-result.png" width="250"/>

And the app:

<img src="public/images/client-app-result-1.png" width="250"/>

## D3 Data viz components
See [this repository](https://github.com/spookydoodle/dataviz) and [this page](https://spookydoodle.github.io/dataviz) to view code for a cool data vizualization app using D3 and React.js
