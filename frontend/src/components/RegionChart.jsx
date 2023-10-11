import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { COLOR_SCALE } from "../config";

import "../styles/RegionChart.scss";
import ChartContainer from "./ui/ChartContainer";

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
        .attr("viewBox", "0 0 500 550")
        .attr("preserveAspectRatio", "xMinYMin");
      // .attr("width", width)

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

      const tooltip = d3.select(".toolTip_region_dist");

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
          .style("opacity", 1)
          .duration(200);
      });

      arc.current.on(
        "mousemove",
        function (d, { data: { name, percentage, count } }) {
          const [x, y] = d3.pointer(event);
          tooltip.style("top", y + 300 + "px");
          tooltip.style("left", x + 150 + "px");
          tooltip.style("display", "flex");
          tooltip.html(
            `${name} <br/> ${percentage.toFixed(2)} % <br/> (${count})`
          );
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
      });
    };
    updateData();
  }, [data, radius]);

  return (
    <ChartContainer id="region_dist" title="Region Distribution">
      <div className="toolTip_region_dist" />
    </ChartContainer>
  );
};

export default RegionChart;
