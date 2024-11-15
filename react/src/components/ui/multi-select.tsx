import type { GroupBase, Props } from "react-select";
import { CaretSortIcon, Cross2Icon } from "@radix-ui/react-icons";
import Select from "react-select";

const MultiSelect = <
  Option,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: Props<Option, IsMulti, Group>,
) => {
  return (
    <Select
      {...props}
      isMulti={true as IsMulti}
      components={{
        DropdownIndicator: () => (
          <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
        ),
        ClearIndicator: (props) => (
          <div {...props.innerProps} className="p-2 opacity-50">
            <Cross2Icon />
          </div>
        ),
      }}
      className="text-sm"
      classNames={{
        indicatorsContainer: () => "pr-3",
        control: () =>
          "!border-input !shadow-sm !cursor-pointer !min-h-[36px] !rounded-md !bg-background",
        menu: () =>
          "border !border-input !shadow-md !text-sm !rounded-md overflow-hidden",
        placeholder: () => "!text-muted-foreground",
        menuList: () => "p-1 bg-background",
        option: () =>
          "relative flex w-full cursor-default select-none items-center rounded-sm !py-1.5 !pl-2 !pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 !bg-popover hover:!bg-accent",
        indicatorSeparator: () => "!bg-input",
        multiValue: () => "!bg-secondary text-primary",
        multiValueLabel: () => "!text-primary",
        input: () => "!text-primary",
      }}
    />
  );
};

export default MultiSelect;
