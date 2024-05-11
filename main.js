const margin = { top: 70, right: 40, bottom: 60, left: 175 };
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Creating SVG
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Loading CSV Data to D3
d3.csv("data.csv").then((data) => {
  //   Converting Total value from string to number
  data.forEach((d) => {
    d.total = +d.total;
  });

  data.sort((a, b) => {
    return d3.ascending(a.total, b.total);
  });

  // Setting X & Y Axis
  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.total)]);

  const y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(data.map((d) => d.bog_body_type));

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d.total))
    .attr("x", 0)
    .attr("y", (d) => y(d.bog_body_type))
    .attr("fill", "#96a5b9");

  // Creating Axis
  const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
  const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

  svg
    .selectAll("line")
    .data(x.ticks(5))
    .enter()
    .append("line")
    .attr("class", "vertical-grid")
    .attr("x1", (d) => x(d))
    .attr("y1", 0)
    .attr("x2", (d) => x(d))
    .attr("y2", height)
    .style("stroke", "gray")
    .style("stroke-width", 0.5)
    .style("stroke-dasharray", "3 3");

  svg
    .append("g")
    .attr("class", "x axis")
    .style("font-size", "10px")
    .attr("transform", `translate(${0},${height})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style("font-size", "8px")
    .selectAll("path")
    .style("stroke-width", "1.75px");

  svg.selectAll(".y.axis .tick text").text((d) => d.toUpperCase());

  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => x(d.total) + 5)
    .attr("y", (d) => y(d.bog_body_type) + y.bandwidth() / 2)
    .attr("dy", ".35em")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .style("fill", "#3c3d28")
    .text((d) => d.total);

  svg
    .append("text")
    .attr("transform", `translate(${width / 2},${height + margin.bottom / 2})`)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "black")
    .style("font-family", "sans-serif")
    .attr("dy", "1em")
    .text("Total");

  svg
    .append("text")
    .attr("x", margin.left - 335)
    .attr("y", margin.top - 110)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .text("Bog Memmies Are the Most Frequently Observed Preservation State");

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" +
        (margin.left - 335) +
        "," +
        (height + margin.bottom - 10) +
        ")"
    )
    .style("text-anchor", "start")
    .style("font-size", "8px")
    .style("fill", "lightgray")
    .style("font-family", "sans-serif")
    .html(
      "<a href='https://www.cambridge.org/core/journals/antiquity/article/bogs-bones-and-bodies-the-deposition-of-human-remains-in-northern-european-mires-9000-bcad-1900/B90A16A211894CB87906A7BCFC0B2FC7#supplementary-materials'>Source: Bogs, Bones and Bodies - Published by Cambridge Press</a>"
    );
});
