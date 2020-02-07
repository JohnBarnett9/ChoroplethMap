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

//Color Legend
var x = d3.scaleLinear()
    //.domain([1, 10])
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);

//var color = d3.scaleThreshold()
var color = d3.scaleThreshold()
//var color = d3.scaleQuantize()
//.domain(d3.range(2, 10))
.domain(d3.range(0, 100, 10)) 
//.domain([0,10,20,30,40,50,60,70,80,90,100]) 
//.domain([0, 100])
.range(d3.schemeGreens[9]);
//.range(d3.schemeBlues[]);

//console.dir(d3.range(0, 100));
for(var i = 0; i < 100; i++){console.dir(color(i));}


var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });




var promises = [
	//d3.json("countiesSmall.json")
	d3.json("counties.json")
	,d3.json("for_user_education.json")
	//d3.json("for_user_education.json", function(d){
		//eduArray.push(d);
	//	console.dir(d);
	//})
];

Promise.all(promises).then(main);
/*
Promise.all(promises).then(values => {
	//console.dir(values);
	main(values);
});
*/



//function main([data]){
//function main([data, data2]){
function main(data){
	
	var dataset = data[0];
	var dataset2 = data[1];
	//console.log("dataset=");
	//console.dir(dataset);

	//console.log("dataset2=");
	//console.dir(dataset2);
	/**/

	/*
	var dataset = data;
	console.log("data=");
	console.dir(data);

	console.log("data2=");
	console.dir(data2);
	*/

	//.data(topojson.feature(dataset, dataset.objects.states).features) //states
	//console.log("eduArray=");
	//console.dir(eduArray);

	/*
	array of key value pairs of this format:
	fips value : bachelors number
	example:
	1001:21.9
	*/


	/*
	var countyIdToPercent = dataset2.map((element) => {
		//return element.fips : bachelorsOrHigher;
		return {element.fips:element.bachelorsOrHigher};
	});
	*/
	//var countyIdToPercent = {1:9,2:10};
	var countyIdToPercent = new Map;
	//countyIdToPercent.set(1001, 21.9);
	dataset2.map((element) => {
		countyIdToPercent.set(element.fips, element.bachelorsOrHigher);
	});

	/*
	console.log("countyIdToPercent=");
	console.dir(countyIdToPercent);
	for (let [key, value] of countyIdToPercent.entries()) {
	  console.log(key + ' = ' + value)
	}
	*/


	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(dataset, dataset.objects.counties).features) //works
	.enter()
	.append("path")
	.attr("fill", function(d){
		//console.log("d=");
		//console.dir(d);
		var temp = countyIdToPercent.get(d.id);
		//console.dir(temp, color(temp));
		//return color(countyIdToPercent.get(d.id));
		return color(temp);
		//console.dir(dataset2.bachelorsOrHigher);

	})
	.attr("d", path);
};

















