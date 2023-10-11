import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import Barchart from "./components/Barchart";
import Filters from "./components/Filters";
import RegionChart from "./components/RegionChart";
import CountryChart from "./components/CountryChart";
import ScatterPlot from "./components/ScatterPlot";
import SourcePlot from "./components/SourcePlot";

import { useTextColorD3 } from "./hooks/useTextColorD3";
import { useDebounce } from "./hooks/useDebounce";
import { useFetch } from "./hooks/useFetch";
import { applyFilters, getFiltersToBeApplied } from "./utils/filterUtils";
import { BsCaretDownFill } from "react-icons/bs";
import { TbMoodEmptyFilled } from "react-icons/tb";

import "./App.scss";

function App() {
  const data = useFetch("/data");

  const { data: availableFilterOptions } = useFetch("/getAvailableFilters");

  const [filters, setFilters] = useState();

  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState();

  const [showFilters, setShowFilters] = useState(false);

  const debouncedFilters = useDebounce(filters, 100);

  useEffect(() => {
    if (
      !data.data ||
      data.data.length < 1 ||
      !availableFilterOptions ||
      !debouncedFilters
    )
      return setFilteredData(data.data);

    setLoading(true);

    const filtersToBeApplied = getFiltersToBeApplied(
      debouncedFilters,
      availableFilterOptions
    );

    const temp = applyFilters(data.data, filtersToBeApplied, debouncedFilters);

    setFilteredData(temp);
    setLoading(false);
  }, [data.data, availableFilterOptions, debouncedFilters]);

  useTextColorD3();

  if (!filteredData && loading)
    return (
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
    );

  return (
    <Box>
      <Flex paddingInline={3} marginTop={2} className="filter_show_button">
        <Button
          flex="1"
          onClick={() => {
            setShowFilters((a) => !a);
          }}
        >
          <Flex flex="1" justify="space-between">
            <Text>Filters</Text>
            <BsCaretDownFill />
          </Flex>
        </Button>
      </Flex>
      <Flex marginTop="10px">
        <Flex flex="16" direction="column">
          {filteredData && filteredData.length && !loading ? (
            <>
              <Flex
                direction={{
                  base: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                  "2xl": "row",
                }}
                m={0}
              >
                <Barchart data={filteredData} />
                <RegionChart data={filteredData} />
              </Flex>
              <Flex>
                <CountryChart data={filteredData} />
              </Flex>
              <Flex
                direction={{
                  base: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                  "2xl": "row",
                }}
              >
                <ScatterPlot data={filteredData} />
                <SourcePlot data={filteredData} />
              </Flex>
            </>
          ) : null}

          {filteredData && filteredData.length === 0 && (
            <Flex flex="1" align="center" paddingTop={20} direction="column">
              <TbMoodEmptyFilled size={100} />
              <Heading textAlign="center">
                No Data matches selected filters.
              </Heading>
            </Flex>
          )}
        </Flex>

        <Filters
          filters={filters}
          setFilters={setFilters}
          show={showFilters}
          setShow={setShowFilters}
        />
      </Flex>
    </Box>
  );
}

export default App;
