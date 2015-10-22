// info from get request --> photo use stock kittens website and fakerjs, 
// product_name, brand_name, tags,number of people who own it, category, status ->owned/finished/wish/expired
// size --> travel/full , photo , personal_notes -->280 characters
// 

// ***************** DATA PROCESSING AND TREE GENERATION ******************
// build hash tables  to get access to different properties insta 
// get inputs in, dynamically build tree based on specified user inputs i.e. BRAND -> CATEGORY -> PRODUCT
// or STATUS -> BRAND -> PRODUCT , or BRAND -> PRODUCT //product always last by default
// so status is own tree
// after tree is built, toggle all children off , except 
// the default children accessor assumes each input data is an object with a children array

// get parsed data from helper function
var data = JSON.parse(fakeData(20))
//build tree based on tree configuration, lets make default CATEGORY -> BRAND -> PRODUCT // last one is always product_name
// var tree_config = ['brand_name']
// var tree_config = ['brand_name','category','size','status']
// maybe price added
var config =  ['category','brand_name','status','size']
var tree_config = ['size','status','brand_name']

var Tree = function(obj){
	this.value = obj.value || null;
	this.products = obj.products || []
	this.type = obj.type || null;
	this.children = [];
}

//helper for grouping together an array of products based on a property 

//return array of all specified properties and concat them
var pluck = function(array,property){
	var properties = Array.prototype.slice.call(arguments,1)
	var res = [];
	array.forEach(function(object){
		var temp = [];
		properties.forEach(function(prop){
			res.push(temp.concat([object[prop]]))
		})
	})
	return res;
}

var groupByProperty = function(array,property){
	var store ={};
	array.forEach(function(product){
		var value = product[property]
		if (store[value] === undefined){
			store[value] = [product]
		} else {
			store[value].push(product);
		}
	})
	var resArr = [];
	for (var value in store){
		resArr.push({value:value,type:property,products:store[value]})
	}
	//resArr contain an array of objects, with value i.e. brand_name and children and array of products that have that value
	return resArr;
}

var populateTree = function(config,tree,index){
	index = index || 0;
	//base case, done iterating
	if (index > config.length -1) {
		//we are at end, append nodes by product_name
		for (var i = 0; i < tree.products.length; i++) {
			var product = tree.products[i]
			var newTree = new Tree({type:'product_name',value:product.product_name,products:[product]})
			tree.children.push(newTree)
		};
		return;
	}
	var property = config[index];
	//get array of objects grouped by their property value i.e. brand_names, statuses
	var resArr = groupByProperty(tree.products,property);
	//iterate over array and push each object keyed by property to tree children
	for (var i = 0; i < resArr.length; i++) {
		var obj = resArr[i];
		// console.log(obj)
		var newTree = new Tree(obj)
		tree.children.push(newTree)
	};
	for (var i = 0; i < tree.children.length; i++) {
		populateTree(config,tree.children[i],index+1)
	};

};

var root = new Tree({value:'root',products:data});
// modifies tree, with tree configuration
// tree now contains all required info
populateTree(tree_config,root)

// ******************* VISUALIZE TREE ****************************
// taken from  mbostock the master himself
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;

var i = 0,
    duration = 750

// specify here how big the tree will be
var tree = d3.layout.tree()
    .size([width-20,height]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    // this makes a margin
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// collapse tree initially except for root by toggleing between _.children and children
function collapse(d) {
	if (d.children) {
	  d._children = d.children;
	  d._children.forEach(collapse);
	  d.children = null;
	}
}

// width =200
root.x0 = (width + margin.right + margin.left)/2;
root.y0 = 0;
update(root)

d3.select(self.frameElement).style("height", "800px");

function update(source) {
  // Compute the new tree layout, ignore the root
  var nodes = tree.nodes(root).slice(1),
      links = tree.links(nodes);
  // the d3 tree class dynamically calculates new d.y d.x, so if want it constant just declare 
  // the x and y here
  nodes.forEach(function(d){
    if (d.depth === 0){
      d.y = 0
      d.x = (width + margin.right + margin.left)/2;
    } else if (d.depth === 1){
      d.y = 5*margin.top
    } else {
      d.y = Math.pow(d.depth,2/3) * 140
    }
  })
  //update nodes
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
  // Enter any new nodes at the parent's previous position. (so it can pan from there)
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," +  source.y0+ ")"; })
      .on("click", toggleChildren);

  // for every node append a circle at that place
  nodeEnter.append("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
      // add tooltip
		.append("svg:title")
          .text(function(d, i) { return JSON.stringify(d.products) });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      // .text(function(d) { return JSON.stringify(pluck(d.products,'product_name')) })
      .text(function(d) { return d.value })
      .attr("transform", function(d) { return "rotate(20)"; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y  + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," +  source.y+ ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);


  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function toggleChildren(d) {
  if (d.children) {  
    // when clicking collapse turn all kids off
    collapse(d)
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}