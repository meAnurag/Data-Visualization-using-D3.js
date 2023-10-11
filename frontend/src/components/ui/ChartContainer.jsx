import { Box, Flex, Heading } from "@chakra-ui/react";

const ChartContainer = ({ children, title, id }) => {
  return (
    <Flex
      width={{
        base: "100%",
        sm: "100%",
        md: "50%",
        lg: "50%",
        xl: "50%",
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
        id={id}
        width="100%"
        direction="column"
        align="center"
        position="relative"
      >
        <Box>
          <Heading size="md">{title}</Heading>
        </Box>
        {children}
      </Flex>
    </Flex>
  );
};

export default ChartContainer;
