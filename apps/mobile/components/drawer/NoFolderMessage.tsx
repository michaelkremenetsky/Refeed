import React from "react";

import { EmptyMessageSvg } from "../graphics/EmptyMessageSvg";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { AddFolderButtonBlue } from "./AddFolderButtons";

export const NoFoldersMessage = ({ Empty }: { Empty: boolean }) => (
  <>
    {Empty ? (
      <View className="mt-6 flex flex-col justify-center rounded-md">
        <View className="flex-grow" />
        <EmptyMessageSvg className="mx-auto mb-1 h-32 w-32" />
        <Text className="mx-auto mb-1 mt-4 text-center text-sm font-medium">
          No Folders
        </Text>
        <Text className="mx-auto mb-2 px-4 text-center text-sm text-neutral-600">
          To get started create a Folder to put your Feeds In
        </Text>
        <AddFolderButtonBlue />
      </View>
    ) : null}
  </>
);
