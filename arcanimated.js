 var chartValueStart = 0,
            chartValueEnd = Math.floor((Math.random() * 100) + 1),
            chartValueEnd = chartValueEnd < 40 ? chartValueEnd + 50 : chartValueEnd,  // ENTER RANDOM VALUE between 0 and 100 HERE
            outerRadius = 90,
            innerRadius = 80,
            cornerRadius = (outerRadius - innerRadius) / 2,
            totalRadian = 2 * Math.PI,
            totalPercentage = 100,
            sizeOfSmallCircles = 2, //size in radians
            numOfSmallCircles = Math.floor(totalPercentage / sizeOfSmallCircles);
        // the next three lines help to cover up remaining space,
        var remainderSpace = totalPercentage % sizeOfSmallCircles; // find the reminant space left after finding the number of small circles
        var remainderSpacePerCircle = remainderSpace / numOfSmallCircles; //share the remainder space left amongst all the small circles
        sizeOfSmallCircles += remainderSpacePerCircle; //add the portion of reminant apportioned to each small circle, in this case all small circle are same size
        /*positions*/
        var startAngle, endAngle;
        startAngle = endAngle = chartValueStart * (totalRadian / 100);

        var data1 = [{ startAngle, endAngle, color: "red" }];
        var data2 = [];
        var previousEndAngle = endAngle;
        var smallCircleLength = 1;

        // generate the arc data2 for the many small circles (arcs)
        while (numOfSmallCircles >= 1) {
            let newEndAngle = (sizeOfSmallCircles * (totalRadian / 100)) + previousEndAngle;

            if (numOfSmallCircles % 2 === 1) {
                let newData2Object = { startAngle: previousEndAngle, endAngle: newEndAngle, color: "green" };
                data2.push(newData2Object);
            }

            previousEndAngle = newEndAngle;

            smallCircleLength = newEndAngle - previousEndAngle;

            numOfSmallCircles--;
        }

        var arc1 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(function (d, i) { return d.startAngle; })
            .endAngle(function (d, i) { return d.endAngle; })
            .cornerRadius(cornerRadius)
            .padAngle(smallCircleLength);

        var arc2 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(function (d, i) { return d.startAngle; })
            .endAngle(function (d, i) { return d.endAngle; })
            .cornerRadius(cornerRadius)
            .padAngle(smallCircleLength);

        var d3Body = d3.select("body");

        var svg = d3Body.append("svg:svg")
            .attr("width", 420)
            .attr("height", 420).append("svg:g")
            .attr("transform", "translate(200,200)");

        var allPath = svg.selectAll("path");

        var plottedArcs2 = allPath.data(data2)
            .enter().append("svg:path")
            .style("fill", function (d, i) {
                return d.color;
            })
            .attr("d", arc2);

        var plottedArc1 = allPath
            .data(data1)
            .enter().append("svg:path")
            .style("fill", function (d, i) {
                return d.color;
            })
            .attr("d", arc1);

        var labelCircle = svg.append("circle")
            .style("fill", "orange")
            .attr("r", 16);

        var labelCircleText = svg
            .append("text")
            .attr("fill", "#ffffff")
            .attr("dx", -13)
            .attr("dy", 4)
            .style("font-size", "12px")
            .style("font-weight", "bold");

        plotLabel();

        svg
            .append("text")
            .attr("fill", "orange")
            .attr("dx", - outerRadius/2)
            .attr("dy", 25 + outerRadius)
            .text("Animated Arc")
            .style("font-size", "15px")
            .style("font-weight", "bold");

        svg.append("svg:image")
            .attr("xlink:href", "assets/d3js.png")
            .attr("width", "84")
            .attr("height", "14")
            .attr("x", -42);

        var intervalTime = 200;
        var interval = d3.interval(function (elapsed) {
            endAngle = chartValueStart * (totalRadian / 100);
            chartValueStart = elapsed / intervalTime + 1;

            arc1.endAngle(endAngle);
            plottedArc1.attr("d", arc1);

            arc2.endAngle(function (d) {
                return d.endAngle - (endAngle + 1);
            });
            arc2.startAngle(function (d) {
                return d.startAngle - (endAngle + 1);
            });
            plottedArcs2.attr("d", arc2);

            plotLabel();

            chartValueStart >= chartValueEnd && interval.stop();

        }, intervalTime);

        d3Body.style("background-color", "black");

        // Computes the midpoint [x, y] between the innerRadius and the outerRadius of the arc
        function outerCentroid() {
            var r = (+innerRadius + +outerRadius) / 2,
                a = (+endAngle) - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        }

        function plotLabel() {
            labelCircle
                .attr("cx", outerCentroid()[0])
                .attr("cy", outerCentroid()[1]);

            labelCircleText
                .attr("x", outerCentroid()[0])
                .attr("y", outerCentroid()[1])
                .text(function (d) { return Math.floor(chartValueStart) + "%"; });
        }