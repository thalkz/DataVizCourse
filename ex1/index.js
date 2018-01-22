var h = 600;
var w = 600;

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

d3.csv("iris.csv", function(dataset) {
    console.log(dataset);
    displayScatterplot(dataset);
    displayRegression(dataset);
})

function displayScatterplot(dataset) {

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d.petal_length; })])
        .range([w/10, 9*w/10]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d.petal_width; })])
        .range([9*h/10, h/10]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (9*h/10) + ")")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + w/10 + ",0)")
        .call(yAxis);

    svg.selectAll(".setosa")
        .data(dataset.filter(d => d.species == "setosa"))
        .enter()
        .append("circle")
        .attr("class", "setosa")
        .attr("cx", function(d) {
                return xScale(d.petal_length);
            })
        .attr("cy", function(d) {
                return yScale(d.petal_width);
            })
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "red");

    svg.selectAll(".versicolor")
        .data(dataset.filter(d => d.species == "versicolor"))
        .enter()
        .append("rect")
        .attr("class", "versicolor")
        .attr("x", function(d) {
                return xScale(d.petal_length) - 5;
            })
        .attr("y", function(d) {
                return yScale(d.petal_width) - 5;
            })
        .attr("height", 10)
        .attr("width", 10)
        .attr("stroke", "black")
        .attr("fill", "blue");

    svg.selectAll(".virginica")
        .data(dataset.filter(d => d.species == "virginica"))
        .enter()
        .append("path")
        .attr("class", "virginica")
        .attr("d", d3.svg.symbol().type("triangle-up"))
        .attr("transform", function(d) {
                return "translate(" + xScale(d.petal_length) + "," + yScale(d.petal_width) + ")"; 
                })
        .attr("fill", "green")
        .attr("stroke", "black");

    var args = displayRegression(dataset);

    var b0 = args[0];
    var b1 = args[1];

    svg.append("line")
            .attr("class", ".regression")
            .attr("x1", xScale(0))
            .attr("y1", yScale(b0))
            .attr("x2", xScale(10))
            .attr("y2", yScale(b0 + 10 * b1))
            .attr("style", "stroke:rgb(255,0,0);stroke-width:2");
}

function displayRegression(dataset) {

    var x = [];
    var y = [];
    var n = dataset.length;
    var x_mean = 0;
    var y_mean = 0;
    var term1 = 0;
    var term2 = 0;

    for (var i = 0; i < n; i++) {
        x.push(+dataset[i].petal_length);
        y.push(+dataset[i].petal_width);
        x_mean += x[i]
        y_mean += y[i]
    }

    // calculate mean_x and mean_y
    x_mean /= n;
    y_mean /= n;

    var xr = 0;
    var yr = 0;

    for (i = 0; i < x.length; i++) {
        xr = x[i] - x_mean;
        yr = y[i] - y_mean;
        term1 += xr * yr;
        term2 += xr * xr;

    }
    var b1 = term1 / term2;
    var b0 = y_mean - (b1 * x_mean);

    return [b0, b1];
}