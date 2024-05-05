import { Close } from "@radix-ui/react-popover";
import { createFormFactory } from "@tanstack/react-form";

import { TextArea } from "@refeed/ui";

import { trpc } from "../../utils/trpc";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { ContentSelect, FeedsSelect, LogicSelect } from "./FilterSelects";

// ESLint dosen't know that Tanstack Form uses the children prop
/* eslint-disable react/no-children-prop */

export const AddFilterForm = createFormFactory({
  defaultValues: {
    // Ids of feeds to filter Out, leave blank to filter all feeds
    Feeds: [],
    // Type of content to filter out
    Content: "Title",
    // How to filter content out
    Logic: "Contain",
    // What content to filter out
    Keywords: [],
  },
});

export const AddFilterButton = () => {
  return (
    <Popover>
      <PopoverTrigger className="rounded-md text-sm font-medium text-sky-500">
        + Add Filter
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={7}
        className="w-full transform overflow-hidden rounded-lg border-[1.5px] border-neutral-400/30 bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] dark:border-[#232329]"
      >
        <div className="px-2.5 py-2.5">
          <AddFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AddFilter = () => {
  const addFilter = trpc.pro.addFilter.useMutation();
  const utils = trpc.useUtils();

  const form = AddFilterForm.useForm({
    onSubmit: async (values) => {
      const conditions = {
        Feeds: values.value.Feeds,
        Content: values.value.Content,
        Logic: values.value.Logic,
        Keywords: values.value.Keywords,
      };

      await addFilter.mutateAsync({
        enabled: true,
        filter: conditions,
      });

      utils.pro.getFilters.invalidate();
    },
  });

  return (
    <form.Provider>
      <div>
        <div className="flex space-x-2">
          <FeedsSelect FilterForm={AddFilterForm as any} />
          <form.Subscribe
            selector={(state) => [state.isTouched]}
            children={<ContentSelect FilterForm={AddFilterForm as any} />}
          />
          <LogicSelect FilterForm={AddFilterForm as any} />
        </div>
        <form.Field
          name="Keywords"
          asyncDebounceMs={500}
          children={(field) => {
            return (
              <form.Subscribe
                selector={(state) => [state.values.Logic]}
                children={() => {
                  if (form.getFieldValue("Logic") != "Check with Code") {
                    return (
                      <div className="mt-2.5">
                        <TextArea
                          className="z-10 ml-[0.5px] h-[150px] w-full"
                          onChange={(e) => {
                            const keywords = e.target.value.split(",");

                            // @ts-ignore
                            field.handleChange(keywords);
                          }}
                          placeholder="Write keywords seperated by commas"
                          name="postContent"
                          rows={5}
                          maxLength={50}
                        />
                      </div>
                    );
                  }
                }}
              />
            );
          }}
        />
        <div className="flex justify-end">
          <Close
            type="submit"
            onClick={() => void form.handleSubmit()}
            className="mt-0.5 flex rounded-md bg-white px-4 py-1.5 text-base font-[450] shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] hover:bg-[#fafafa] dark:border dark:border-[#1e2020] dark:bg-[#0f0f10] dark:text-stone-200 dark:shadow-none dark:hover:bg-[#0f0f10]"
          >
            Add Filter
          </Close>
        </div>
      </div>
    </form.Provider>
  );
};
