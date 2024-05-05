import type { FormApi } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refeed/ui";

import { trpc } from "../../utils/trpc";
import { ImageWithFallback } from "../layout/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";

export type filterType = FormApi<
  {
    Feeds: string[];
    Content: "Content" | "Anywhere" | "Title" | "Link";
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

// ESLint dosen't know that Tanstack Form uses the children prop
/* eslint-disable react/no-children-prop */

export const FeedsSelect = ({
  FilterForm,
  existingFilter,
}: {
  FilterForm: filterType;
  existingFilter?: boolean;
}) => {
  const Feeds = trpc.feed.getFeedsInFolders
    .useQuery()
    .data?.flatMap((folder) => folder.children);

  return (
    <FilterForm.Field
      name="Feeds"
      children={(field) => {
        const selectedFeedsLogo = field.state.value
          ?.map((value) => Feeds?.find((feed) => feed?.id == value)?.logo_url)
          .slice(0, 3);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex h-10 w-[190px] items-center rounded-md border border-neutral-200 px-4 shadow-sm dark:border-[#232329] dark:bg-[#141415] dark:text-stone-200">
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
                <CommandEmpty>No Feeds found</CommandEmpty>
                <CommandList className="p-1 scrollbar-none">
                  <CommandGroup>
                    <fieldset>
                      {Feeds?.map((feed) => (
                        <CommandItem
                          key={feed?.id}
                          value={feed?.id}
                          onSelect={(value) => {
                            if (!field.state.value.includes(value)) {
                              field.pushValue(value);
                            } else {
                              const index = field.state.value.indexOf(value);
                              field.removeValue(index);
                            }

                            if (existingFilter) {
                              void FilterForm.handleSubmit();
                            }
                          }}
                          className="font-medium"
                        >
                          <input
                            defaultChecked={field.state.value?.includes(
                              feed?.id!,
                            )}
                            className="ml-1 mr-2.5 rounded-[3px] border border-neutral-200 bg-[#fcfcfc] text-stone-700 dark:border-[#333333]/80 dark:bg-[#333333]"
                            type="checkbox"
                          />
                          <ImageWithFallback
                            className="h-4 w-4"
                            width={16}
                            height={16}
                            src={feed?.logo_url!}
                            alt="Logo"
                          />
                          <h1 className="w-[140px] truncate text-ellipsis pl-2 text-[#38383d] dark:text-neutral-200">
                            {feed?.name!}
                          </h1>
                        </CommandItem>
                      ))}
                    </fieldset>
                  </CommandGroup>
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
          <SelectTrigger className="h-10 w-[190px] md:w-[175px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[190px] md:w-[175px]">
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
          <SelectTrigger className="h-10 w-[190px] md:w-[175px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
