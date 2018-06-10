sap.ui.define(["jquery.sap.global", "sap/ui/base/Object"], function(jQuery, BaseObject) {
	"use strict";
	/**
	 * Draft transaction controller to be used in extensions of ObjectPage. Breakout coding can access an instance of this
	 * class via <code>ExtensionAPI.getTransactionController</code>. Do not instantiate yourself.
	 *
	 * @class
	 * @name sap.suite.ui.generic.template.ObjectPage.extensionAPI.DraftTransactionController
	 * @public
	 */

	function getMethods(oTemplateUtils, oController) {
		return /** @lends sap.suite.ui.generic.template.ObjectPage.extensionAPI.DraftTransactionController.prototype */	{
			/**
			 * Attach a handler to the activate event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			attachAfterActivate: function(fnFunction) {
				oTemplateUtils.oComponentUtils.attach(oController, "AfterActivate", fnFunction);
			},
			/**
			 * Detach a handler from the activate event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			detachAfterActivate: function(fnFunction) {
				oTemplateUtils.oComponentUtils.detach(oController, "AfterActivate", fnFunction);
			},
			/**
			 * Attach a handler to the discard event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			attachAfterCancel: function(fnFunction) {
				oTemplateUtils.oComponentUtils.attach(oController, "AfterCancel", fnFunction);
			},
			/**
			 * Detach a handler from the discard event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			detachAfterCancel: function(fnFunction) {
				oTemplateUtils.oComponentUtils.detach(oController, "AfterCancel", fnFunction);
			},
				/**
			 * Attach a handler to the delete event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			attachAfterDelete: function(fnFunction) {
				oTemplateUtils.oComponentUtils.attach(oController, "AfterDelete", fnFunction);
			},
			/**
			 * Detach a handler from the delete event
			 *
			 * @param {function} fnFunction the handler function
			 * @public
			 */
			detachAfterDelete: function(fnFunction) {
				oTemplateUtils.oComponentUtils.detach(oController, "AfterDelete", fnFunction);
			},
			/**
			 * perform a draft saving operation, executed in a sequential order
			 *
			 * @param {function} fnFunction function that saves the draft and returns a promise
			 * @public
			 * @experimental
			 */
			saveDraft: function(fnFunction) {
				oTemplateUtils.oServices.oApplicationController.addOperationToQueue(fnFunction, {draftSave : true});
			},
			/**
			 * Cancel the draft. Note that this method only works when you are on the root of a draft.
			 * The normal navigation which follows the cancellation of a draft is executed.
			 * Moreover, note that executing this method will set the App to be busy. However, it does not ensure, that
			 * the method is only called, when the App is currently unbusy. If you want to ensure that, you have to use
			 * {@link sap.suite.ui.generic.template.ObjectPage.extensionAPI.ExtensionAPI#securedExecution}.
			 *
			 * @return {function} a promise that is resolved when the draft is cancelled, rejected when this is not possible.
			 * @public
			 * @experimental
			 */
			discardDraft: function(){
				return oTemplateUtils.oCommonEventHandlers.discardDraftWithoutDialog();                         	
			},
			/**
			 * checks if side effects exist for the given properties or entities and executes them. if there are
			 *  pending changes in the model those pending changes are sent as a patch request with the side effect
			 *  batch request. If no source property and no source entity is passed a global side effect is executed
			 *
			 * @param {object} [oSideEffects] object containing any of the following properties:
			 * @param {array}  oSideEffects.sourceProperties array with property paths
			 * @param {array}  oSideEffects.sourceEntities array with navigation property paths
			 * @public
			 * @experimental
			 */
			executeSideEffects: function(oSideEffects) {
				oSideEffects = oSideEffects || {};
				oTemplateUtils.oServices.oApplicationController.executeSideEffects(oController.getView().getBindingContext(),oSideEffects.sourceProperties, oSideEffects.sourceEntities, false);
			}
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ObjectPage.extensionAPI.DraftTransactionController", {
		constructor: function(oTemplateUtils, oController) {
			jQuery.extend(this, getMethods(oTemplateUtils, oController));

		}
	});
});