var width = 1200;
var height = 700;

var svg =
d3.select("#root")
.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", "background-color: lightblue;");

var path = d3.geoPath();

//Color Legend
var x = d3.scaleLinear()
//.domain([1, 10])
.domain([2.6, 75.1])
.rangeRound([600, 860]);

/*
d3.range() generates array from 0 to 100 every step is 10
.domain(d3.range(0, 100, 10)) 
*/
var color = d3.scaleThreshold()
.domain(d3.range(0, 100, 10)) 
.range(d3.schemeGreens[9]);

var g = svg.append("g")
.attr("class", "key")
.attr("transform", "translate(0,40)");

/*
function(d), d is hex color
color.invertExtent(d);, input is hex color, output is corresponding array of domain values
*/
g
.selectAll("rect")
.data(color.range().map(function(d) {
	d = color.invertExtent(d);
	if (d[0] == null){
		d[0] = x.domain()[0];
	}
	if (d[1] == null){
		d[1] = x.domain()[1];
	}
	return d;
}))
.enter()
.append("rect")
.attr("height", 8)
.attr("x", function(d) {
	return x(d[0]);
})
.attr("width", function(d) {
	return x(d[1]) - x(d[0]);
})
.attr("fill", function(d) {
	return color(d[0]);
});

var promises = [
	//d3.json("countiesSmall.json")
	d3.json("counties.json")
	,d3.json("for_user_education.json")
];

Promise.all(promises).then(main);

function main(data){	
	var dataset = data[0];
	var dataset2 = data[1];

	var countyIdToPercent = new Map;
	dataset2.map((element) => {
		countyIdToPercent.set(element.fips, element.bachelorsOrHigher);
	});


	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(dataset, dataset.objects.counties).features) //works
	.enter()
	.append("path")
	.attr("fill", function(d){
		var temp = countyIdToPercent.get(d.id);
		return color(temp);
	})
	.attr("d", path);
};
