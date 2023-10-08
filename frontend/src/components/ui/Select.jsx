import { useColorMode } from "@chakra-ui/react";
import ReactSelect from "react-select";

const colors = {
  light: { color: "black", backgroundColor: "white" },
  dark: { color: "white", backgroundColor: "#232934ff" },
};

const Select = ({ options, props, addAll, value, onChange }) => {
  const { colorMode } = useColorMode();

  return (
    <ReactSelect
      value={value}
      onChange={(val, action) => {
        if (!addAll) return onChange(val, action);
        if (
          val.length === 0 ||
          (action.action === "select-option" && action.option.value === "all")
        )
          return onChange([{ value: "all", label: "All" }], action);
        onChange(
          val.filter((a) => a.value !== "all"),
          action
        );
      }}
      options={addAll ? [{ value: "all", label: "All" }, ...options] : options}
      styles={{
        control: (base) => ({
          ...base,
          ...(colorMode === "light" ? colors.light : colors.dark),
          border: "0.5px solid rgba(255,255,255,0.2)",
        }),
        singleValue: (base) => ({ ...base, color: "white" }),

        clearIndicator: (base, state) => ({
          ...base,
          cursor: "pointer",
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
          display:
            state.selectProps.value?.length == 1 &&
            state.selectProps.value[0].value === "all"
              ? "none"
              : "block",
        }),
        container: (base) => ({
          ...base,
          color: "white",
        }),
        dropdownIndicator: (base, state) => {
          return {
            ...base,
            color:
              colorMode === "light" ? colors.light.color : colors.dark.color,
            cursor: "pointer",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "",
            transition: "all 200ms ease",
          };
        },
        group: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        groupHeading: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        indicatorsContainer: (base) => ({
          ...base,
          backgroundColor: "#f46046",
          borderRadius: "0 4px 4px 0",
        }),
        indicatorSeparator: (base, { isMulti, selectProps: { value } }) => ({
          ...base,
          opacity:
            isMulti &&
            value?.length &&
            !(value?.length == 1 && value[0].value === "all")
              ? 1
              : 0,
        }),
        input: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        loadingIndicator: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        loadingMessage: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        menu: (base) => ({
          ...base,
          ...(colorMode === "light" ? colors.light : colors.dark),
          zIndex: 99999,
        }),
        menuList: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        menuPortal: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        multiValue: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
          backgroundColor: colorMode === "light" ? "#e6e5e6" : "grey",
        }),
        multiValueLabel: (base, state) => ({
          ...base,
          padding: state.children === "All" ? "2px 10px" : "3px 5px",
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        multiValueRemove: (base, state) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
          display: state.children === "All" ? "none" : "flex",
        }),
        noOptionsMessage: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
          border: "5px solid rgba(255,0,0,0.2)",
          borderRadius: "4px",
        }),
        option: (base) => ({
          ...base,
          ...(colorMode === "light" ? colors.light : colors.dark),
          cursor: "pointer",
          "&:hover": {
            backgroundColor: colorMode === "light" ? "skyblue" : "#f46046",
          },
          "&:focus": {
            backgroundColor: colorMode === "light" ? "skyblue" : "#f46046",
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
        valueContainer: (base) => ({
          ...base,
          color: colorMode === "light" ? colors.light.color : colors.dark.color,
        }),
      }}
      {...props}
    />
  );
};

export default Select;
