import { useEffect, useRef } from "react";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import * as d3 from "d3";

import "../styles/SourceChart.scss";

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

let width = 500;
let height = 500;
let chartRadius = width / 2 - 50;
let barPadding = 5;

const SourcePlot = ({ data }) => {
  const svg = useRef();

  const createPlot = () => {
    if (!data || svg.current) return;

    svg.current = d3
      .select("#source_plot")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  };

  useEffect(() => {
    createPlot();
  }, []);

  useEffect(() => {
    if (!data || !svg.current) return;

    svg.current.selectAll("g").remove();

    let sourceCount = {};
    data.forEach(({ source }) => {
      if (!source) return;

      sourceCount = {
        ...sourceCount,
        [source]: sourceCount[source] ? sourceCount[source] + 1 : 1,
      };
    });

    const sources = Object.keys(sourceCount);

    const sourceDist = sources.map((d) => {
      return {
        name: d,
        count: sourceCount[d],
        percentage: (sourceCount[d] / sources.length) * 100,
      };
    });

    sourceDist.sort((a, b) => b.count - a.count);
    sourceDist.length = sourceDist.length > 15 ? 15 : sourceDist.length;
    sources.length = sourceDist.length > 15 ? 15 : sourceDist.length;
    let nBars = sources.length;
    let barWidth = chartRadius / nBars - barPadding;

    sourceDist.forEach((d, i) => {
      d.radius = (chartRadius / nBars) * i + barPadding;
      d.color = COLOR_SCALE[i];
    });

    let rAxis = svg.current.append("g");

    const t = rAxis.selectAll("circle").data(sourceDist);

    t.enter()
      .append("circle")
      .merge(t)
      .attr("r", (d) => d.radius + barWidth)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "none")
      .style("stroke", "silver")
      .style("stroke-width", "1px");

    const v = rAxis.selectAll("text").data(sourceDist);

    v.enter()
      .append("text")
      .merge(v)
      .attr("x", width / 2 - 10)
      .attr("y", (d) => height / 2 - (d.radius + barWidth / 2))
      .text(
        (d) => `${d.name} ${parseFloat(d.percentage).toFixed(2)} % (${d.count})`
      )
      .style("font-size", "12px")
      .style("fill", "white")
      .style("text-anchor", "end");

    let ticks = [0, 10, 20, 30, 40];

    if (sourceDist[0].count < 10) {
      ticks = [1, 2, 3, 4, 5, 6, 7, 9];
    } else if (sourceDist[0].count < 5) {
      ticks = [1, 2, 3, 4, 5];
    }

    let angle = d3
      .scaleLinear()
      .domain([0, sourceDist[0].count + 5])
      .range([0, 2 * Math.PI]);

    let coord = (value, radius) => {
      let a = angle(value) + Math.PI / 2;
      let x = Math.cos(a) * radius;
      let y = Math.sin(a) * radius;
      return { x: width / 2 - x, y: height / 2 - y };
    };

    let thetaAxis = svg.current.append("g");

    const z = thetaAxis.selectAll("line").data(ticks);

    z.enter()
      .append("line")
      .merge(z)
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr("x2", (d) => coord(d, chartRadius).x)
      .attr("y2", (d) => coord(d, chartRadius).y)
      .style("stroke", "silver");

    const s = thetaAxis.selectAll("text").data(ticks);

    s.enter()
      .append("text")
      .merge(s)
      .attr("text-anchor", (d) => (coord(d, 1).x < width / 2 ? "end" : "start"))
      .attr("x", (d) => coord(d, chartRadius * 1.1).x)
      .attr("y", (d) => coord(d, chartRadius * 1.1).y + 5)
      .text((d) => d)
      .style("fill", "white");

    let arc = d3
      .arc()
      .innerRadius((d) => d.radius)
      .outerRadius((d) => d.radius + barWidth)
      .startAngle(0)
      .endAngle((d) => angle(d.count));

    let bars = svg.current.append("g");

    const b1 = bars.selectAll("path").data(sourceDist);

    b1.enter()
      .append("path")
      .merge(b1)
      .attr("d", (d) => arc(d))
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .style("fill", (d) => d.color)
      .transition();

    const b2 = bars.selectAll("circle").data(sourceDist);

    b2.enter()
      .append("circle")
      .merge(b2)
      .transition()
      .attr("cx", (d) => coord(d.count - 0.1, d.radius + barWidth / 2).x)
      .attr("cy", (d) => coord(d.count - 0.1, d.radius + barWidth / 2).y)
      .attr("r", barWidth / 2)
      .attr("fill", (d) => d.color);

    svg.current.exit().remove();
  }, [data]);

  //   useTextColorD3();

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
        id="source_plot"
        width="100%"
        direction="column"
        align="center"
      >
        <Box>
          <Heading size="md">Top Sources.</Heading>
        </Box>
      </Flex>
    </Center>
  );
};

export default SourcePlot;
