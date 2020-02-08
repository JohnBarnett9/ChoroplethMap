var width = 1200;
var height = 700;

var svg =
d3.select("#root")
.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", "background-color: lightblue;");

var path = d3.geoPath();

/*
Color Legend
Min percent is 2.6.
Max percent is 75.1.
*/
var x = d3.scaleLinear()
//.domain([2.6, 75.1])
.domain([0,80])
.rangeRound([600, 860]);

/*
d3.range() generates array from 0 to 100 every step is 10
.domain(d3.range(0, 100, 10)) 
*/
var color = d3.scaleThreshold()
.domain(d3.range(0, 100, 10)) 
.range(d3.schemeGreens[9]);

/* legend is color percent description */
var legend = svg.append("g")
.attr("transform", "translate(230, 400)");


//legend
svg
.append("text")
//.text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")
.text("% adults age >= 25 with bachelor's degree or higher (2010-2014)")
.attr("font-size", "10px")
.attr("transform", "translate(830, 390)");

/*
function(d), d is hex color
color.invertExtent(d);, input is hex color, output is corresponding array of domain values
*/
legend
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
.attr("height", 20)
.attr("x", function(d) {
	return x(d[0]);
})
.attr("width", function(d) {
	return x(d[1]) - x(d[0]);
})
.attr("fill", function(d) {
	return color(d[0]);
});



console.dir(color.domain());

/*
legend ticks
tickSize is length of tick mark
tickFormat(x, i), x is value, i is index
*/
var legendTicks = d3.axisBottom(x)
.tickSize(20)
.tickValues([0,10,20,30,40,50,60,70,80])
.tickFormat(function(x, i){
	console.dir("x=");
	console.dir(x);
	console.dir("i=");
	console.dir(i);
	return x + "%";
})
;


legend
.call(legendTicks);
//.append(legendTicks);

//legend.attr("transform", "translate(230, 400)");

//Title of Map
svg
.append("text")
.attr("x", 400)
.attr("y", 40)
.style("font-size", "20px")
.text("United States Educational Attainment");


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

	/*
	counties
	style stroke is white outline around each county
	style stroke-width makes white outline be thin
	*/
	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(dataset, dataset.objects.counties).features) //works
	.enter()
	.append("path")
	.style("stroke", "#fff")
	.style("stroke-width", ".1")
	.attr("fill", function(d){
		var temp = countyIdToPercent.get(d.id);
		return color(temp);
	})
	.attr("d", path);
	

	/*outline around states*/
	svg
	.append("path")
	.datum(topojson.mesh(dataset, dataset.objects.states, function(a, b) { return a !== b; }))
	.attr("fill", "none")
	.attr("stroke", "white")
	.attr("stroke-linejoin", "round")
	.attr("d", path);

};
