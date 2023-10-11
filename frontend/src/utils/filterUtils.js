export const isWithinRange = (val, range) =>
  parseInt(val) >= parseInt(range[0]) && parseInt(val) <= parseInt(range[1])
    ? true
    : false;

export const getFiltersToBeApplied = (filters, availableFilterOptions) => {
  const filtersToBeApplied = [];

  if (filters.startYear !== availableFilterOptions.start_year.min)
    filtersToBeApplied.push("startYear");
  if (filters.endYear !== availableFilterOptions.end_year.max)
    filtersToBeApplied.push("endYear");

  if (filters.publishedYears[0].value !== "all")
    filtersToBeApplied.push("publishedYears");

  if (
    filters.relevance[0] !== availableFilterOptions.relevance.min ||
    filters.relevance[1] !== availableFilterOptions.relevance.max
  )
    filtersToBeApplied.push("relevance");
  if (
    parseInt(filters.impact[0]) !==
      parseInt(availableFilterOptions.impact.min) ||
    parseInt(filters.impact[1]) !== parseInt(availableFilterOptions.impact.max)
  )
    filtersToBeApplied.push("impact");
  if (
    filters.likelihood[0] !== availableFilterOptions.likelihood.min ||
    filters.likelihood[1] !== availableFilterOptions.likelihood.max
  )
    filtersToBeApplied.push("likelihood");

  if (filters.sectors[0].value !== "all") filtersToBeApplied.push("sectors");
  if (filters.topics[0].value !== "all") filtersToBeApplied.push("topics");
  if (filters.countries[0].value !== "all")
    filtersToBeApplied.push("countries");
  if (filters.regions[0].value !== "all") filtersToBeApplied.push("regions");
  if (filters.pestles[0].value !== "all") filtersToBeApplied.push("pestles");
  if (filters.sources[0].value !== "all") filtersToBeApplied.push("sources");

  return filtersToBeApplied;
};

const isEligible = (d, filtersToBeApplied, filters) => {
  if (
    filtersToBeApplied.includes("startYear") &&
    filters.startYear > d.start_year
  )
    return false;

  if (filtersToBeApplied.includes("endYear") && filters.endYear < d.end_year)
    return false;

  const publishedYear = d.published && new Date(d.published).getFullYear();

  if (
    filtersToBeApplied.includes("publishedYears") &&
    (!publishedYear ||
      !filters.publishedYears.map((y) => y.value).includes(publishedYear))
  )
    return false;

  if (
    filtersToBeApplied.includes("relevance") &&
    !isWithinRange(d.relevance, filters.relevance)
  )
    return false;

  if (
    filtersToBeApplied.includes("impact") &&
    !isWithinRange(d.impact, filters.impact)
  )
    return false;

  if (
    filtersToBeApplied.includes("likelihood") &&
    !isWithinRange(d.likelihood, filters.likelihood)
  )
    return false;

  if (
    filtersToBeApplied.includes("sectors") &&
    (!d.sector || !filters.sectors.map((e) => e.value).includes(d.sector))
  )
    return false;
  if (
    filtersToBeApplied.includes("topics") &&
    (!d.topic || !filters.topics.map((e) => e.value).includes(d.topic))
  )
    return false;
  if (
    filtersToBeApplied.includes("countries") &&
    (!d.country || !filters.countries.map((e) => e.value).includes(d.country))
  )
    return false;
  if (
    filtersToBeApplied.includes("regions") &&
    (!d.region || !filters.regions.map((e) => e.value).includes(d.region))
  )
    return false;
  if (
    filtersToBeApplied.includes("pestles") &&
    (!d.pestle || !filters.pestles.map((e) => e.value).includes(d.pestle))
  )
    return false;
  if (
    filtersToBeApplied.includes("sources") &&
    (!d.source || !filters.sources.map((e) => e.value).includes(d.source))
  )
    return false;

  return true;
};

export const applyFilters = (data, filtersToBeApplied, filters) => {
  if (filtersToBeApplied.length === 0) return data;
  return data.filter((d) => isEligible(d, filtersToBeApplied, filters));
};
