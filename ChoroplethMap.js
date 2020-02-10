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

/*
legend ticks
tickSize is length of tick mark
tickFormat(x, i), x is value, i is index
*/
var legendTicks = d3.axisBottom(x)
.tickSize(20)
.tickValues([0,10,20,30,40,50,60,70,80])
.tickFormat(function(x, i){
	return x + "%";
})
;


legend
.call(legendTicks);

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

	//construct Map of key value pairs
	//id of county and %
	var countyIdToCountyInfo = new Map;
	dataset2.map((element) => {
		/*
		countyIdToCountyInfo.set(element.fips, {
				"state" : element.state, 
				"area_name" : element.area_name, 
				"percent" : element.bachelorsOrHigher
			});
		*/
		countyIdToCountyInfo.set(element.fips,element);

	});
	console.dir(countyIdToCountyInfo.get(1001));
	/*
	for (let [key, value] of countyIdToCountyInfo.entries()) {
		console.log(key + ' = ');
		console.dir(value);
	}
	*/

	/*
	counties
	style stroke is white outline around each county
	style stroke-width makes white outline be thin
	*/
	/**/
	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(dataset, dataset.objects.counties).features) //works
	.enter()
	.append("path")
	.style("stroke", "#fff")
	.style("stroke-width", ".1")
	.attr("fill", function(d){
		//go from id to %
		var percentOfAdults = countyIdToCountyInfo.get(d.id).bachelorsOrHigher;
		return color(percentOfAdults);
	})
	.attr("d", path)
	.on("mouseover", function(d){
		var tooltipDiv = d3.select("#myTooltip");
		tooltipDiv.transition()
		.duration(100)
		.style("opacity", .8);

		//go from id to County Name, State, %
		//console.dir(d);
		var countyInfo = countyIdToCountyInfo.get(d.id);
		var tooltipData = 
		countyInfo.area_name + ", " + countyInfo.state
		+ " " + countyInfo.bachelorsOrHigher + "%";

		tooltipDiv.html(tooltipData)
		.style("left", d3.event.pageX + "px")
		.style("top", d3.event.pageY + "px");
	});
	
	

	/*outline around states*/
	/**/
	svg
	.append("path")
	.datum(topojson.mesh(dataset, dataset.objects.states, function(a, b) { return a !== b; }))
	.attr("fill", "none")
	.attr("stroke", "white")
	.attr("stroke-linejoin", "round")
	.attr("d", path);

};

//tooltip
var tooltipDiv = d3.select("body")
.append("div")
.attr("id", "myTooltip")
.style("opacity", 1);
