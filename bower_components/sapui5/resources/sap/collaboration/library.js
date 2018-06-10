/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.library");jQuery.sap.require("sap.ui.core.Core");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.suite.ui.commons.library");sap.ui.getCore().initLibrary({name:"sap.collaboration",dependencies:["sap.ui.core","sap.suite.ui.commons"],types:["sap.collaboration.AppType","sap.collaboration.DisplayFeedType","sap.collaboration.FeedType"],interfaces:[],controls:[],elements:[],version:"1.50.4"});jQuery.sap.declare("sap.collaboration.AppType");sap.collaboration.AppType={split:"split",widget:"widget"};jQuery.sap.declare("sap.collaboration.DisplayFeedType");sap.collaboration.DisplayFeedType={BusinessRecordFeed:"BusinessRecordFeed",GroupFeedsWhereBusinessRecordIsLinked:"GroupFeedsWhereBusinessRecordIsLinked"};jQuery.sap.declare("sap.collaboration.FeedType");sap.collaboration.FeedType={follows:"follows",company:"company",group:"group",objectGroup:"objectGroup",object:"object",GroupIds:"GroupIds",BusinessObjectGroups:"BusinessObjectGroups",UserGroups:"UserGroups"};
