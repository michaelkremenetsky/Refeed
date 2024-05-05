import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import type { Filter } from "@refeed/types/filter";
import { TextArea } from "@refeed/ui";

import { trpc } from "../../utils/trpc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import type { filterType } from "./FilterSelects";
import { ContentSelect, FeedsSelect, LogicSelect } from "./FilterSelects";

// ESLint dosen't know that Tanstack Form uses the children prop
/* eslint-disable react/no-children-prop */

export const ToggleFilters = () => {
  const { data: Filters } = trpc.pro.getFilters.useQuery();

  return (
    <div className={Filters?.length != 0 ? "mb-4" : ""}>
      {Filters?.map((f) => {
        const filter = f as unknown as Filter;

        return (
          <div className="my-2" key={JSON.stringify(filter)}>
            <div className="flex items-center space-x-1">
              <ToggleFilter filter={filter} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ToggleFilter = ({ filter }: { filter: Filter }) => {
  const [checked, setChecked] = useState(filter.enabled);
  const [notesOpen, setNotesOpen] = useState(false);

  const updateFilter = trpc.pro.updateFilter.useMutation();
  const deleteFilter = trpc.pro.deleteFilter.useMutation();
  const utils = trpc.useUtils();

  const DeleteFilter = async () => {
    await deleteFilter.mutateAsync({ filter_id: filter.id });

    utils.pro.getFilters.invalidate();
  };

  const form = useForm({
    defaultValues: {
      // Ids of feeds to filter Out, leave blank to filter all feeds
      Feeds: filter.filter.Feeds,
      // Type of content to filter out
      Content: filter.filter.Content,
      Logic: filter.filter.Logic,
      // How to filter content out
      Keywords: filter.filter.Keywords,
      // What content to filter out
    },
    onSubmit: async (values) => {
      const conditions = {
        Feeds: values.value.Feeds,
        Content: values.value.Content,
        Logic: values.value.Logic,
        Keywords: values.value.Keywords,
      };

      await updateFilter.mutateAsync({
        newFilter: {
          enabled: checked,
          conditions: conditions,
          id: filter.id,
        },
      });

      utils.pro.getFilters.refetch();
    },
  });

  return (
    <div className="flex items-center space-x-1">
      <form.Provider>
        <div>
          <div className="flex flex-col space-x-1 space-y-1.5 md:flex-row md:space-y-0">
            <input
              // @ts-ignore
              defaultChecked={filter.enabled}
              onChange={(e) => {
                setChecked(e.target.checked);
                void form.handleSubmit();
              }}
              className="ml-1 mr-2.5 mt-2.5 rounded-[3px] border border-neutral-300 bg-[#fcfcfc] text-stone-700 dark:border-[#333333]/80 dark:bg-[#333333]"
              type="checkbox"
            />
            <FeedsSelect FilterForm={form as filterType} existingFilter />
            <form.Subscribe
              selector={(state) => [state.isTouched]}
              children={
                <ContentSelect FilterForm={form as filterType} existingFilter />
              }
            />
            <LogicSelect FilterForm={form as filterType} existingFilter />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => setNotesOpen(!notesOpen)}
                    className="flex w-[50px] justify-center rounded-md border border-neutral-200 py-2 shadow-sm dark:border-[#232329] dark:bg-[#141415]"
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
            children={(field) => {
              return (
                <>
                  {notesOpen && (
                    <div className="flex flex-col">
                      <TextArea
                        onChange={(e) => {
                          const newKeywords = e.target.value
                            .split(",")
                            .map((s) => s.trim());
                          if (newKeywords) {
                            field.setValue(newKeywords);
                          } else {
                            field.setValue(undefined);
                          }

                          // Just using the button for now due to debouncing issues
                          // Might add this back later
                          // void form.handleSubmit();
                        }}
                        defaultValue={filter.filter.Keywords ?? ""}
                        className="z-10 mb-0.5 ml-1 mt-2 w-[40vh] md:ml-[34px] md:w-[602px]"
                        placeholder="Write Keywords"
                        rows={5}
                        maxLength={50}
                      />
                      <div className="flex self-end">
                        <button
                          onClick={() => {
                            DeleteFilter();
                          }}
                          className="mt-0.5 text-red-400"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            void form.handleSubmit();
                          }}
                          className="ml-2 mt-0.5 text-neutral-450"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      </form.Provider>
    </div>
  );
};
