jQuery.sap.declare("sap.landvisz.libs.lvsvg");

sap.landvisz.libs.lvsvg = function(){
};


sap.landvisz.libs.lvsvg.getSVG = function(w,h,id){
	
	jQuery.sap.require("sap.ui.thirdparty.d3");
	
	var viewerSVG = d3.select('#'+id)
	.append("svg")
	.attr("width", w)
	.attr("height", h);

	return viewerSVG;
}

sap.landvisz.libs.lvsvg.convertHtmltoCanvas = function(container,navigator){
	
	html2canvas(container, {
		allowTaint : true,
		useCORS: true,
		onrendered : function(canvas) {							
			navigator.show(1000);
			
			navigator.css({
				'background-image' : "url(" + canvas.toDataURL("image/png") + ")",
				'background-size' : "100% 100%"
			});
		}
	});
}
