sap.ui.define([
  "sap/ui/core/util/MockServer",
  "com/sap/CloudSCAME/OPA5Demo/test/localService/mockrequests"
], function (MockServer, mockrequests) {
  "use strict";
	
  var oMockServer;		

  return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
    init : function () {
      var oUriParameters = jQuery.sap.getUriParameters(),								
        sMockServerUrl = "";

      oMockServer = new MockServer({
        rootUri : sMockServerUrl
      });

			//add your requests to the ones already set 
      try {
			  var aMyRequests = mockrequests.getRequests();
			  if (aMyRequests.length > 0) {
			    oMockServer.setRequests(oMockServer.getRequests().concat(aMyRequests));
			  }
      } catch (oErr) {
			  jQuery.sap.log.error(oErr.message);
      }

			// configure mock server with a delay of 1s
      MockServer.config({
        autoRespond : true,
        autoRespondAfter : (oUriParameters.get("serverDelay") || 500)
      });

      oMockServer.start();

      jQuery.sap.log.info("Running the app with mock data");
    }
  };
});