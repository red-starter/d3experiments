// ***************** CONFIG TABLE ********************
var createConfigTable = function(config,size,width){
	var config_table = []
	var height = 50;
	var y = margin.top
	var offset = 0;
	for (var i = 0; i < config.length; i++) {
		offset+=10
		config_table.push({
			value:config[i],
			x:i*width+offset,
			y:y,
			width:width,
			height:height,
			order:null
		})
	}
	return config_table;
};
// ************************ LABELS OF ROWS *************************
// create an array of label objects to which we append rect and text
var createLabels = function(tree_config,size,length,root){
	var pathY = returnYDFS(root)
	var labels = []
	for (var i = 1; i <pathY.length; i++) {
		var key = tree_config[i-1];
		var height = Math.sqrt(pathY.length-i)*size
		var y = pathY[i] 
		labels.push({
			x:width ,
			y:y,
			height:height,
			width:length,
			value:key || 'name',
			depth:labels.length+1
		})
	};
	return labels	
}

var buildLabeledRectangles = function(data,classed,fill){
	// build rectangles
	svg.selectAll(classed)
		.data(data)
		.enter()
		.append("rect")
		.classed(classed,true)
	    .attr("x", function(d) { return d.x-10})
		.attr("y", function(d) { return d.y-10})
		.attr("width", function(d) { return d.width})
		.attr("height", function(d) { return d.height})
		.attr("fill",fill||"#00C78C")
	// build text 
	svg.selectAll(classed)
		.data(data)
		.enter()
		.append("text")
		.classed(classed,true)
		.attr("x", function(d) { return d.x})
		.attr("y", function(d) { return d.y})
		.attr("dy", ".35em")
		.text(function(d) { return d.value})
}

var addHover = function(classed,opacity){
	opacity = opacity || 0.6
	svg.selectAll(classed)
		.on("mouseenter",function(d){
			d3.select(this).attr("opacity",0.7)
		})
		.on("mouseleave",function(d){
			d3.select(this).attr("opacity",1)
		})
}

var updateClassText = function(classed){
	var text = svg.selectAll('text'+classed)
	text.text(function(d){return d.order !== null && d.value + ' ' + d.order || d.value})				
}

var addOrder = function(classed,config_table){
	var data = svg.selectAll(classed)
	data.on('click',function(d){
		// console.log('click')
		if (d.order !== null){
			//removing from theconfig_table
			config_table.splice(d.order,1)
			// togle order off 
			d.order = null
			//update order of all other data in filerArr
			config_table.forEach(function(datum,index){
				datum.order = index;
			})
		} else {
			// not inconfig_table
			config_table.push(d)
			d.order =config_table.length -1
		}
		updateClassText(classed);
	})
}






