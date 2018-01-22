var height = 600;
var width = 600;

var attributes = [
    "petal_width",
    "petal_length",
    "sepal_width",
    "sepal_length",
];

var cnt = attributes.length;

var axes_padding = height / 10;
var w = (height - axes_padding) / cnt;
var h = (width - axes_padding) / cnt;
var padding = w / 20;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("iris.csv", function(dataset) {
    //console.log(dataset);
    for (var i = 0; i < cnt; i++) {
        for (var j = 0; j < cnt; j++) {
            if (i != j) {
                displayScatterplot(dataset, i , j);
            } else {
                displayHistogramm(dataset, i);
            }

            if (i == 0 || j == 0) {
                displayAxis(dataset, i , j);
            }
        }
    }

    displayAxisLabels();
})

function displayScatterplot(dataset, i, j) {

    var origin_x = w * i + axes_padding;
    var origin_y = height - (h * j) - axes_padding;

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[attributes[i]]; })])
        .range([origin_x + padding, origin_x + w - padding]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[attributes[j]]; })])
        .range([origin_y - padding, origin_y - h + padding]);

    svg.append("rect")
        .attr("x" , origin_x + padding - 2)
        .attr("y", origin_y - h + padding - 2)
        .attr("width", w - 2 * padding + 4)
        .attr("height", h - 2 * padding + 4)
        .attr("fill", "none")
        .attr("style", "stroke-width:0.3;stroke:rgb(150,150,150)");

    svg.selectAll(".point"+i+"-"+j)
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "point"+i+"-"+j)
        .attr("cx", function(d) {
                return xScale(d[attributes[i]]);
            })
        .attr("cy", function(d) {
                return yScale(d[attributes[j]]);
            })
        .attr("r", 2)
        .attr("opacity", "0.6")
        .attr("fill", function (d) {
            if (d.species == "setosa") {
                return "blue";
            } else if (d.species == "virginica") {
                return "red";
            } else {
                return "green";
            }
        });
}

function displayHistogramm(dataset, i) {

    var origin_x = w * i + axes_padding;
    var origin_y = height - (h * i) - axes_padding;

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[attributes[i]]; })])
        .range([origin_x + padding, origin_x + w - padding]);

    svg.append("rect")
        .attr("x" , origin_x + padding - 2)
        .attr("y", origin_y - h + padding - 2)
        .attr("width", w - 2 * padding + 4)
        .attr("height", h - 2 * padding + 4)
        .attr("fill", "none")
        .attr("style", "stroke-width:0.3;stroke:rgb(150,150,150)");

    var histogram_dataset = [];

    for (var k = 0; k < dataset.length; k++) {
        histogram_dataset.push(+dataset[k][attributes[i]])
    }

    var histogram = d3.layout.histogram()
        .bins(xScale.ticks(20))
        (histogram_dataset);

    //console.log(histogram);

    var yMax = d3.max(histogram, function(d){return d.y});
    var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([origin_y - padding, origin_y - h + padding]);

    var bar = svg.selectAll(".bar"+i)
        .data(histogram)
        .enter()
        .append("rect")
        .attr("class", "bar"+i)
        .attr("x", function(d) {
            return xScale(d.x);
        })
        .attr("y", function(d) {
            return yScale(d.y);
        })
        .attr("width", xScale(histogram[1].x) - xScale(histogram[0].x))
        .attr("height", function(d) {
            return yScale(0) - yScale(d.y)
            })
        .attr("opacity", 0.7)
        .attr("fill", "black");
}

function displayAxis(dataset, i , j) {

    var origin_x = w * i + axes_padding;
    var origin_y = height - (h * j) - axes_padding;

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[attributes[i]]; })])
        .range([origin_x + padding, origin_x + w - padding]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[attributes[j]]; })])
        .range([origin_y - padding, origin_y - h + padding]);

    if (i == 0) {
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (axes_padding + 4)+ "," + 0 + ")")
            .call(yAxis);
    }

    if (j == 0) {
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + "," + ((cnt * h) - 4) + ")")
            .call(xAxis);
    }
}

function displayAxisLabels() {
    for (var i = 0; i < cnt; i++) {
        svg.append("text")
            .attr("x", (axes_padding + i * w + w/2))
            .attr("y", height - 40)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .text(attributes[i]);

            svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height + i * h + axes_padding + h / 2)
            .attr("y", 10)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .text(attributes[i]);
    }
}