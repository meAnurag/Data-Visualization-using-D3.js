import { useEffect, useRef } from "react";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import * as d3 from "d3";

const ScatterPlot = ({ data }) => {
  const svg = useRef();

  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const createPlot = () => {
    if (!data || svg.current) return;

    // set the dimensions and margins of the graph

    // append the svg object to the body of the page
    svg.current = d3
      .select("#scatter_plot")
      .append("svg")
      .attr("viewBox", "0 0 500 550")
      .attr("preserveAspectRatio", "xMinYMin")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.current
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .attr("x", width)
      .attr("y", height - 6)
      .style("font", "10px sans-serif")
      .text("Impact");

    svg.current
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("fill", "white")
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font", "10px sans-serif")
      .text("Likelihood");
  };

  useEffect(() => {
    createPlot();
  }, []);

  useEffect(() => {
    if (!data || !svg.current) return;

    svg.current.selectAll("circle").remove();

    const filteredData = data.filter((d) => d.impact && d.likelihood);

    var x = d3.scaleLinear().domain([0, 5]).range([0, width]);

    svg.current
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear().domain([0, 5]).range([height, 0]);

    svg.current.append("g").call(d3.axisLeft(y));

    // Add dots
    svg.current
      .append("g")
      .selectAll("dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.impact);
      })
      .attr("cy", function (d) {
        return y(d.likelihood);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");

    svg.current.selectAll("circle").exit().remove();
  }, [data]);

  return (
    <Center
      width={{
        base: "100%", // 0px
        sm: "100%", // ~480px. em is a relative unit and is dependant on the font-size.
        md: "50%", // ~768px
        lg: "50%", // ~992px
        xl: "50%", // ~1280px
        "2xl": "50%",
      }}
    >
      <Flex
        p={2}
        paddingBlock={5}
        marginBlock={5}
        marginInline={2}
        border="1px"
        borderRadius="8px"
        marginTop="5px"
        id="scatter_plot"
        width="100%"
        direction="column"
        align="center"
      >
        <Box>
          <Heading size="md">Impact - Likelihood relation.</Heading>
        </Box>
      </Flex>
    </Center>
  );
};

export default ScatterPlot;
