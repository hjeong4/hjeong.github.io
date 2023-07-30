d3.csv("data/ElectricCarData_Clean.csv").then(function (data) {
    renderRangeChart(data);
    renderNumberChart(data);
    renderEfficiencyChart(data);
});

const bodyStyleColor = d3.scaleOrdinal()
    .domain(["Sedan", "Hatchback", "Liftback", "SUV", "Pickup", "MPV", "Cabrio", "SPV"])
    .range(["red", "orange", "yellow", "green", "blue", "#fff2cc", "#fe7fd2", "purple"]);

function renderNumberChart(data) {
    var countMap = {}
    data.forEach((d) => {
        var brand = d.Brand.replace(/ /g, '');
        if (countMap.hasOwnProperty(brand)) {
            countMap[brand] += 1;
        } else {
            countMap[brand] = 1;
        }
    });

    var brands = Object.keys(countMap);
    var counts = Object.entries(countMap).map((c) => ( { "key": c[0], "value": c[1] }));
    console.log(counts)
    var brandPrice = d3.select("#chart-number-brand")
        .append("svg")
        .attr("width", 1600)
        .attr("height", 350)
        .append("g")
        .attr("transform", "translate(60,30)");
    
    var xScale = d3.scaleBand()
        .domain(brands)
        .range([0, 1500])
        .padding(0.3)
    brandPrice.append("g")
        .attr("transform", "translate(0,300)")
        .call(d3.axisBottom(xScale));
    
    var yScale = d3.scaleLinear()
        .domain([0, 15])
        .range([300, 0]);
    brandPrice.append("g")
        .call(d3.axisLeft(yScale));

    brandPrice.append("g")
        .selectAll("rect")
        .data(counts, function (d) { return d[1]; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return xScale(d.key); })
        .attr("y", function (d) { return yScale(d.value); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return 300 - yScale(d.value); })
        .style("fill", "blue")
}

function renderEfficiencyChart(data) {    
    /**
     * Efficiency Price Chart
     */
    var effPriceTooltip = d3.select("#chart-eff-price")
        .append("div")
        .attr("class", "tooltip")
    
    var effPriceMouseover = (event, d) => {
        effPriceTooltip.style("opacity", 1)
    }
    var effPriceMousemove = (event ,d) => {
        effPriceTooltip.html(`${d.Brand} - ${d.Model}`)
            .style("padding-left", "300px");
    }
    var effPriceMouseleave = (event, d) => {
        effPriceTooltip.transition().duration(500)
    }
    const effPriceAnnotation = [{
        note: { label: "All-Solar Electric Vehicle" },
        x: 10,
        y: 120,
        dx: 50,
        dy: -70
    }];
    var effPriceAnnotations = d3.annotation()
        .annotations(effPriceAnnotation);
    
    var efficiencyPrice = d3.select("#chart-eff-price")
        .append("svg")
        .attr("width", 700)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(80,30)")
        .style("padding-left", "10px")

    var xScale = d3.scaleLinear()
        .domain([100, 300])
        .range([0, 500]);
    efficiencyPrice.append("g")
        .attr("transform", "translate(0, 300)")
        .call(d3.axisBottom(xScale));
    efficiencyPrice.append("text")
        .attr("text-anchor", "end")
        .attr("x", 600)
        .attr("y", 350)
        .text("Efficiency (Wh/km)")

    var yScale = d3.scaleLinear()
        .domain([20000, 240000])
        .range([300, 0]);
    efficiencyPrice.append("g")
        .call(d3.axisLeft(yScale));
    efficiencyPrice.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -55)
        .attr("x", 30)
        .text("Price (euro)")

    efficiencyPrice.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return xScale(d.Efficiency_WhKm); })
        .attr("cy", function (d) { return yScale(d.PriceEuro); })
        .attr("r", 4)
        .style("fill", function (d) { return bodyStyleColor(d.BodyStyle); })
        .on("mouseover", effPriceMouseover)
        .on("mousemove", effPriceMousemove)
        .on("mouseleave", effPriceMouseleave)
    efficiencyPrice.append("g").call(effPriceAnnotations)

    /**
     * Efficiency vs TopSpeed Chart
     */
    var effTopSpeedTooltip = d3.select('#chart-eff-topSpeed')
        .append("div")
        .attr("class", "tooltip");
    var effTopSpeedMouseover = (event, d) => {
        effTopSpeedTooltip.style("opacity", 1);
    };
    var effTopSpeedMousemove = (event, d) => {
        effTopSpeedTooltip.html(`${d.Brand} - ${d.Model}`)
            .style("padding-left", "300px")
    };
    var effTopSpeedMouseleave = (event, d) => {
        effTopSpeedTooltip.transition().duration(500)
    };
    const effTopSpeedAnnotation = [{
        note: { label: "Tesla Roadster with top speed of 410 km/h" },
        x: 270,
        y: 10,
        dx: 40,
        dy: 50
    }];
    var effTopSpeedAnnotations = d3.annotation()
        .annotations(effTopSpeedAnnotation)

    var efficiencyTopSpeed = d3.select("#chart-eff-topSpeed")
        .append("svg")
        .attr("width", 700)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(60,30)")
    
    var xScale = d3.scaleLinear()
        .domain([100, 300])
        .range([0, 500]);
    efficiencyTopSpeed.append("g")
        .attr("transform", "translate(0,300)")
        .call(d3.axisBottom(xScale));
    efficiencyTopSpeed.append("text")
        .attr("text-anchor", "end")
        .attr("x", 600)
        .attr("y", 350)
        .text("Efficiency (Wh/km)")
    
    var yScale = d3.scaleLinear()
        .domain([100, 420])
        .range([300, 0]);
    efficiencyTopSpeed.append("g")
        .call(d3.axisLeft(yScale));
    efficiencyTopSpeed.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 30)
        .text("TopSpeed (km/h)")

    efficiencyTopSpeed.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return xScale(d.Efficiency_WhKm); })
        .attr("cy", function (d) { return yScale(d.TopSpeed_KmH); })
        .attr("r", 4)
        .style("fill", function (d) { return bodyStyleColor(d.BodyStyle); })
        .on("mouseover", effTopSpeedMouseover)
        .on("mousemove", effTopSpeedMousemove)
        .on("mouseleave", effTopSpeedMouseleave)
    efficiencyTopSpeed.append("g").call(effTopSpeedAnnotations)

    /**
     * Mouse eventlistener
     */
    document.getElementById("BodyTypeColorsEff").addEventListener('change', function(e) {
        efficiencyPrice.selectAll("circle")
            .data(data)
            .style("fill", function (d) { 
                if (e.target.value == 'sedan' && d.BodyStyle == 'Sedan') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'hatchback' && d.BodyStyle == 'Hatchback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'liftback' && d.BodyStyle == 'Liftback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'suv' && d.BodyStyle == 'SUV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'pickup' && d.BodyStyle == 'Pickup') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'mpv' && d.BodyStyle == 'MPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'cabrio' && d.BodyStyle == 'Cabrio') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'spv' && d.BodyStyle == 'SPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'all') {
                    return bodyStyleColor(d.BodyStyle);
                }
            });
        efficiencyTopSpeed.selectAll("circle")
            .data(data)
            .style("fill", function (d) { 
                if (e.target.value == 'sedan' && d.BodyStyle == 'Sedan') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'hatchback' && d.BodyStyle == 'Hatchback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'liftback' && d.BodyStyle == 'Liftback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'suv' && d.BodyStyle == 'SUV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'pickup' && d.BodyStyle == 'Pickup') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'mpv' && d.BodyStyle == 'MPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'cabrio' && d.BodyStyle == 'Cabrio') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'spv' && d.BodyStyle == 'SPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'all') {
                    return bodyStyleColor(d.BodyStyle);
                }
            });
    });
}

function renderRangeChart(data) {
    /**
     * Acceleration Range Chart
     */
    var accRangeToolip = d3.select("#chart-acc-range")
        .append("div")
        .attr("class", "tooltip");

    var accRangeMouseover = function (event, d) { 
        accRangeToolip.style("opacity", 1)
    }
    var accRangeMousemove = function (event, d) {
        accRangeToolip.html(`${d.Brand} - ${d.Model}`)
            .style("padding-left", '300px')
    }
    var accRangeMouseleave = function (event, d) {
        accRangeToolip.transition()
            .duration(500)
    }

    const accRangeAnnotation = [{
            note: { label: "More Acceleration, Less Range" },
            x: 200,
            y: 150,
            dx: 50,
            dy: -70
    }]
    var accRangeAnnotations = d3.annotation()
        .annotations(accRangeAnnotation);

    var accRangeSvg = d3.select("#chart-acc-range")
        .append("svg")
        .attr("width", 700)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(60, 30)");

    var x1 = d3.scaleLinear()
        .domain([0,30])
        .range([0, 500]);
    accRangeSvg.append("g")
        .attr("transform", "translate(0, 300)")
        .call(d3.axisBottom(x1));
    accRangeSvg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 600)
        .attr("y", 350)
        .text("Acceleration (sec)")

    var y1 = d3.scaleLinear()
        .domain([0,1000])
        .range([300, 0]);
    accRangeSvg.append("g")
        .call(d3.axisLeft(y1));
    accRangeSvg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 30)
        .text("Range (km)")

    accRangeSvg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.AccelSec); })
        .attr("cy", function (d) { return y1(d.Range_Km); })
        .style("fill", function (d) { return bodyStyleColor(d.BodyStyle)})
        .attr("r", 4)
        .on("mouseover", accRangeMouseover)
        .on("mousemove", accRangeMousemove)
        .on("mouseleave", accRangeMouseleave);

    accRangeSvg.append("g").call(accRangeAnnotations)

    /**
     *  Prive Range Chart
     */
    var priceRangeToolip = d3.select("#chart-price-range")
        .append("div")
        .attr("class", "tooltip");
    var priceRangeMouseover = (event, d) => { 
        priceRangeToolip.style("opacity", 1)
    }
    var priceRangeMousemove = (event, d) => {
        priceRangeToolip.html(`${d.Brand} - ${d.Model}`)
            .style("padding-left", '300px')
    }
    var priceRangeMouseleave = (event, d) => {
        priceRangeToolip.transition()
            .duration(500)
    }
    const priceRangeAnotation = [{
        note: { label: "Generally, more expensive EVs have more ranges" },
        x:200,
        y:150,
        dx:50,
        dy:-70
    }]
    var priceRangeAnnotations = d3.annotation()
        .annotations(priceRangeAnotation)

    var priceRangeSvg = d3.select("#chart-price-range")
        .append("svg")
        .attr("width", 700)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(60, 30)");

    var x2 = d3.scaleLinear()
        .domain([20000,240000])
        .range([0, 500]);
    priceRangeSvg.append("g")
        .attr("transform", "translate(0, 300)")
        .call(d3.axisBottom(x2));
    priceRangeSvg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 350)
        .text("Price (euro)");

    var y2 = d3.scaleLinear()
        .domain([0,1000])
        .range([300, 0]);
    priceRangeSvg.append("g")
        .call(d3.axisLeft(y2));
    priceRangeSvg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 30)
        .text("Range (km)")

    priceRangeSvg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x2(d.PriceEuro); })
        .attr("cy", function (d) { return y2(d.Range_Km); })
        .style("fill", function (d) { return bodyStyleColor(d.BodyStyle)})
        .attr("r", 4)
        .on("mouseover", priceRangeMouseover)
        .on("mousemove", priceRangeMousemove)
        .on("mouseleave", priceRangeMouseleave)

    priceRangeSvg.append("g").call(priceRangeAnnotations)

    /**
     * Mouse Eventlistender
     */
    document.getElementById('BodyTypeColors').addEventListener('change', function(e) {
        accRangeSvg.selectAll("circle")
            .data(data)
            .style("fill", function (d) { 
                if (e.target.value == 'sedan' && d.BodyStyle == 'Sedan') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'hatchback' && d.BodyStyle == 'Hatchback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'liftback' && d.BodyStyle == 'Liftback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'suv' && d.BodyStyle == 'SUV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'pickup' && d.BodyStyle == 'Pickup') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'mpv' && d.BodyStyle == 'MPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'cabrio' && d.BodyStyle == 'Cabrio') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'spv' && d.BodyStyle == 'SPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'all') {
                    return bodyStyleColor(d.BodyStyle);
                }
            });
        priceRangeSvg.selectAll("circle")
            .data(data)
            .style("fill", function (d) { 
                if (e.target.value == 'sedan' && d.BodyStyle == 'Sedan') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'hatchback' && d.BodyStyle == 'Hatchback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'liftback' && d.BodyStyle == 'Liftback') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'suv' && d.BodyStyle == 'SUV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'pickup' && d.BodyStyle == 'Pickup') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'mpv' && d.BodyStyle == 'MPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'cabrio' && d.BodyStyle == 'Cabrio') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'spv' && d.BodyStyle == 'SPV') {
                    return bodyStyleColor(d.BodyStyle);
                } else if (e.target.value == 'all') {
                    return bodyStyleColor(d.BodyStyle);
                }
            })
    });
}

