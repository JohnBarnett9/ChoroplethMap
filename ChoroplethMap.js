var width = 1200;
var height = 700;

var svg =
d3.select("#root")
.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", "background-color: lightblue;");

//console.dir(svg);
//console.dir(d3);


var path = d3.geoPath();

d3.json("counties.json")
.then(function(data){
	var dataset = data;
	//console.dir(dataset);

	//.data(topojson.feature(dataset, dataset.objects.states).features) //states
	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(dataset, dataset.objects.counties).features) //works
	.enter()
	.append("path")
	.attr("d", path);
});

















