sap.ui.define([
	"sap/ui/core/Element"
], function (Element) {

	/**
	 * Constructor for a new LayoutingAlgorithm.
	 *
	 * @class
	 * This is an abstract base class for Layout Algorithms.
	 * @abstract
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @constructor
	 * @public
	 * @alias sap.suite.ui.commons.networkgraph.layout.LayoutAlgorithm
	 */
	var LayoutAlgorithm = Element.extend("sap.suite.ui.commons.networkgraph.layout.LayoutAlgorithm", {
		metadata: {
			"abstract": true,
			publicMethods: [
				"isLayered", "layout"
			]
		}
	});

	/**
	 * Implement in inheriting classes.
	 * @abstract
	 *
	 * Specifies if this layouting algorithm distributes nodes into layers. Parent graph may change behaviour based
	 * on this option.
	 *
	 * @name sap.suite.ui.commons.networkgraph.LayoutAlgorithm.prototype.isLayered
	 * @function
	 * @public
	 */

	/**
	 * Implement in inheriting classes.
	 * @abstract
	 *
	 * Executes the layouting algorithm.
	 *
	 * @name sap.suite.ui.commons.networkgraph.LayoutAlgorithm.prototype.layout
	 * @function
	 * @returns {sap.suite.ui.commons.networkgraph.layout.LayoutTask}
	 * @public
	 */

	return LayoutAlgorithm;
});