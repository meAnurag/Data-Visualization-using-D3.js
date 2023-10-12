import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { AiOutlineFilter } from "react-icons/ai";
import {
  BsCaretLeftFill,
  BsCaretRightFill,
  BsCaretUpFill,
} from "react-icons/bs";

import Select from "../components/ui/Select";

import "../styles/Filters.scss";
import { useEffect, useState } from "react";
import RangeFilter from "./filters/RangeFilter";

const Filters = ({ filters, setFilters, show, setShow, availableFilters }) => {
  const setDefaultFilters = (res) => {
    setFilters({
      startYear: res.start_year.min,
      endYear: res.end_year.max,
      publishedYears: [{ value: "all", label: "All" }],
      relevance: [res.relevance.min, res.relevance.max],
      impact: [res.impact.min, res.impact.max],
      likelihood: [res.likelihood.min, res.likelihood.max],
      sectors: [{ value: "all", label: "All" }],
      topics: [{ value: "all", label: "All" }],
      countries: [{ value: "all", label: "All" }],
      regions: [{ value: "all", label: "All" }],
      pestles: [{ value: "all", label: "All" }],
      sources: [{ value: "all", label: "All" }],
    });
  };

  useEffect(() => {
    if (!setFilters || filters || !availableFilters) return;

    setDefaultFilters(availableFilters);
  }, [availableFilters]);

  const [expanded, setExpanded] = useState(false);

  if (!availableFilters || !filters) return;

  return (
    <Skeleton
      border="1px solid rgba(200,200,200,0.5)"
      borderRadius="6px"
      isLoaded={!!filters}
      p={2}
      m={1}
      className={`filter_container ${show ? "show_filters" : "hide_filters"}`}
      height="100%"
      top="10px"
      flex={
        expanded
          ? {
              base: 4,
              sm: 4,
              md: 4,
              lg: 4,
              xl: 4,
              "2xl": 5,
            }
          : {
              base: 2,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 2,
              "2xl": 3,
            }
      }
    >
      <Flex justify="center" align="center">
        <IconButton
          className="expand"
          icon={expanded ? <BsCaretRightFill /> : <BsCaretLeftFill />}
          onClick={() => setExpanded((e) => !e)}
        />
        <Icon as={AiOutlineFilter} />
        <Heading size="sm">&nbsp; Filters</Heading>
        <IconButton
          className="filter_show_button"
          marginLeft="auto"
          icon={<BsCaretUpFill />}
          onClick={() => setShow((e) => !e)}
        />
      </Flex>

      <Divider opacity={0.4} marginBlock={2} />

      <Button
        color="red"
        _hover={{ backgroundColor: "red", color: "white" }}
        marginBlock={2}
        w="100%"
        onClick={() => setDefaultFilters(availableFilters)}
      >
        Clear Filters
      </Button>

      <Flex
        paddingInline={2}
        gap={1}
        direction="column"
        justify="space-between"
      >
        <Flex direction="row" justify="space-between">
          <Text as="b">Start Year</Text>
          <Text as="b"> End Year</Text>
        </Flex>
        <Flex direction="row" justify="space-between" gap={1}>
          {/* start year */}
          <NumberInput
            allowMouseWheel
            value={filters.startYear}
            onChange={(val) =>
              setFilters((currFilter) => ({
                ...currFilter,
                startYear: parseInt(val),
              }))
            }
            min={availableFilters.start_year.min}
            max={availableFilters.start_year.max}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {/* end year */}
          <NumberInput
            allowMouseWheel
            value={filters.endYear}
            onChange={(val) =>
              setFilters((currFilter) => ({
                ...currFilter,
                endYear: parseInt(val),
              }))
            }
            min={availableFilters.end_year.min}
            max={availableFilters.end_year.max}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Published Year</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.publishedYears}
            onChange={(val) =>
              setFilters((c) => ({ ...c, publishedYears: val }))
            }
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.publishedYears.map((year) => {
              return { label: year, value: year };
            })}
          />
        </Box>
      </Flex>

      <RangeFilter
        min={availableFilters.relevance.min}
        max={availableFilters.relevance.max}
        value={filters.relevance}
        onChange={(val) => setFilters((c) => ({ ...c, relevance: val }))}
        step={1}
        label={"Relevance"}
      />
      <RangeFilter
        min={parseInt(availableFilters.impact.min)}
        max={parseInt(availableFilters.impact.max)}
        value={filters.impact}
        onChange={(val) => setFilters((c) => ({ ...c, impact: val }))}
        step={1}
        label={"Impact"}
      />
      <RangeFilter
        min={availableFilters.likelihood.min}
        max={availableFilters.likelihood.max}
        value={filters.likelihood}
        onChange={(val) => setFilters((c) => ({ ...c, likelihood: val }))}
        step={1}
        label={"Likelihood"}
      />

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Sectors</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.sectors}
            onChange={(val) => setFilters((c) => ({ ...c, sectors: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.sectors.map((secotr) => {
              return { label: secotr, value: secotr };
            })}
          />
        </Box>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Topics</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.topics}
            onChange={(val) => setFilters((c) => ({ ...c, topics: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.topics.map((topic) => {
              return { label: topic, value: topic };
            })}
          />
        </Box>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Countries</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.countries}
            onChange={(val) => setFilters((c) => ({ ...c, countries: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.countries.map((country) => {
              return { label: country, value: country };
            })}
          />
        </Box>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Regions</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.regions}
            onChange={(val) => setFilters((c) => ({ ...c, regions: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.regions.map((region) => {
              return { label: region, value: region };
            })}
          />
        </Box>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Pestles</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.pestles}
            onChange={(val) => setFilters((c) => ({ ...c, pestles: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.pestles.map((pestle) => {
              return { label: pestle, value: pestle };
            })}
          />
        </Box>
      </Flex>

      <Flex marginBlock={3} direction="column" gap={2}>
        <Text as="b">Sources</Text>
        <Box paddingInline={2}>
          <Select
            addAll
            value={filters.sources}
            onChange={(val) => setFilters((c) => ({ ...c, sources: val }))}
            props={{ isMulti: true, isSearchable: true }}
            options={availableFilters.sources.map((source) => {
              return { label: source, value: source };
            })}
          />
        </Box>
      </Flex>
      <Flex justify="center" flex="1">
        <IconButton
          flex="1"
          className="filter_show_button"
          icon={<BsCaretUpFill />}
          onClick={() => setShow((e) => !e)}
        />
      </Flex>
    </Skeleton>
  );
};

export default Filters;
