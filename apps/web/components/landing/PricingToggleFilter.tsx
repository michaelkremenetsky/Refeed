import { LogicSelect } from "@components/landing/LandingToggleFilter";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@components/ui/DropDownMenu";
import type { FormApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";

import type { Filter } from "@refeed/types/filter";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@refeed/ui";

// ESLint dosen't know that Tanstack Form uses the children prop
/* eslint-disable react/no-children-prop */

export const PricingToggleFilter = ({ filter }: { filter: Filter }) => {
  const form = useForm({
    defaultValues: {
      Feeds: filter.filter.Feeds,
      Content: filter.filter.Content,
      Logic: filter.filter.Logic,
      Keywords: filter.filter.Keywords,
    },
  });

  return (
    <div className="flex items-center space-x-1">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="flex space-x-1">
            <FeedsSelect FilterForm={form} />
            <form.Subscribe
              selector={(state) => [state.isTouched]}
              children={<ContentSelect FilterForm={form} />}
            />
            <LogicSelect FilterForm={form} />
          </div>
        </form>
      </form.Provider>
    </div>
  );
};

type filterType = FormApi<
  {
    Feeds: string[];
    Content: "Content" | "Anywhere" | "Title" | "Summary" | "Link";
    Logic:
      | "Contain"
      | "Does Not Contain"
      | "Equals"
      | "Does not Equal"
      | "Begins With"
      | "Ends With"
      | undefined;
    Keywords: string[] | undefined;
  },
  undefined
>;

export const FeedsSelect = ({ FilterForm }: { FilterForm: filterType }) => {
  return (
    <FilterForm.Field
      name="Feeds"
      children={(field) => {
        const selectedFeedsLogo = field.state.value;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="ml-1 flex w-[150px] items-center rounded-md border border-neutral-200 bg-white px-4 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:border-[#24252A] dark:bg-[#141415] dark:text-stone-200">
                <div className="mr-auto flex">
                  <p className="text-sm font-[450]">
                    {field.state.value?.length == 0
                      ? "All Feeds"
                      : "+" + field.state.value?.length + " Feeds"}
                  </p>
                  <div className="ml-2 flex items-center space-x-1">
                    {selectedFeedsLogo?.map((logo) => (
                      <img
                        className="h-4 w-4"
                        key={logo}
                        src={logo}
                        alt={selectedFeedsLogo.toString() + "Logo"}
                      />
                    ))}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={-40}
              className="w-[190px] p-0"
            >
              <Command>
                <CommandInput placeholder="Filter Feeds" className="h-[40px]" />
                <CommandList className="p-1 scrollbar-none">
                  <CommandEmpty>No Feeds found</CommandEmpty>
                  <CommandGroup />
                </CommandList>
              </Command>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    />
  );
};

export const ContentSelect = ({
  FilterForm,
  existingFilter,
}: {
  FilterForm: filterType;
  existingFilter?: boolean;
}) => (
  <FilterForm.Field
    name="Content"
    children={(field) => {
      return (
        <Select
          onValueChange={(value) => {
            // @ts-ignore
            field.handleChange(value);
            if (existingFilter) {
              void FilterForm.handleSubmit();
            }
          }}
          defaultValue={field.state.value}
          value={field.state.value}
        >
          <SelectTrigger className="w-[150px] border border-neutral-200 bg-white shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[150px]">
            <SelectItem value="Anywhere">Anywhere</SelectItem>
            <SelectItem value="Title">In the Title</SelectItem>
            <SelectItem value="Content">In the Content</SelectItem>
            <SelectItem value="Link">In the Link</SelectItem>
          </SelectContent>
        </Select>
      );
    }}
  />
);
