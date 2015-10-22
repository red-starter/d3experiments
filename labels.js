// use same svg from productsview.js
// traverse down and get y-coordnates to achor rectangels to 

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

// ***************** TREE SEARCHES ************************
// helper to get y-coords from tree nodes
var returnYDFS = function(node,path){
	path = path || []
	path.push(node.y)
	if (!node.children){
		return path
	} 
	return returnYDFS(node.children[0],path)
}
// helper to toggle all nodes bfs
var toggleToDepthBFS = function(tree,depth){
	// go n-1 deep
	// root always toggle on
	// start at roots kids
	var curArr = [];
	var nextArr = tree.children;
	for (var i = 0; i < depth-1; i++) {
		curArr = nextArr;
		nextArr = [];
		console.log(curArr)
		// iterate through children and toggle them
		for (var j = 0; j < curArr.length; j++) {
			node = curArr[j];
			// console.log('collapsing',node.value)
			if (node._children){
				node.children = node._children
				node._children = null
			}
			// update(node)
			// push kids to next arr
			nextArr = nextArr.concat(node.children);
		};
	};
	// now have access to all nodes in the end, want untoggle if toggled
	for (var i = 0; i < nextArr.length; i++) {
		node = nextArr[i];
		if (node.children){
			node._children = node.children;
			node.children = null;
		}
		update(node)
	};
}

// ***************** LABELS OF ROWS ***********************
// create an array of lable objects to which we append rect and text
var createLabels = function(tree_config,size,length){
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

// var updateConfig = function(classed,filterOrder){
// 	// update order of the config table
// 	svg.selectAll(classed)
// 	.each(function(d){
// 		console.log(d)
// 		// d.order(filterOrder.indexOf(d.value))
// 	})
// 	.selectAll('text')
// 	.text(function(d) { return d.order && d.value + d.order || d.value});
// 	// now rerender the text
// }
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
	// console.log('clickes')
	var text = svg.selectAll('text'+classed)
	// var text = data.selectAll('text')
	// console.log(text)
	text.text(function(d){return d.order && d.value + d.order || d.value})				
}
var closureScopeStorage = function(){
	// store in a closure
	// here we dump the order of filtering from bottom up
	var filterArr = [];

	var addOrderEventListeners = function(classed){
		var data = svg.selectAll(classed)
	// change opacity on hover 

		data.on('click',function(d){
			console.log('click')
			if (d.order !== null){
				//removing from the filterArr
				filterArr.splice(d.order,1)
				// togle order off 
				d.order = null
				//update order of all other data in filerArr
				filterArr.forEach(function(datum,index){
					datum.order = index;
				})
			} else {
				// not in filterArr
				filterArr.push(d)
				d.order = filterArr.length -1
			}
			updateClassText(classed);
		})
	}
	return addOrderEventListeners	
}
addOrderEventListeners = closureScopeStorage()
// ************* FUNCTION CALLS FOR LABELS AND CONFIG TABLE
var labels = createLabels(tree_config,20,100);
var config_table = createConfigTable(config,20,100)
buildLabeledRectangles(labels,'label')
buildLabeledRectangles(config_table,'config','darksalmon')
addOrderEventListeners('.config')
addHover('.config')
addHover('.label')

svg.selectAll('.label')
.data(labels)
.on('click',function(d){
	toggleToDepthBFS(root,d.depth)
	update(root)
})





