import News from "../../models/news.model.js";

export const getData = async (req, res) => {
  const data = await News.find({});
  res.send(data);
};

export const getAvailableFilters = async (req, res) => {
  const data = await News.find({});

  let start_year = { min: 9999, max: 0 };
  let end_year = { min: 9999, max: 0 };
  let intensity = { min: 9999, max: 0 };
  let relevance = { min: 9999, max: 0 };
  let likelihood = { min: 9999, max: 0 };
  let published = { min: 9999, max: 0 };
  let impact = { min: 9999, max: 0 };

  const publishedYears = [];
  const sectors = [];
  const topics = [];
  const regions = [];
  const countries = [];
  const pestles = [];
  const sources = [];

  data.forEach((d) => {
    if (d.start_year)
      start_year = {
        min: start_year.min > d.start_year ? d.start_year : start_year.min,
        max: start_year.max < d.start_year ? d.start_year : start_year.max,
      };

    if (d.end_year)
      end_year = {
        min: end_year.min > d.end_year ? d.end_year : end_year.min,
        max: end_year.max < d.end_year ? d.end_year : end_year.max,
      };

    if (d.intensity)
      intensity = {
        min: intensity.min > d.intensity ? d.intensity : intensity.min,
        max: intensity.max < d.intensity ? d.intensity : intensity.max,
      };

    if (d.relevance)
      relevance = {
        min: relevance.min > d.relevance ? d.relevance : relevance.min,
        max: relevance.max < d.relevance ? d.relevance : relevance.max,
      };

    if (d.likelihood)
      likelihood = {
        min: likelihood.min > d.likelihood ? d.likelihood : likelihood.min,
        max: likelihood.max < d.likelihood ? d.likelihood : likelihood.max,
      };

    if (d.published && d.published !== "")
      published = {
        min:
          published.min > new Date(d.published).getFullYear()
            ? new Date(d.published).getFullYear()
            : published.min,
        max:
          published.max < new Date(d.published).getFullYear()
            ? new Date(d.published).getFullYear()
            : published.max,
      };

    if (d.impact)
      impact = {
        min: impact.min > d.impact ? d.impact : impact.min,
        max: impact.max < d.impact ? d.impact : impact.max,
      };

    if (
      d.published &&
      d.published !== "" &&
      !publishedYears.includes(new Date(d.published).getFullYear())
    )
      publishedYears.push(new Date(d.published).getFullYear());

    if (d.sector && d.sector !== "" && !sectors.includes(d.sector))
      sectors.push(d.sector);

    if (d.topic && d.topic !== "" && !topics.includes(d.topic))
      topics.push(d.topic);

    if (d.region && d.region !== "" && !regions.includes(d.region))
      regions.push(d.region);

    if (d.country && d.country !== "" && !countries.includes(d.country))
      countries.push(d.country);

    if (d.pestle && d.pestle !== "" && !pestles.includes(d.pestle))
      pestles.push(d.pestle);

    if (d.source && d.source !== "" && !sources.includes(d.source))
      sources.push(d.source);
  });

  publishedYears.sort();

  res.send({
    start_year,
    end_year,
    intensity,
    relevance,
    likelihood,
    published,
    impact,
    publishedYears,
    sectors,
    topics,
    regions,
    countries,
    pestles,
    sources,
  });
};
