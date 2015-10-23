// ******************* VISUALIZE TREE ****************************
// with help from mbostock the master himself
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;

var i = 0,
    duration = 750

// moves the particles from a source to an end point
var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    // this makes a margin
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// not sure what this does
// d3.select(self.frameElement).style("height", "800px");

function update(source,tree,root) {
  // Compute the new tree layout, don't render root
  var nodes = tree.nodes(root).slice(1),
      links = tree.links(nodes);
  // the d3 tree class dynamically calculates new d.y d.x, so if want to make them
  // constant declare the x and y here
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

  // Stash the old positions for later transition.
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
  console.log(d3tree)
  update(d,d3tree,root);
}




