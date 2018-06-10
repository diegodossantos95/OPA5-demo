/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

sap.landvisz.internal.Connection = function() {
};

sap.landvisz.internal.Connection.init = function() {

	this.setting = {
		showLog : true, // [boolean:false] to decide show logs in firebug, IE8, chrome console
		animationSpeed : 10
	// [number:1000] the speed of animations: maximize, restore, select, unselect, in milliseconds
	};
	// to remember current clv connection entity instance
	this.initialized = false;
	// a boolean flag to check is it initialized?

	this.initialRow = 0;
	this.initialCol = 0;

	this.allConnections = [];
	this.clvConnections = [];

	this.sourceDoneList = {};
	this.targetDoneList = {};
	this.nodeDoneList = {};

	this.sourceConnectionMatrix = {};
	this.targetConnectionMatrix = {};
	this.connectionMatrix = {};

	this.topPostions = {};
	this.connectedNodesLayout = {};
	this.svgForConnections = null;
    this.isConnectionEntity = false;
    this.isSystemEntity = false;
	//this.connectionData = connectionsData;
	//this.containerInstance = containerInstance;

	//this.initialize(this.containerInstance, this.connectionsData);
};

sap.landvisz.internal.Connection.hideConnections = function() {
	if (this.svgForConnections) {
		jQuery(this.svgForConnections.canvas).hide();
	}
}

sap.landvisz.internal.Connection.getConnectedNodesLayoutTrack= function(connections) {
	
	
	if (connections.length > 0) {
		this.allConnections = connections;
		
		if (jQuery.isEmptyObject(this.connectedNodesLayout)) {
			for ( var i = 0; i < this.allConnections.length; i++) {
				
				this.getAllTargets(this.allConnections[i].getSource());
				this.getAllSources(this.allConnections[i].getSource());
				
				}
			}
		
		
		var nodePosition = {};
		nodePosition.row = this.initialRow;
		nodePosition.col = this.initialCol;
		var node;
		var nodeName;
		var firstNode = true;
		for ( var key in this.sourceConnectionMatrix) {
			this.connectionMatrix[key] = [];
			this.connectionMatrix[key].sources = this.sourceConnectionMatrix[key];
			this.connectionMatrix[key].targets = this.targetConnectionMatrix[key];
			
			if(!this.connectedNodesLayout[key] && firstNode == true ){
				this.connectedNodesLayout[key] = nodePosition;
				node = this.connectionMatrix[key];
				nodeName = key;
				firstNode = false;
			}
		}
		
		this.assignIndexToConnectedNodes(node, nodeName);
		
		
		
//		var nodePosition = {};
//		nodePosition.row = this.initialRow;
//		nodePosition.col = this.initialCol;
//		var node;
//		for ( var key in this.connectionMatrix) {
//				node = this.connectionMatrix[key];
//				if(!this.connectedNodesLayout[key])
//				this.connectedNodesLayout[key] = nodePosition;
//				if(node.targets.length>0){
//					this.assignTargetIndex(key);
//				}
//				if(node.sources.length>1){
//					this.assignSourceIndex(key);
//				}
//		}
//
	}
	return this.connectedNodesLayout;
};

sap.landvisz.internal.Connection.assignIndexToConnectedNodes= function(node,key) {
	
	if (node.targets.length>0 )
		this.assignTargetIndex(key);
	if ( node.sources.length>0) 
		this.assignSourceIndex(key)
	
};

sap.landvisz.internal.Connection.assignTargetIndex= function(nodename) {
	var node = this.connectionMatrix[nodename];
	var row = this.connectedNodesLayout[nodename].row;
	var col = this.connectedNodesLayout[nodename].col;
	var targetNode;
	for ( var i = 0; i < node.targets.length; i++) {
		
		targetNode = this.connectionMatrix[node.targets[i]];
		if(i==0)
		col++;
		else{
		row++;
		if(targetNode && targetNode.targets.length>0)
			col = col + targetNode.targets.length -1;
		}
		var nodePosition = {};
		nodePosition.row = row;
		nodePosition.col = col;
		if(!this.connectedNodesLayout[node.targets[i]])
		this.connectedNodesLayout[node.targets[i]] = nodePosition;
		if(targetNode)
			this.assignIndexToConnectedNodes(targetNode,node.targets[i]);
	}
};

sap.landvisz.internal.Connection.assignSourceIndex= function(nodename) {
	
	var node = this.connectionMatrix[nodename];
	var row = this.connectedNodesLayout[nodename].row;
	var col = this.connectedNodesLayout[nodename].col; 
	
	for ( var i = 0; i < node.sources.length; i++) {
		if(!this.connectedNodesLayout[node.sources[i]]){
		col--;
		row++;
		var nodePosition = {};
		nodePosition.row = row;
		nodePosition.col = col;
		
		this.connectedNodesLayout[node.sources[i]] = nodePosition;
		if(this.connectionMatrix[node.targets[i]])
			this.assignIndexToConnectedNodes(this.connectionMatrix[node.targets[i]],node.targets[i]);
		}
	}
};

sap.landvisz.internal.Connection.getAllTargets= function(sourceConnection) {
	
	var targetMatrixCol = [];
	if (!this.sourceDoneList[sourceConnection]) {
		this.sourceDoneList[sourceConnection] = true;
		for ( var j = 0; j < this.allConnections.length; j++) {
			if (sourceConnection == this.allConnections[j].getSource()) {
				targetMatrixCol.push(this.allConnections[j].getTarget());
			}
		}

		this.targetConnectionMatrix[sourceConnection] = targetMatrixCol;
	}
};

sap.landvisz.internal.Connection.getAllSources= function(sourceConnection) {
	
	var sourceMatrixCol = [];
	if (!this.targetDoneList[sourceConnection]) {
		this.targetDoneList[sourceConnection] = true;
		for ( var j = 0; j < this.allConnections.length; j++) {
			if (sourceConnection == this.allConnections[j].getTarget()) {
				sourceMatrixCol.push(this.allConnections[j].getSource());
			}
		}

		this.sourceConnectionMatrix[sourceConnection] = sourceMatrixCol;
	}
};

sap.landvisz.internal.Connection.getConnectedNodesLayout = function(connections) {

	//	this.getAllConnections(this.connectionsData);
	if (connections.length > 0) {
		this.allConnections = connections;
		if (jQuery.isEmptyObject(this.connectedNodesLayout)) {
			for ( var i = 0; i < this.allConnections.length; i++) {
				this.getSourceTargetConnections(this.allConnections[i]
						.getSource());
				this.getTargetSourceConnections(this.allConnections[i]
						.getTarget());
			}

			for ( var key in this.sourceConnectionMatrix) {
				this.connectionMatrix[key] = jQuery.merge(jQuery.merge([],
						this.sourceConnectionMatrix[key]),
						this.targetConnectionMatrix[key]);
			}

			var nodePosition = {};
			nodePosition.row = this.initialRow;
			nodePosition.col = this.initialCol;

			for ( var key in this.connectionMatrix) {
				if (this.connectionMatrix[key].length == 1) {
					this.connectedNodesLayout[key] = nodePosition;
					this.nodeDoneList[key] = true;
					if (!this.topPostions[this.initialRow]) {
						this.topPostions[this.initialRow] = [];
					}
					this.topPostions[this.initialRow].push(this.initialCol);
					this.findConnectedNodes(key);
					break;
				}
			}
		}
	}
	return this.connectedNodesLayout;

};

sap.landvisz.internal.Connection.getAllConnections = function() {
	if (this.allConnections.length == 0) {
		jQuery(this.connectionsData).find('CONNECTION').each(function() {
			var connection = this.parseSingleConnection(jQuery(this));
			this.allConnections.push(connection);
		});
	}
	return this.allConnections;
};

sap.landvisz.internal.Connection.parseSingleConnection = function(
		connectionData) {
	var properties = {};

	jQuery(connectionData).children('DATA').each(function() {
		var property = jQuery(this).attr('property');
		var value = jQuery.trim(jQuery(this).attr('value'));

		switch (property.toUpperCase()) {
		case 'CONNECTION-UUID':
			properties.uuid = value;
			break;
		case 'CONNECTION-TYPE':
			properties.type = value;
			break;
		case 'TEXT':
			properties.text = value;
			break;
		case 'SOURCE-ENTITY-UUID':
			properties.source = value;
			break;
		case 'TARGET-ENTITY-UUID':
			properties.target = value;
			break;
		}
	});
	return properties;
};

sap.landvisz.internal.Connection.getSourceTargetConnections = function(
		sourceConnection) {
	var sourceMatrixCol = [];

	if (!this.sourceDoneList[sourceConnection]) {
		this.sourceDoneList[sourceConnection] = true;
		for ( var j = 0; j < this.allConnections.length; j++) {
			if (sourceConnection == this.allConnections[j].getSource()) {
				sourceMatrixCol.push(this.allConnections[j].getTarget());
				this.getSourceTargetConnections(this.allConnections[j].getTarget());

			}
		}

		this.sourceConnectionMatrix[sourceConnection] = sourceMatrixCol;
	}
};

sap.landvisz.internal.Connection.getTargetSourceConnections = function(
		targetConnection) {
	var targetMatrixCol = [];

	if (!this.targetDoneList[targetConnection]) {
		this.targetDoneList[targetConnection] = true;
		for ( var j = 0; j < this.allConnections.length; j++) {
			if (targetConnection == this.allConnections[j].getTarget()) {
				targetMatrixCol.push(this.allConnections[j].getSource());
				this.getTargetSourceConnections(this.allConnections[j].getSource());
			}
		}

		this.targetConnectionMatrix[targetConnection] = targetMatrixCol;
	}
};

sap.landvisz.internal.Connection.findConnectedNodes = function(nodeName) {
	var node = this.connectionMatrix[nodeName];
	var connectedNodesCount = 0;
	var row = this.connectedNodesLayout[nodeName].row;
	var col = this.connectedNodesLayout[nodeName].col;
	var remainingNodes = [];

	for ( var i = 0; i < node.length; i++) {
		if (!this.nodeDoneList[node[i]]) {
			remainingNodes[connectedNodesCount] = node[i];
			connectedNodesCount++;
		}
	}

	connectedNodesCount = node.length - remainingNodes.length;

	for ( var i = 0; i < remainingNodes.length; i++) {
		connectedNodesCount++;

		if (connectedNodesCount == 1) {
			col++;
		} else {
			if (connectedNodesCount == 2) {
				if (row != 0) {
					var checkCol = col;
					var checkRow = row - 1;
					if (node.length > 2
							&& !this.inTopPosition(checkRow, checkCol)) {
						row--;
					}
				}
				col++;
			} else if (connectedNodesCount >= 3) {
				row++;
			}
		}

		var nodePosition = {};
		nodePosition.row = row;
		nodePosition.col = col;

		this.connectedNodesLayout[remainingNodes[i]] = nodePosition;
		this.nodeDoneList[remainingNodes[i]] = true;

		if (!this.topPostions[row]) {
			this.topPostions[row] = [];
		}
		this.topPostions[row].push(col);

		var rowPosition = this.findConnectedNodes(remainingNodes[i]);
		row = rowPosition;
	}

	return row;
}

sap.landvisz.internal.Connection.inTopPosition = function(row, col) {
	if (this.topPostions[row]) {
		for ( var i = 0; i < this.topPostions[row].length; i++) {
			if (this.topPostions[row][i] == col) {
				return true;
			}
		}
	}
	return false;
};



sap.landvisz.internal.Connection.renderConnections = function(systems,connectionEntities,type) {
	for ( var i = 0; i < this.allConnections.length; i++) {
		var connection = this.allConnections[i];
		connection.sourceEntity = this.getEntity(systems,connectionEntities,this.allConnections[i].getSource());
		connection.targetEntity = this.getEntity(systems,connectionEntities,this.allConnections[i].getTarget()); 
		this.clvConnections.push(connection);
	}

	if (this.clvConnections.length == 0)
		return;

	//update the svg canvas size with the parent scroll szie
//	if (this.svgForConnections) {
//		this.svgForConnections
//				.setSize(
//						this.clvContainerInstance.getClvContainerFrame()[0].scrollWidth,
//						this.clvContainerInstance.getClvContainerFrame()[0].scrollHeight);
//		this.showConnections();
//	}
	var endMarker = this.svgForConnections.append( "marker" ).attr( "id", "endMarker" )
	   .attr( "viewBox", "0 0 10 10")
	   .attr( "markerWidth", 10 )
	   .attr( "markerHeight", 3 )
	   .attr( "refX", 7 )
	   .attr( "refY", 4 )
	   .attr( "orient", "auto" )
	   .attr( "markerUnits", "strokeWidth" );
	
	endMarker.append( "path").attr( "d", "M0,0 L10,4 L0,8 z" );
	
	for ( var i = 0; i < this.clvConnections.length; i++) {
		this.drawConnection(this.clvConnections[i],type);
	}
}


sap.landvisz.internal.Connection.getEntity = function(systems,connectionEntities,connectorID){
	
	var id;
	
	this.isConnectionEntity = false;
	this.isSystemEntity = false;
	
	for (var i = 0; i < connectionEntities.length; i++) {
		
		id = connectionEntities[i].getConnectionId();
		if(connectorID == id)
			return jQuery.sap.byId(connectionEntities[i].getId());
	}
	
	
	for (var i = 0; i < systems.length; i++) {
		
		id = systems[i].getSystemId();
		
		if(connectorID == id)
			return jQuery.sap.byId(systems[i].getId());
	}
	
}; 


sap.landvisz.internal.Connection.drawConnection = function(clvConnection,type) {
	var sourceEntity = clvConnection.sourceEntity;
	var targetEntity = clvConnection.targetEntity;

	var sourceX = this.getX(sourceEntity);
	var sourceY = this.getY(sourceEntity);
	var targetX = this.getX(targetEntity);
	var targetY = this.getY(targetEntity);

	var sourceId = clvConnection.getSource();
	var targetId = clvConnection.getTarget();
	var sourceEntityPosition = this.connectedNodesLayout[sourceId];
	var targetEntityPosition = this.connectedNodesLayout[targetId];
	

	var connection = null;
	
	if (targetEntityPosition.row == sourceEntityPosition.row) {
		connection = this.svgForConnections.append("line");
		
		if(type == sap.landvisz.ConnectionLine.Arrow){
			sourceX = sourceX +122;
			targetX = targetX -122;
			connection.attr("marker-end","url(#endMarker)");
		}
		connection.attr("x1", sourceX);
		connection.attr("y1", sourceY);
		connection.attr("x2", targetX);
		connection.attr("y2", targetY);
		connection.attr("stroke", "#999");
		connection.attr("stroke-width", 2);
		connection.transition()
		.duration(1500)
		.delay(1000);
	} else if (targetEntityPosition.col == sourceEntityPosition.col) {
			
		    connection = this.svgForConnections.append("line");
			
			if(type == sap.landvisz.ConnectionLine.Arrow){
				sourceY = sourceY + 95;
				targetY = targetY - 95;
				connection.attr("marker-end","url(#endMarker)");
			}
			connection.attr("x1", sourceX);
			connection.attr("y1", sourceY);
			connection.attr("x2", targetX);
			connection.attr("y2", targetY);
			connection.attr("stroke", "#999");
			connection.attr("stroke-width", 2);
			connection.transition()
			.duration(1500)
			.delay(1000);
		} else if (targetEntityPosition.col > sourceEntityPosition.col) {
			
			if (targetEntityPosition.row < sourceEntityPosition.row){
			connection = this.svgForConnections.append("line");
			
			if(type == sap.landvisz.ConnectionLine.Arrow){
				sourceX = sourceX + 95;
				connection.attr("marker-end","url(#endMarker)");
				}
			connection.attr("x1", sourceX);
			connection.attr("y1", sourceY);
			connection.attr("x2", targetX);
			connection.attr("y2", sourceY);
			connection.attr("stroke", "#999");
			connection.attr("stroke-width", 2);
			connection.transition()
			.duration(1500)
			.delay(1000);
			
			connection = this.svgForConnections.append("line");
			if(type == sap.landvisz.ConnectionLine.Arrow){
				targetY = targetY + 95;
				connection.attr("marker-end","url(#endMarker)");
				}
			connection.attr("x1", targetX);
			connection.attr("y1", sourceY);
			connection.attr("x2", targetX);
			connection.attr("y2", targetY);
			connection.attr("stroke", "#999");
			connection.attr("stroke-width", 2);
			connection.transition()
			.duration(1500)
			.delay(1000);
			}
			else{
				connection = this.svgForConnections.append("line");
				
				if(type == sap.landvisz.ConnectionLine.Arrow){
					sourceY = sourceY + 95;
					connection.attr("marker-end","url(#endMarker)");
					}
				connection.attr("x1", sourceX);
				connection.attr("y1", sourceY);
				connection.attr("x2", sourceX);
				connection.attr("y2", targetY);
				connection.attr("stroke", "#999");
				connection.attr("stroke-width", 2);
				
				connection.transition()
				.duration(1500)
				.delay(1000);
				
				connection = this.svgForConnections.append("line");
				
				if(type == sap.landvisz.ConnectionLine.Arrow){
					targetX = targetX - 122;
					connection.attr("marker-end","url(#endMarker)");
					}
				connection.attr("x1", sourceX);
				connection.attr("y1", targetY);
				connection.attr("x2", targetX);
				connection.attr("y2", targetY);
				connection.attr("stroke", "#999");
				connection.attr("stroke-width", 2);
				connection.transition()
				.duration(1500)
				.delay(1000);
				
			}
		} else {
			
			connection = this.svgForConnections.append("line");
			connection.transition()
			connection.attr("x1", sourceX);
			connection.attr("y1", sourceY);
			connection.attr("x2", targetX);
			connection.attr("y2", sourceY);
			connection.attr("marker-end","url(#endMarker)");
			connection.attr("stroke", "#999");
			connection.attr("stroke-width", 2);
			connection.transition()
			.duration(1500)
			.delay(1000)
			connection.attr("x1", sourceX);
			
			connection = this.svgForConnections.append("line");
			connection.transition()
			connection.attr("x1", targetX);
			connection.attr("y1", sourceY);
			connection.attr("x2", targetX);
			connection.attr("y2", targetY);
			connection.attr("marker-end","url(#endMarker)");
			connection.attr("stroke", "#999");
			connection.attr("stroke-width", 2);
			
			connection.transition()
			.duration(1500)
			.delay(1000);
//			connection.attr("x1", sourceX);
//			connection = this.svgForConnections.append("path");
//			connection.attr("M" + sourceX + " "
//					+ sourceY);
//			connection.attr("stroke", "#999");
//			connection.attr("stroke-width", 2);
////			connection.animate({
////				'path' : "M" + sourceX + " " + sourceY + "H" + targetX
////			}, this.setting.animationSpeed);
//			connection = this.svgForConnections.append("path");
//			connection.attr("M" + targetX + " "
//					+ sourceY);
//			connection.attr("stroke", "#999");
//			connection.attr("stroke-width", 2);
//			connection.animate({
//				'path' : "M" + targetX + " " + sourceY + "V" + targetY
//			}, this.setting.animationSpeed);
	}
}

sap.landvisz.internal.Connection.getX = function(entity) {
	var srcLeft = parseInt(entity.css('left'));
	var srcWidth = entity[0].clientWidth;
	return  srcLeft + (srcWidth / 2);
	
}

sap.landvisz.internal.Connection.getY = function(entity) {
	var srcTop = parseInt(entity.css('top'));
	var srcHeight = entity[0].clientHeight;
	return srcTop + (srcHeight / 2);
	
}

sap.landvisz.internal.Connection.getTargetXMiddle = function(targetEntity) {
	var trgLeft = parseInt(targetEntity.css('left'));
	var trgWidth = targetEntity.outerWidth();
	if (targetEntity.hasClass('clv_entity_container')) {
		return (trgLeft + 26 + ((trgWidth - 26) / 2));
	} else if (targetEntity.hasClass('networkConnectionEntity')) {
		var trgParentLeft = parseInt(targetEntity.parent().css('left'));
		return (trgParentLeft + trgLeft + (trgWidth / 2));
	} else {
		return null;
	}
}

sap.landvisz.internal.Connection.getTargetYCenter = function(targetEntity) {
	var trgTop = parseInt(targetEntity.css('top'));
	var trgHeight = targetEntity.outerHeight();
	if (targetEntity.hasClass('clv_entity_container')) {
		return (trgTop + 32 + ((trgHeight - 32) / 2));
	} else if (targetEntity.hasClass('networkConnectionEntity')) {
		var trgParentTop = parseInt(targetEntity.parent().css('top'));
		return (trgParentTop + trgTop + (trgHeight / 2));
	} else {
		return null;
	}
}

sap.landvisz.internal.Connection.showConnections = function() {
	if (this.svgForConnections) {
		jQuery(this.svgForConnections.canvas).show();
	}
}

sap.landvisz.internal.Connection.destroyConnections = function() {
	if (this.svgForConnections) {
		this.svgForConnections.canvas.remove();
		this.svgForConnections = null;
	}
}

sap.landvisz.internal.Connection.getConnectedNodes = function(nodeName) {
	var connectedNodes = [];
	for ( var i = 0; i < this.allConnections.length; i++) {
		if (nodeName == this.allConnections[i].source) {
			connectedNodes.push(this.allConnections[i].target);
		} else if (nodeName == this.allConnections[i].target) {
			connectedNodes.push(this.allConnections[i].source);
		}
	}
	return connectedNodes;
}

sap.landvisz.internal.Connection.deinitialize = function() {
	if (this.initialized) {
		if (this.svgForConnections) {
			this.svgForConnections.canvas.remove();
			this.svgForConnections = null;
		}
		this.allConnections = [];
		this.clvConnections = [];

		this.sourceDoneList = {};
		this.targetDoneList = {};
		this.nodeDoneList = {};

		this.sourceConnectionMatrix = {};
		this.targetConnectionMatrix = {};
		this.connectionMatrix = {};

		this.topPostions = {};
		this.connectedNodesLayout = {};

		this.initialized = false;
	}
}


sap.landvisz.internal.Connection.getBoxViewConnectedNodesLayout = function (connections) {
	
	
	
	

	var firstLevelEntities = {};
	var thirdLevelEntities = [];
	var connectedNodesLayout = {};
	 
	if(connections.length > 0){
         this.allConnections = connections;
         
	for (var i = 0; i < this.allConnections.length; i++) {
		var existInFirstLevel = false;
		for (var key in firstLevelEntities) {
			if (this.allConnections[i].getSource() == key) {
				existInFirstLevel = true;
				break;
			}
		}

		if (!existInFirstLevel) {
			firstLevelEntities[this.allConnections[i].getSource()] = {};
		}
	}

	for (var key in firstLevelEntities) {
		var secondLevelEntities = [];

		for (var j = 0; j < this.allConnections.length; j++) {
			if (key == this.allConnections[j].getSource()) {
				var firstLevelEntity = [];

				for (var k = 0; k < this.allConnections.length; k++) {
					if (this.allConnections[j].getTarget() == this.allConnections[k].getTarget())
						firstLevelEntity.push(this.allConnections[k].getSource());
				}

				var systemObject = {};

				if (firstLevelEntity.length > 1) {
					if (thirdLevelEntities.length > 0) {
						var existInThirdLevel = false;
						for (var i = 0; i < thirdLevelEntities.length; i++) {
							for (var entityId in thirdLevelEntities[i]) {
								if (this.allConnections[j].getTarget() == entityId) {
									existInThirdLevel = true;
								}
							}

							if (existInThirdLevel){
								break;
							}
						}
						if (!existInThirdLevel) {
							systemObject[this.allConnections[j].getTarget()] = firstLevelEntity;
							thirdLevelEntities.push(systemObject);
						}
					} else {
						systemObject[this.allConnections[j].getTarget()] = firstLevelEntity;
						thirdLevelEntities.push(systemObject);
					}
				} else {
					systemObject[this.allConnections[j].getTarget()] = {};
					secondLevelEntities.push(systemObject);
				}
			}
		}
		firstLevelEntities[key].secondLevelEntities = secondLevelEntities;
	}

	connectedNodesLayout.maxColumnCount = 0;
	for (var key in firstLevelEntities) {
		var secondLevelEntities = firstLevelEntities[key].secondLevelEntities;
		connectedNodesLayout[key] = {};
		connectedNodesLayout[key].row = this.initialRow;
		connectedNodesLayout[key].col = this.initialCol;
		connectedNodesLayout[key].colspan = secondLevelEntities.length > 0 ? secondLevelEntities.length : 1;

		for (var i = 0; i < secondLevelEntities.length; i++) {
			for (var entityId in secondLevelEntities[i]) {
				connectedNodesLayout[entityId] = {};
				connectedNodesLayout[entityId].row = this.initialRow + 1;
				connectedNodesLayout[entityId].col = this.initialCol + i;
			}
		}

		this.initialCol += connectedNodesLayout[key].colspan;
	}

	connectedNodesLayout.thirdLevelEntitiesCount = thirdLevelEntities.length;
	for (var i = 0; i < thirdLevelEntities.length; i++) {

		for (var key in thirdLevelEntities[i]) {
			connectedNodesLayout[key] = {};
			connectedNodesLayout[key].row = this.initialRow + 2;
			connectedNodesLayout[key].col = 0;

			if (thirdLevelEntities[i][key].length == 2) {
				var firstColStart = connectedNodesLayout[thirdLevelEntities[i][key][0]].col;
				var firstColEnd = connectedNodesLayout[thirdLevelEntities[i][key][0]].col + connectedNodesLayout[thirdLevelEntities[i][key][0]].colspan - 1;
				var secondColStart = connectedNodesLayout[thirdLevelEntities[i][key][1]].col;
				var secondColEnd = connectedNodesLayout[thirdLevelEntities[i][key][1]].col + connectedNodesLayout[thirdLevelEntities[i][key][1]].colspan - 1;
				if (firstColStart < secondColStart) {
					connectedNodesLayout[key].col = (firstColEnd + secondColStart) / 2;
				} else {
					connectedNodesLayout[key].col = (secondColEnd + firstColStart) / 2;
				}
			} else {							
				for (var j = 0; j < thirdLevelEntities[i][key].length; j++) {
					var colEnd = connectedNodesLayout[thirdLevelEntities[i][key][j]].col + connectedNodesLayout[thirdLevelEntities[i][key][j]].colspan - 1;
					if (connectedNodesLayout[key].col < colEnd)
						connectedNodesLayout[key].col = colEnd;
				}
				connectedNodesLayout[key].col = connectedNodesLayout[key].col / 2;
			}

		}
	}
	
	connectedNodesLayout.maxColumnCount = this.initialCol;
}
	return connectedNodesLayout;

}; 


