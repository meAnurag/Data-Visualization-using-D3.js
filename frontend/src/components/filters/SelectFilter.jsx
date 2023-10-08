import {
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  CheckboxGroup,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

const SelectFilter = ({ data, filterName }) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {filterName}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <CheckboxGroup colorScheme="green" defaultValue="All">
          <Checkbox value="All">All</Checkbox>
          <Stack spacing="1" direction="column">
            {data.map((sector) => (
              <Checkbox value={sector} key={sector}>
                {sector}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default SelectFilter;
