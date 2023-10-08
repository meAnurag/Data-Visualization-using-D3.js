import { useEffect, useRef } from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import * as d3 from "d3";

const CountryChart = ({ data }) => {
  const svg = useRef();

  const barHeight = 40;
  const marginTop = 30;
  const marginRight = 20;
  const marginBottom = 0;
  const marginLeft = 130;
  const width = 1028;
  const height = Math.ceil(15.1 * barHeight) + marginTop + marginBottom;

  useEffect(() => {
    const createGraph = () => {
      if (!data || svg.current) return;

      svg.current = d3
        .select("#country_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    };
    createGraph();
  }, [data]);

  useEffect(() => {
    if (!data || !svg.current) return;

    const updateData = () => {
      let countryTemp = {};
      let total = 0;
      let maxCount = 0;

      data.forEach(({ country }) => {
        if (country && country !== "") {
          total++;
          countryTemp = {
            ...countryTemp,
            [country]: countryTemp[country] ? countryTemp[country] + 1 : 1,
          };
        }
      });

      const countryDist = Object.keys(countryTemp).map((country) => {
        maxCount =
          maxCount > countryTemp[country] ? maxCount : countryTemp[country];

        return {
          name: country,
          percentage: (countryTemp[country] / total) * 100,
          count: countryTemp[country],
        };
      });

      countryDist.sort((a, b) => b.percentage - a.percentage);

      countryDist.length = countryDist.length > 15 ? 15 : countryDist.length;

      console.log(countryDist);

      svg.current
        .selectAll("g")
        .transition()
        .duration(600)
        .style("transform", "translateX(1000px)")
        .style("opacity", 0)
        .remove();

      const x = d3
        .scaleLinear()
        .domain([0, maxCount + 5])
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleBand()
        .domain(d3.sort(countryDist, (d) => -d.count).map((d) => d.name))
        .rangeRound([marginTop, height - marginBottom])
        .padding(0.1);

      // Create the SVG container.

      const u = svg.current
        .append("g")
        .attr("fill", "steelblue")
        .selectAll()
        .data(countryDist)
        .join("rect");

      u.enter()
        .merge(u)
        .attr("rx", 5)
        .attr("x", x(0))
        .attr("y", (d) => y(d.name))
        .attr("height", y.bandwidth())
        .transition()
        .duration(800)
        .attr("width", (d) => x(d.count) - x(0));

      // Append a label for each letter.
      svg.current
        .append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .selectAll()
        .data(countryDist)
        .join("text")
        .attr("x", (d) => x(d.count))
        .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text((d) => `${d.percentage.toFixed(2)}% (${d.count})`)
        .call((text) =>
          text
            .filter((d) => x(d.count) - x(0) < 50) // short bars
            .attr("dx", +4)
            .attr("text-anchor", "start")
        );

      // Create the axes.
      svg.current
        .append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(d3.axisTop(x));

      svg.current
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0));
    };
    updateData();
  }, [data]);

  return (
    <Flex
      p={2}
      paddingBlock={10}
      marginBlock={5}
      marginInline={2}
      border="1px"
      borderRadius="8px"
      marginTop="5px"
      id="country_chart"
      width="100%"
      direction="column"
      align="center"
    >
      <Box>
        <Heading size="md">Country Distribution</Heading>
      </Box>
    </Flex>
  );
};

export default CountryChart;
