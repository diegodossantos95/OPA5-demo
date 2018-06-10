sap.ui.define(['sap/ui/core/Renderer'],
	function () {
		"use strict";

		return {
			render: function (oRM, oNetworkGraphMap) {
				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMap\"");
				oRM.writeControlData(oNetworkGraphMap);
				oRM.write(">");

				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMapTitle\">");

				oRM.write("<span class=\"sapSuiteUiCommonsNetworkGraphMapTitleText\">");
				oRM.writeEscaped(oNetworkGraphMap.getTitle());
				oRM.write("</span>");

				oRM.write("</div>");

				oRM.write("<div class=\"sapSuiteUiCommonsNetworkGraphMapContent\">");
				oRM.write("</div>");

				oRM.write("</div>");
			}
		};
	}, true);