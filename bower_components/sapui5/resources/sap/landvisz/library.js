/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.library");jQuery.sap.require("sap.ui.core.Core");jQuery.sap.require("sap.ui.core.library");sap.ui.getCore().initLibrary({name:"sap.landvisz",dependencies:["sap.ui.core"],types:["sap.landvisz.ActionType","sap.landvisz.ComponentType","sap.landvisz.ConnectionLine","sap.landvisz.ConnectionType","sap.landvisz.DependencyType","sap.landvisz.DependencyVisibility","sap.landvisz.EntityCSSSize","sap.landvisz.LandscapeObject","sap.landvisz.ModelingStatus","sap.landvisz.OptionType","sap.landvisz.SelectionViewPosition","sap.landvisz.SolutionType","sap.landvisz.TechnicalSystemType","sap.landvisz.ViewType","sap.landvisz.internal.ContainerType"],interfaces:[],controls:["sap.landvisz.ConnectionEntity","sap.landvisz.Connector","sap.landvisz.LandscapeEntity","sap.landvisz.LandscapeViewer","sap.landvisz.LongTextField","sap.landvisz.Option","sap.landvisz.OptionEntity","sap.landvisz.OptionSource","sap.landvisz.internal.ActionBar","sap.landvisz.internal.DataContainer","sap.landvisz.internal.DeploymentType","sap.landvisz.internal.EntityAction","sap.landvisz.internal.EntityCustomAction","sap.landvisz.internal.HeaderList","sap.landvisz.internal.IdentificationBar","sap.landvisz.internal.LinearRowField","sap.landvisz.internal.ModelingStatus","sap.landvisz.internal.NestedRowField","sap.landvisz.internal.SingleDataContainer","sap.landvisz.internal.TreeField"],elements:[],version:"1.50.0"});jQuery.sap.declare("sap.landvisz.ActionType");sap.landvisz.ActionType={NORMAL:"NORMAL",MENU:"MENU"};jQuery.sap.declare("sap.landvisz.ComponentType");sap.landvisz.ComponentType={onDemand:"onDemand",onPremise:"onPremise",notDefined:"notDefined"};jQuery.sap.declare("sap.landvisz.ConnectionLine");sap.landvisz.ConnectionLine={Line:"Line",Arrow:"Arrow"};jQuery.sap.declare("sap.landvisz.ConnectionType");sap.landvisz.ConnectionType={ProductSystem:"ProductSystem",TechnicalSystem:"TechnicalSystem",MobileSolution:"MobileSolution"};jQuery.sap.declare("sap.landvisz.DependencyType");sap.landvisz.DependencyType={NETWORK_VIEW:"NETWORK_VIEW",BOX_VIEW:"BOX_VIEW"};jQuery.sap.declare("sap.landvisz.DependencyVisibility");sap.landvisz.DependencyVisibility={NETWORK:"NETWORK",BOX:"BOX",BOTH:"BOTH"};jQuery.sap.declare("sap.landvisz.EntityCSSSize");sap.landvisz.EntityCSSSize={Regular:"Regular",Medium:"Medium",Large:"Large",Small:"Small",Smallest:"Smallest",Smaller:"Smaller",Largest:"Largest",RegularSmall:"RegularSmall"};jQuery.sap.declare("sap.landvisz.LandscapeObject");sap.landvisz.LandscapeObject={TechnicalSystem:"TechnicalSystem",ProductSystem:"ProductSystem",Database:"Database",Product:"Product",ProductVersion:"ProductVersion",SapComponent:"SapComponent",Track:"Track"};jQuery.sap.declare("sap.landvisz.ModelingStatus");sap.landvisz.ModelingStatus={ERROR:"ERROR",WARNING:"WARNING",NORMAL:"NORMAL"};jQuery.sap.declare("sap.landvisz.OptionType");sap.landvisz.OptionType={ENTITY:"ENTITY",VIEW:"VIEW"};jQuery.sap.declare("sap.landvisz.SelectionViewPosition");sap.landvisz.SelectionViewPosition={LEFT:"LEFT",RIGHT:"RIGHT",CENTER:"CENTER"};jQuery.sap.declare("sap.landvisz.SolutionType");sap.landvisz.SolutionType={COMPONENT_VIEW:"COMPONENT_VIEW",DEPLOYMENT_VIEW:"DEPLOYMENT_VIEW"};jQuery.sap.declare("sap.landvisz.TechnicalSystemType");sap.landvisz.TechnicalSystemType={ABAP:"ABAP",JAVA:"JAVA",HANADB:"HANADB",DUAL:"DUAL",SBOP:"SBOP",SUP:"SUP",GENERIC:"GENERIC",INTROSCOPEMGR:"INTROSCOPEMGR",INTROSCOPESTD:"INTROSCOPESTD",LIVECACHESAP:"LIVECACHESAP",MDM:"MDM",TREX:"TREX",UNSP3TIER:"UNSP3TIER",UNSPCLUSTER:"UNSPCLUSTER",UNSPAPP:"UNSPAPP",MSNET:"MSNET",APACHESERVER:"APACHESERVER",WEBSPHERE:"WEBSPHERE",MSIISINST:"MSIISINST",WEBDISP:"WEBDISP"};jQuery.sap.declare("sap.landvisz.ViewType");sap.landvisz.ViewType={DEPENDENCY_VIEW:"DEPENDENCY_VIEW",SELECTION_VIEW:"SELECTION_VIEW",SOLUTION_VIEW:"SOLUTION_VIEW"};jQuery.sap.declare("sap.landvisz.internal.ContainerType");sap.landvisz.internal.ContainerType={Product:"Product",ProductVersion:"ProductVersion",ProductInstances:"ProductInstances",SoftwareComponents:"SoftwareComponents"};
