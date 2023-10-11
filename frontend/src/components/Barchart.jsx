import * as d3 from "d3";
import { Center, Box, Heading, Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 500 - margin.left - margin.right;

const height = 500 - margin.top - margin.bottom;

const Barchart = ({ data }) => {
  const svg = useRef();

  const tooltip = useRef();

  const x = useRef();
  const y = useRef();

  const mouseover = function (_, d) {
    if (!tooltip.current) return;
    const text = d3.select("#bar_tooltip");
    text.text(`${d.name}: ${d.count}`);
  };

  const mousemove = function () {
    if (!tooltip.current) return;
    const [x, y] = d3.pointer(event);
    const text = d3.select("#bar_tooltip");
    text.style("left", x + "px");
    text.style("top", y + "px");
    text.style("opacity", 1);
  };

  const mouseleave = function () {
    if (!tooltip.current) return;
    const text = d3.select("#bar_tooltip");
    text.style("opacity", 0);
  };

  const createGraph = () => {
    if (!data || svg.current) return;

    const sectors = [];

    data.forEach(({ published, sector }) => {
      if (!sector || !published) return;

      if (!sectors.includes(sector)) sectors.push(sector);
    });

    // append the svg object to the body of the page
    svg.current = d3
      .select("#bar-chart")
      .append("svg")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", "0 0 500 550")
      .attr("preserveAspectRatio", "xMinYMin")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis

    // Add Y axis

    // tooltip.current = svg.current
    //   .append("g")
    //   .style("opacity", 0)
    //   .attr("class", "tooltip")
    //   .style("border", "solid")
    //   .style("border-width", "1px")
    //   .style("border-radius", "5px")
    //   .style("padding", "10px")
    //   .style("color", "black")
    //   .style("width", "100")
    //   .style("height", "100")
    //   .style("background-color", "white")
    //   .style("z-index", "100000");

    // tooltip.current
    //   .append("text")
    //   .attr("class", "text_area")
    //   .style("background-color", "white")
    //   .style("fill", "white")
    //   .style("z-index", "100001");
  };

  useEffect(() => {
    createGraph();
  }, []);

  useEffect(() => {
    if (!svg.current || !data) return;

    svg.current.selectAll("rect").remove();
    svg.current.select(".myYaxis").remove();

    const updateData = () => {
      const sectors = [];

      let sectorCount = {};

      let maxCount = 0;

      data.forEach(({ published, sector }) => {
        if (!sector || !published) return;

        if (!sectors.includes(sector)) sectors.push(sector);

        sectorCount = {
          ...sectorCount,
          [sector]: sectorCount[sector] ? sectorCount[sector] + 1 : 1,
        };
      });

      const sectorDist = Object.keys(sectorCount).map((d) => {
        maxCount = sectorCount[d] > maxCount ? sectorCount[d] : maxCount;
        return { name: d, count: sectorCount[d] };
      });

      x.current = d3.scaleBand().range([0, width]).domain(sectors).padding(0.2);

      svg.current
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xAxis")
        .call(d3.axisBottom(x.current))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      y.current = d3
        .scaleLinear()
        .domain([0, maxCount + 1])
        .range([height, 0]);

      svg.current
        .append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y.current));

      const u = svg.current.selectAll("rect").data(sectorDist);

      u.enter()
        .append("rect")
        .merge(u)
        .attr("x", (d) => x.current(d.name))
        .attr("width", x.current.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .transition()
        .duration(800)
        .attr("y", (d) => y.current(d.count))
        .attr("height", (d) => height - y.current(d.count))
        .attr("fill", "#69b3a2")
        .delay(function (d, i) {
          return i * 100;
        });
    };

    updateData();
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
        id="bar-chart"
        width="100%"
        direction="column"
        align="center"
        position="relative"
      >
        <Box>
          <Heading size="md">Sectors</Heading>
        </Box>
        <div
          ref={tooltip}
          id="bar_tooltip"
          style={{
            position: "absolute",
            backgroundColor: "palegreen",
            color: "blue",
            padding: "8px",
            borderRadius: 6,
            zIndex: 999999,
            opacity: 0,
          }}
        ></div>
      </Flex>
    </Center>
  );
};

export default Barchart;
