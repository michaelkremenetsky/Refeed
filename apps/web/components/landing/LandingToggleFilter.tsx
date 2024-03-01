import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/Tooltip";
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
  TextArea,
} from "@refeed/ui";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";

// ESLint dosen't know that Tanstack Form uses the children prop
/* eslint-disable react/no-children-prop */

export const LandingToggleFilter = ({
  filter,
  notesOpen,
  setNotesOpen,
}: {
  filter: Filter;
  notesOpen: boolean;
  setNotesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => setNotesOpen(!notesOpen)}
                    className="flex w-[50px] justify-center rounded-md border border-neutral-200 bg-white py-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:border-[#24252A] dark:bg-[#141415]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-[22px] w-[22px] stroke-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Edit Keywords</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <form.Field
            name="Keywords"
            children={() => {
              return (
                <>
                  {notesOpen && (
                    <div className="flex flex-col">
                      <TextArea
                        defaultValue={filter.filter.Keywords ?? ""}
                        className="z-10 mb-0.5 ml-1 mt-2 h-[150px] w-[602px]"
                        placeholder="Write Keywords"
                        rows={5}
                        maxLength={50}
                      />
                    </div>
                  )}
                </>
              );
            }}
          />
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
              <div className="ml-1 flex w-[190px] items-center rounded-md border border-neutral-200 bg-white px-4 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:border-[#24252A] dark:bg-[#141415] dark:text-stone-200">
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
          <SelectTrigger className="w-[175px] border border-neutral-200 bg-white shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[175px]">
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

export const LogicSelect = ({
  FilterForm,
  existingFilter,
}: {
  FilterForm: filterType;
  existingFilter?: boolean;
}) => (
  <FilterForm.Field
    name="Logic"
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
          <SelectTrigger className="w-[175px] border border-neutral-200 bg-white shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[175px]">
            <SelectItem value="Contain">Contain</SelectItem>
            <SelectItem value="Does Not Contain">Does Not Contain</SelectItem>
            <SelectItem value="Equals">Equals</SelectItem>
            <SelectItem value="Does not Equal">Does not Equal</SelectItem>
            <SelectItem value="Begins With">Begins With</SelectItem>
            <SelectItem value="Ends With">Ends With</SelectItem>
          </SelectContent>
        </Select>
      );
    }}
  />
);
