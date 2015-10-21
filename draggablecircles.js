
var svgOptions ={
	width:500,
	height:500,
	margin:50
}


// //svg selector 
var svg = d3.select("body").append("svg")
.attr("width",svgOptions.width)
.attr("height",svgOptions.height)

data = [{name:'facecream',brand:'facial',description:'stuff you put on your face so it feels better'}]

svg.selectAll("circle").data(data,function(e,i){ return e.name})
	.enter()
	.append("circle")
	.attr('class','products')
	.attr('cx',function(d){d.x=200;return 200})
	.attr('cy',function(d){d.y = 200;return 200})
	.attr('r',function(d){return 25})
	.attr('fill',function(d){return 'blue'})
	.attr('opacity',function(d){return 1})
	.append('title')
	.text(function(d){return d.name +' '+d.brand+' '+d.description})

//initializes a new instance of the drag behavior.  
// bind this behavior to the call chain of other objects.  

  // var drag = d3.behavior.drag()
  //       .on("drag", function(d,i) {
  //           d.x += d3.event.dx
  //           d.y += d3.event.dy
  //           d3.select(this).attr("transform", function(d,i){
  //               return "translate(" + [ d.x,d.y ] + ")"
  //           })
  //       });
var drag = d3.behavior.drag()
    .on("drag", function(d,i) {
        // console.log(d.cx)
        // console.log(d.cy)
        // console.log(d)
        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this)
        .attr('cx',function(d){return d.x})
        .attr('cy',function(d){return d.y})
    });
    
d3.selectAll(".products").call(drag);