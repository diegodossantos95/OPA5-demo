sap.ui.define([
	"./LayoutAlgorithm",
	"./LayoutTask"
], function (LayoutAlgorithm, LayoutTask) {

	/**
	 * Constructor for a new NoopLayout.
	 *
	 * @class
	 * This is a simple layout algorithm that expects the positions of nodes to be already present. It only creates
	 * line coordinates (see {@link sap.suite.ui.commons.networkgraph.Line#setCoordinates}).
	 * @abstract
	 *
	 * @extends sap.suite.ui.commons.networkgraph.layout.LayoutAlgorithm
	 *
	 * @constructor
	 * @public
	 * @alias sap.suite.ui.commons.networkgraph.layout.NoopLayout
	 */
	var NoopLayout = LayoutAlgorithm.extend("sap.suite.ui.commons.networkgraph.layout.NoopLayout");

	/**
	 * Specifies if this layout algorithm distributes nodes into layers. Parent graph may change behaviour based
	 * on this option.
	 * @returns {boolean} Always true
	 * @public
	 */
	NoopLayout.prototype.isLayered = function () {
		return true;
	};

	/**
	 * Executes the layout algorithm.
	 * @returns {sap.suite.ui.commons.networkgraph.layout.LayoutTask} Task to get the layout calculated.
	 * @public
	 */
	NoopLayout.prototype.layout = function () {
		return new LayoutTask(function (fnResolve, fnReject, oLayoutTask) {
			var oFromCenter, oToCenter,
				oGraph = this.getParent();

			if (oLayoutTask.isTerminated()) {
				fnResolve();
				return;
			}

			if (!oGraph) {
				fnReject("The algorithm must be associated with a graph.");
				return;
			}

			oGraph.getLines().forEach(function (oLine) {
				oFromCenter = oLine.getFromNode().getCenterPosition();
				oLine.setSource({
					x: oFromCenter.x,
					y: oFromCenter.y
				});
				oToCenter = oLine.getToNode().getCenterPosition();
				oLine.setTarget({
					x: oToCenter.x,
					y: oToCenter.y
				});
				oLine.clearBends();
			});

			fnResolve();
		}.bind(this));
	};

	return NoopLayout;
});