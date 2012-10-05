     
     
//-----------------------------------------------------------------
// Replace the values below with your own app configuration values.
//-----------------------------------------------------------------
var $j = jQuery.noConflict();
var debugMode = true;

// The client ID value specified for your remote access object that defines
// your application in Salesforce.
var remoteAccessConsumerKey = "3MVG9rFJvQRVOvk4c7QxcZcxQrwYxhOFUh28Y5SVSNJIgR5i01OMQJy0.qSbiSXbR0Ow2KNQ6t12G_6yOlIty";//@msdk.itbconsult.com

// The redirect URI value specified for your remote access object that defines
// your application in Salesforce.
var oauthRedirectURI = "testsfdc:///itbdemo/detect/oauth/done";

// The authorization/access scope(s) you wish to define for your application.
var oauthScopes = ["visualforce","api"];

// The start page of the application.  This is the [pagePath] portion of
// http://[host]/[pagePath].  Leave blank to use the local index.html page.
var startPage = "";  // Used for local REST-based"index.html" PhoneGap app.
//var startPage = "apex/BasicVFPage"; //used for Visualforce-based apps


// Whether the container app should automatically refresh our oauth session on app foreground:
// generally a good idea.
var autoRefreshOnForeground = true; 
var apiVersion = "v23.0";
var forcetkClient={};
var appStartTime = new Date();


//-----------------------------------------------------------------
// End configuration block
//-----------------------------------------------------------------
        
            

