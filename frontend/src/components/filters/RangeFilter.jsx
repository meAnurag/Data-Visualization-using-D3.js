import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";

const RangeFilter = ({ min, max, step, label, value, onChange }) => {
  return (
    <Flex direction="column" paddingInline={0} marginBlock={6} gap={2}>
      <Text as="b">{label}</Text>
      <Box paddingInline={4}>
        <RangeSlider
          aria-label={["min", "max"]}
          defaultValue={[min, max]}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        >
          {Array.from(
            { length: (max - min) / step + 1 },
            (value, index) => min + index * step
          ).map((n) => (
            <RangeSliderMark value={n} mt="1" ml="-2.5" fontSize="sm" key={n}>
              {n}
            </RangeSliderMark>
          ))}

          <RangeSliderTrack bg="red.100">
            <RangeSliderFilledTrack bg="tomato" />
          </RangeSliderTrack>

          <RangeSliderThumb boxSize={4} index={0} />
          <RangeSliderThumb boxSize={4} index={1} />
        </RangeSlider>
      </Box>
    </Flex>
  );
};

export default RangeFilter;
