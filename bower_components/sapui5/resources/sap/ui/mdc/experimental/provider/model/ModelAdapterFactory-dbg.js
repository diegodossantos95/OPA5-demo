sap.ui.define([
	"sap/ui/model/MetaModel", "sap/ui/mdc/experimental/provider/model/ODataAdapter"
], function(MetaModel, ODataAdapter) {
	"use strict";

	/**
	 * @public
	 */
	var Factory = {
		adapterCache: {},
		promiseCache: {},
		adapterClassCache: {
			"sap/ui/mdc/experimental/provider/model/ODataAdapter": ODataAdapter
		}
	};

	/**
	 * Return a promise
	 */
	Factory.requestAdapter = function(oModel, sModelName, sAdapterClass) {
		var oKeyInfo = Factory._getKeyInfo(sModelName, sAdapterClass);

		if (!oModel.getMetaModel()) {
			throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapterFactory: Only models with meta model are allowed");
		}

		if (!Factory.promiseCache[oKeyInfo.key]) {
			Factory.promiseCache[oKeyInfo.key] = new Promise(function(resolve, reject) {
				var oAdapter = Factory.getAdapter(oModel, sModelName, sAdapterClass);
				if (oAdapter) {
					resolve(oAdapter);
				} else {
					sap.ui.require([
						sAdapterClass
					], function(Adapter) {
						var oAdapter = new Adapter(oModel, sModelName);
						if (oAdapter) {
							Factory.adapterCache[oKeyInfo.key] = oAdapter;
							resolve(oAdapter);
						} else {
							reject("Invalid class");
						}
					});
				}
			});
		}

		return Factory.promiseCache[oKeyInfo.key];
	};

	Factory.getAdapter = function(oModel, sModelName, sAdapterClass) {
		var oKeyInfo = Factory._getKeyInfo(sModelName, sAdapterClass);

		var oCachedAdapter = Factory.adapterClassCache[oKeyInfo.adapter];

		if (!oModel.getMetaModel()) {
			throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapterFactory: Only models with meta model are allowed");
		}

		if (Factory.adapterCache[oKeyInfo.key]) {
			return Factory.adapterCache[oKeyInfo.key];
		} else if (oCachedAdapter) {
			Factory.adapterCache[oKeyInfo.key] = new oCachedAdapter(oModel, sModelName);
			return Factory.adapterCache[oKeyInfo.key];
		}

		return null;
	};

	Factory._getKeyInfo = function(sModelName, sAdapterClass) {
		if (!sAdapterClass) {
			sAdapterClass = "sap/ui/mdc/experimental/provider/model/ODataAdapter";
		}

		var oKeyInfo = {
		     adapter: sAdapterClass,
		     modelName: sModelName,
		     key: sModelName + ">" + sAdapterClass
		};

		return oKeyInfo;
	};

	Factory.cacheAdapterClass = function(sAdapterClass, Adapter) {
		Factory.adapterClassCache[sAdapterClass] = Adapter;
	};

	return Factory;
});
