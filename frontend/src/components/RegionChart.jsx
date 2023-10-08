import { useEffect, useRef } from "react";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import * as d3 from "d3";

import "../styles/RegionChart.scss";

const COLOR_SCALE = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#DCE775",
  "#FFF176",
  "#FFD54F",
  "#FFB74D",
  "#FF8A65",
  "#A1887F",
  "#90A4AE",
  "#78909C",
  "#607D8B",
  "#455A64",
  "#333333",
  "#222222",
];

const RegionChart = ({ data }) => {
  const svg = useRef();

  const arc = useRef();

  const width = 500;
  const height = 500;

  const radius = Math.min(width, height) / 2 - 10;

  useEffect(() => {
    const createChart = () => {
      if (!data || svg.current) return;

      svg.current = d3
        .select("#region_dist")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      svg.current
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    };
    createChart();
  }, [data]);

  useEffect(() => {
    const updateData = () => {
      let regionCount = {};

      let total = 0;

      const g = svg.current.select("g");

      const path = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      data.forEach(({ region }) => {
        if (!region) return;
        total++;
        regionCount = {
          ...regionCount,
          [region]: regionCount[region] ? regionCount[region] + 1 : 1,
        };
      });

      const regions = Object.keys(regionCount);

      const regionDist = regions.map((region) => {
        return {
          name: region,
          count: regionCount[region],
          percentage: (regionCount[region] / total) * 100,
        };
      });

      const color = d3.scaleOrdinal(COLOR_SCALE);

      const pie = d3.pie().value((d) => d.percentage);

      arc.current = g.selectAll("path").data(pie(regionDist));

      arc.current
        .enter()
        .append("path")
        .merge(arc.current)
        .transition()
        .attr("d", path)
        .attr("fill", (d) => color(d.data.name))
        .attr("stroke", "rgba(255,255,255,0.3)")
        .style("stroke-width", "2px")
        .style("opacity", 1);

      arc.current.exit().remove();

      const tooltip = d3
        .select("#region_dist")
        .append("div")
        .attr("class", "toolTip_region_dist");

      arc.current.style("transition", "all 200ms ease");

      arc.current.on("mouseover", function () {
        d3.select(this)
          .transition()
          .attr(
            "d",
            d3
              .arc()
              .innerRadius(0)
              .outerRadius(radius + 5)
          )
          .duration(200);
        // .style("opacity", "0.8")
        // .style("transform", "scaleX(1.02)");
      });

      arc.current.on(
        "mousemove",
        function (d, { data: { name, percentage, count } }) {
          tooltip.style("left", d.clientX + 10 + "px");
          tooltip.style("top", d.clientY - 25 + "px");
          tooltip.style("display", "inline-block");
          tooltip.html(`${name} <br/> ${percentage.toFixed(2)} % (${count})`);
        }
      );

      arc.current.on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this)
          .transition()
          .attr(
            "d",
            d3
              .arc()
              .innerRadius(0)
              .outerRadius(radius - 10)
          )
          .duration(200);
        // d3.select(this).style("opacity", "1").style("transform", "scaleX(1.0)");
      });
    };
    updateData();
  }, [data, radius]);

  return (
    <Center width="50%">
      <Flex
        p={2}
        paddingBlock={10}
        marginBlock={5}
        marginInline={2}
        border="1px"
        borderRadius="8px"
        marginTop="5px"
        id="region_dist"
        height={600}
        width="100%"
        direction="column"
        justify="center"
        align="center"
      >
        <Box>
          <Heading size="md">Region Distribution</Heading>
        </Box>
      </Flex>
    </Center>
  );
};

export default RegionChart;
