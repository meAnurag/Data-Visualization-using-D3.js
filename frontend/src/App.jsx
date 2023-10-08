import { useEffect, useState } from "react";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";

import Barchart from "./components/Barchart";
import Filters from "./components/Filters";
import RegionChart from "./components/RegionChart";
import CountryChart from "./components/CountryChart";
import ScatterPlot from "./components/ScatterPlot";
import SourcePlot from "./components/SourcePlot";
import { useTextColorD3 } from "./hooks/useTextColorD3";
import { useDebounce } from "./hooks/useDebounce";
import { useFetch } from "./hooks/useFetch";
import { isWithinRange } from "./utils/filterUtils";

function App() {
  // const [data, setData] = useState();
  const data = useFetch("/data");

  const { data: availableFilterOptions } = useFetch("/getAvailableFilters");

  const [filters, setFilters] = useState();

  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState();

  const debouncedFilters = useDebounce(filters, 1000);

  useEffect(() => {
    if (
      !data.data ||
      data.data.length < 1 ||
      !availableFilterOptions ||
      !debouncedFilters
    )
      return setFilteredData(data.data);

    setLoading(true);

    const filtersToBeApplied = [];

    if (debouncedFilters.startYear !== availableFilterOptions.start_year.min)
      filtersToBeApplied.push("startYear");
    if (debouncedFilters.endYear !== availableFilterOptions.end_year.max)
      filtersToBeApplied.push("endYear");

    if (debouncedFilters.publishedYears[0].value !== "all")
      filtersToBeApplied.push("publishedYears");

    if (
      debouncedFilters.relevance[0] !== availableFilterOptions.relevance.min ||
      debouncedFilters.relevance[1] !== availableFilterOptions.relevance.max
    )
      filtersToBeApplied.push("relevance");
    if (
      parseInt(debouncedFilters.impact[0]) !==
        parseInt(availableFilterOptions.impact.min) ||
      parseInt(debouncedFilters.impact[1]) !==
        parseInt(availableFilterOptions.impact.max)
    )
      filtersToBeApplied.push("impact");
    if (
      debouncedFilters.likelihood[0] !==
        availableFilterOptions.likelihood.min ||
      debouncedFilters.likelihood[1] !== availableFilterOptions.likelihood.max
    )
      filtersToBeApplied.push("likelihood");

    if (debouncedFilters.sectors[0].value !== "all")
      filtersToBeApplied.push("sectors");
    if (debouncedFilters.topics[0].value !== "all")
      filtersToBeApplied.push("topics");
    if (debouncedFilters.countries[0].value !== "all")
      filtersToBeApplied.push("countries");
    if (debouncedFilters.regions[0].value !== "all")
      filtersToBeApplied.push("regions");
    if (debouncedFilters.pestles[0].value !== "all")
      filtersToBeApplied.push("pestles");
    if (debouncedFilters.sources[0].value !== "all")
      filtersToBeApplied.push("sources");

    if (filtersToBeApplied.length === 0) {
      setLoading(false);
      setFilteredData(data.data);
      return;
    }

    const temp = data.data.filter((d) => {
      if (
        filtersToBeApplied.includes("startYear") &&
        debouncedFilters.startYear > d.start_year
      )
        return false;

      if (
        filtersToBeApplied.includes("endYear") &&
        debouncedFilters.endYear < d.end_year
      )
        return false;

      const publishedYear = d.published && new Date(d.published).getFullYear();

      if (
        filtersToBeApplied.includes("publishedYears") &&
        (!publishedYear ||
          !debouncedFilters.publishedYears.includes(publishedYear))
      )
        return false;

      if (
        filtersToBeApplied.includes("relevance") &&
        !isWithinRange(d.relevance, debouncedFilters.relevance)
      )
        return false;

      if (
        filtersToBeApplied.includes("impact") &&
        !isWithinRange(d.impact, debouncedFilters.impact)
      )
        return false;

      if (
        filtersToBeApplied.includes("likelihood") &&
        !isWithinRange(d.likelihood, debouncedFilters.likelihood)
      )
        return false;

      if (
        filtersToBeApplied.includes("sectors") &&
        (!d.sector ||
          !debouncedFilters.sectors.map((e) => e.value).includes(d.sector))
      )
        return false;
      if (
        filtersToBeApplied.includes("topics") &&
        (!d.topic ||
          !debouncedFilters.topics.map((e) => e.value).includes(d.topic))
      )
        return false;
      if (
        filtersToBeApplied.includes("countries") &&
        (!d.country ||
          !debouncedFilters.countries.map((e) => e.value).includes(d.country))
      )
        return false;
      if (
        filtersToBeApplied.includes("regions") &&
        (!d.region ||
          !debouncedFilters.regions.map((e) => e.value).includes(d.region))
      )
        return false;
      if (
        filtersToBeApplied.includes("pestles") &&
        (!d.pestle ||
          !debouncedFilters.pestles.map((e) => e.value).includes(d.pestle))
      )
        return false;
      if (
        filtersToBeApplied.includes("sources") &&
        (!d.source ||
          !debouncedFilters.sources.map((e) => e.value).includes(d.source))
      )
        return false;

      return true;
    });

    setFilteredData(temp);
    setLoading(false);
  }, [data.data, availableFilterOptions, debouncedFilters]);

  // useEffect(() => {
  //   if (!debouncedFilters) return;
  //   sessionStorage.setItem("filters", JSON.stringify(debouncedFilters));
  // }, [debouncedFilters]);

  // useEffect(() => {
  //   const filterString = sessionStorage.getItem("filters");
  //   console.log(filterString);
  //   if (!filterString) return;
  //   setFilters(JSON.parse(filterString));
  // }, []);

  useTextColorD3();

  return (
    <Box>
      {filteredData && filteredData.length && !loading ? (
        <Flex marginTop="10px">
          <Flex flex="16" direction="column" m={0}>
            <Flex>
              <Barchart data={filteredData} />
              <RegionChart data={filteredData} />
            </Flex>
            <Flex>
              <CountryChart data={filteredData} />
            </Flex>
            <Flex>
              <ScatterPlot data={filteredData} />
              <SourcePlot data={filteredData} />
            </Flex>
          </Flex>
          <Filters filters={filters} setFilters={setFilters} />
        </Flex>
      ) : (
        <Flex
          justify="center"
          align="center"
          gap={4}
          height="90vh"
          direction="column"
        >
          <Spinner size="xl" thickness="4px" speed="0.65s" />
          <Heading>Loading</Heading>
        </Flex>
      )}
    </Box>
  );
}

export default App;
