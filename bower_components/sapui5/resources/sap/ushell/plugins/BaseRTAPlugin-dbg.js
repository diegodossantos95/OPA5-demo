sap.ui.define(["sap/ui/core/Component",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"], function(
		Component,
		ResourceModel,
		MessageBox,
		BusyIndicator ) {

	"use strict";

	/*global jQuery, sap, localStorage, window */

	var BaseRTAPlugin = sap.ui.core.Component.extend("sap.ushell.plugins.BaseRTAPlugin", {

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererCreated' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		init: function (mConfig) {
			var that = this;
			this.mConfig = mConfig;
			this.i18n = this.getModel("i18n").getResourceBundle();
			this._getRenderer().fail(function (sErrorMessage) {
				jQuery.sap.log.error(sErrorMessage, undefined, this.mConfig.sComponentName);
			})
			.done(function (oRenderer) {
				var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle");
				/**
				 * Check if we are in a SAPUI5 application not on the Shell
				 * and then check for RTA restart
				 */
				var oCurrentApplication = oAppLifeCycleService.getCurrentApplication();
				if (oCurrentApplication && this._checkUI5App(oCurrentApplication)) {
					this._checkRestartRTA();
				}

				oAppLifeCycleService.attachAppLoaded(function (oEvent) {
					if (this._checkUI5App(oEvent.mParameters)) {
						this._checkRestartRTA();
					}
				}.bind(this));

				var _fOnAdapt = function(oEvent) {
					that._onAdapt(oEvent);
				};

				//Button will only be added once even when more instances of this component are created
				oRenderer.addActionButton("sap.ushell.ui.launchpad.ActionItem", {
					id: this.mConfig.id,
					text: this.i18n.getText(this.mConfig.text),
					icon: this.mConfig.icon,
					press: _fOnAdapt,
					visible: this.mConfig.visible
				}, true, false, [oRenderer.LaunchpadState.App]);
			}.bind(this));
		},

		exit: function () {
			if (this._oShellContainer && this._onRendererCreated) {
				this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
			}
		},

		/**
		 * Event handler for the "Adapt" button of the RTA FLP Plugin
		 * Checks the supported browsers and starts the RTA
		 * @param  {sap.ui.base.Event} oEvent the button click event
		 * @private
		 */
		_onAdapt: function(oEvent) {
			var bSupportedBrowser = ((sap.ui.Device.browser.msie && sap.ui.Device.browser.version > 10) || sap.ui.Device.browser.webkit || sap.ui.Device.browser.firefox || sap.ui.Device.browser.edge);

			if (!bSupportedBrowser) {
				MessageBox.error(this.i18n.getText("MSG_UNSUPPORTED_BROWSER"), {
					title: this.i18n.getText("ERROR_TITLE"),
					onClose: null
				});
			} else {
				window.setTimeout(function() {
					this._switchToAdaptionMode();
				}.bind(this),0);
			}
		},

		/**
		 * Check if we are in a SAPUI5 application
		 * @private
		 * @returns {Boolean} if we are in a SAPUI5 application
		 */
		_checkUI5App: function(oCurrentApplication) {
			oCurrentApplication = oCurrentApplication ? oCurrentApplication : this._getCurrentRunningApplication();
			var bUI5App = oCurrentApplication && oCurrentApplication.applicationType === "UI5" && !oCurrentApplication.homePage;
			return bUI5App;
		},

		/**
		 * Checks if RTA needs to be restarted, e.g after 'Reset to default'
		 * @private
		 */
		_checkRestartRTA: function() {
			var bRestart = !!window.localStorage.getItem("sap.ui.rta.restart." + this.mConfig.layer);
			if (bRestart) {
				window.localStorage.removeItem("sap.ui.rta.restart." + this.mConfig.layer);
				this._switchToAdaptionMode();
			}
		},

		/**
		 * Gets the current root application
		 * @private
		 */
		_getCurrentRunningApplication: function() {
			var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle");
			var oApp = oAppLifeCycleService.getCurrentApplication();

			return oApp;
		},

		/**
		 * Leaves the RTA adaption mode and destroys the RTA
		 * @private
		 */
		_switchToDefaultMode: function() {
			if (this._oRTA) {
				this._oRTA.destroy();
				this._oRTA = null;
			}
		},

		/**
		 * Turns on the adaption mode of the RTA FLP plugin
		 * @private
		 */
		_switchToAdaptionMode: function() {
			var bUI5App = this._checkUI5App();

			if (!bUI5App) {
				MessageBox.error(this.i18n.getText("MSG_UNSUPPORTED_APP"), {
					title: this.i18n.getText("ERROR_TITLE"),
					onClose: null
				});
				return;
			}
			var oCurrentRunningApp = this._getCurrentRunningApplication();
			var oRootControl = oCurrentRunningApp.componentInstance.getAggregation("rootControl");

			// Start Runtime Authoring
			if (this._oRTA) {
				this._startRta(oRootControl);
			} else {
				BusyIndicator.show(0);
				//load it on demand
				sap.ui.getCore().loadLibraries(["sap.ui.dt","sap.ui.rta"], {async: true}).then(function(){
					sap.ui.require(["sap/ui/rta/RuntimeAuthoring"], function(RuntimeAuthoring) {
						this._oRTA = new RuntimeAuthoring({
							flexSettings: {
								layer: this.mConfig.layer,
								developerMode: this.mConfig.developerMode
							}
						});

						this._oRTA.attachEvent('start', function(oEvent) {
							BusyIndicator.hide();
							this._onStartHandler(oEvent);
						}, this);

						this._oRTA.attachEvent('failed', this._errorHandler, this);

						this._oRTA.attachEvent('stop', this._switchToDefaultMode, this);

						this._loadPlugins(this._oRTA)

						.then(function() {
							this._startRta(oRootControl);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}
		},

		_startRta: function (oRootControl) {
			this._oRTA.setRootControl(oRootControl);
			this._oRTA.start().catch(this._errorHandler.bind(this));
		},

		_errorHandler: function (oError) {
			this._switchToDefaultMode();
			BusyIndicator.hide();
			jQuery.sap.log.error("exception occured while starting sap.ui.rta", oError.stack);
			MessageBox.error(this.i18n.getText("MSG_STARTUP_FAILED"), {
				title: this.i18n.getText("ERROR_TITLE"),
				onClose: null
			});
		},

		/**
		 * This function is called when the start event of RTA was fired
		 *
		 * @private
		 */
		_onStartHandler: function() {},

		/**
		 * This function should be used when custom plugins are needed
		 *
		 * @private
		 * @returns {Promise}
		 */
		_loadPlugins: function() {
			return Promise.resolve();
		}

	});
	return BaseRTAPlugin;

}, /* bExport= */true);