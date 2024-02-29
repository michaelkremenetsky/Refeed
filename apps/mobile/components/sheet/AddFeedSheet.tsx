import type { RefObject } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useAtom } from "jotai";
import * as DropdownMenu from "zeego/dropdown-menu";

import { useCheckSource } from "../../features/useCheckSource";
import { useBottomSheetBackHandler } from "../../lib/hooks/useBottomSheetBackHandler";
import { trpc } from "../../utils/trpc";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { addFeedLinkAtom } from "./AddFeedRefContext";
import { Backdrop } from "./Backdrop";

export const AddFeedSheet = ({
  addFeedModalRef,
}: {
  addFeedModalRef: RefObject<BottomSheetModalMethods>;
}) => {
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(addFeedModalRef);

  const handleSheetChanges = useCallback((index: number) => {
    handleSheetPositionChange(index);
  }, []);

  const utils = trpc.useUtils();

  const [link, setLink] = useAtom(addFeedLinkAtom);
  const [rename, setRename] = useState<string | undefined>(undefined);
  const [folderName, setFolderName] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErorr] = useState<string | undefined>();

  const { previewFeed, folders } = useCheckSource(link!);

  const snapPoints = useMemo(() => ["65"], []);

  const addFeedToUserViaDiscovery =
    trpc.feed.addFeedToUserViaDiscovery.useMutation();

  const addFeed = async () => {
    try {
      // TODO: Their might still be a bug in here where it adds double feeds

      const title = rename ?? previewFeed?.title;
      const folder = folderName! ?? folders?.[0]!;

      await addFeedToUserViaDiscovery.mutateAsync(
        {
          feed_url: previewFeed?.link!,
          folder_name: folder,
          customTitle: title,
        },
        {
          onSuccess: () => {
            utils.feed.getFeedsInFolders.invalidate();
            utils.item.getUnreadItems.invalidate();
          },
        },
      );

      setIsLoading(false);
    } catch {
      setErorr(error);
    } finally {
      addFeedModalRef.current?.close();
      Keyboard.dismiss();

      // Reset everything for the next feed
      setLink(undefined);
      setRename(undefined);
      setFolderName(undefined);
    }
  };

  return (
    <BottomSheetModal
      index={0}
      ref={addFeedModalRef}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      bottomInset={300}
      detached
      animateOnMount
      enableDynamicSizing
      onChange={handleSheetChanges}
      onDismiss={() => {
        addFeedModalRef.current?.dismiss();
        setLink(undefined);
        setRename(undefined);
        setFolderName(undefined);
      }}
      enableDismissOnClose={false}
      keyboardBlurBehavior="none"
      backgroundStyle={{ borderRadius: 10 }}
      contentHeight={previewFeed ? 300 : 175}
      style={{
        ...styles.addFeedContainer,
      }}
      handleComponent={null}
    >
      <BottomSheetView>
        <Text className="mb-4 mt-2.5 text-center text-lg font-medium">
          Add New Feed
        </Text>
        <View className="mx-3.5 rounded-md border border-neutral-200 bg-[#FCFCFC] px-2 py-3">
          <BottomSheetTextInput
            onChangeText={(e) => setLink(e)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            defaultValue={link}
            placeholder="RSS or Atom Link"
            style={{ fontSize: 16 }}
          />
        </View>
        {previewFeed ? (
          <View className="mx-3.5 mt-4 flex w-full flex-row">
            {previewFeed ? (
              <View className="h-24 w-24 rounded-md border border-neutral-200 bg-[#FCFCFC] p-2">
                <Image className="h-full w-full" source={previewFeed.favicon} />
              </View>
            ) : (
              <View className="h-24 w-24 rounded-md border border-neutral-200 bg-[#FCFCFC]" />
            )}
            <View className="flex flex-col">
              <View className="ml-3 flex h-11 w-[218px] justify-center rounded-md border border-neutral-200/80 bg-neutral-50">
                <BottomSheetTextInput
                  onChangeText={(e) => setRename(e)}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  placeholder="Title"
                  defaultValue={previewFeed?.title}
                  style={{ fontSize: 16, paddingLeft: 8 }}
                />
              </View>
              <View className="mt-2">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <TouchableOpacity className="ml-3 flex h-11 w-[218px] justify-center rounded-md border border-neutral-200 bg-[#FCFCFC] px-2">
                      <Text className="text-base text-[#a3a3a3]/50">
                        {folders?.[0]!}
                      </Text>
                    </TouchableOpacity>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      onSelect={() => setFolderName(folderName?.[0])}
                      key={folders?.[0]!}
                    >
                      <DropdownMenu.ItemTitle>
                        {folders?.[0]!}
                      </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Sub>
                      {folders?.map((folderName, i) => (
                        <DropdownMenu.Item
                          onSelect={() => setFolderName(folders?.[i])}
                          key={folders?.[i]!}
                        >
                          <DropdownMenu.ItemTitle>
                            {folders?.[i]!}
                          </DropdownMenu.ItemTitle>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Sub>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </View>
            </View>
          </View>
        ) : null}
        {previewFeed && !isLoading ? (
          <TouchableOpacity
            onPress={() => {
              addFeed();
              setIsLoading(true);
            }}
            className="mx-3.5 mb-4 mt-4 flex h-11 justify-center rounded-md bg-sky-500"
          >
            <Text className="text-center text-lg font-medium text-white">
              Add Feed
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            className={`${!isLoading && "mb-4"} mx-3.5 mt-4 flex h-11 justify-center rounded-md bg-sky-500/50`}
          >
            <Text className="text-center text-lg font-medium text-white">
              Add Feed
            </Text>
          </View>
        )}
      </BottomSheetView>
      {isLoading && (
        <Text className="my-3 text-center text-base text-neutral-450">
          Loading Feed...
        </Text>
      )}
      {isLoading && error && (
        <Text className="my-3 text-center text-base text-neutral-450">
          {error}
        </Text>
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AddFeedContainer: {
    flex: 1,
    padding: 24,
  },
  addFeedContainer: {
    elevation: 24,
    marginHorizontal: 8,
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#BDBDBD",
    backgroundColor: "transparent",
  },
});
