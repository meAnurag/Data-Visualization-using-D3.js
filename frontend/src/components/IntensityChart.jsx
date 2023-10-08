import { useEffect } from "react";
import { Box, Center, Heading } from "@chakra-ui/react";
import * as d3 from "d3";

const IntensityChart = ({ data }) => {
  const createGraph = () => {
    if (!data) return;

    const formattedData = [];

    data.forEach(({ published, intensity }) => {
      if (published && intensity)
        formattedData.push([new Date(published).getFullYear(), intensity]);
    });

    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#intensitybox")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},     ${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const minYear = d3.min(formattedData, (d) => d[0]);
    const maxYear = d3.max(formattedData, (d) => d[0]);

    x.domain([minYear, maxYear]);

    y.domain([
      0,
      d3.max(formattedData, (d) => {
        return d[1];
      }),
    ]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(maxYear - minYear)
          .tickFormat(d3.format("d"))
      );

    svg.append("g").call(d3.axisLeft(y));

    const valueLine = d3
      .line()
      .x((d) => {
        return x(d[0]);
      })
      .y((d) => {
        return y(d[1]);
      });

    svg
      .append("path")
      .data([formattedData])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3.5)
      .attr("d", valueLine);
  };

  useEffect(() => {
    createGraph();
  });

  return (
    <Center>
      <Box
        p={2}
        border="1px"
        borderRadius="6px"
        marginTop="5px"
        width="95%"
        id="intensitybox"
      >
        <Heading size="md">Intensity over years.</Heading>
      </Box>
    </Center>
  );
};

export default IntensityChart;
