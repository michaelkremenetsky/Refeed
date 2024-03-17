import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import Animated from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import type { LucideIcon } from "lucide-react-native";
import { Clock, Folder } from "lucide-react-native";

import { useUpgrade } from "../../features/useUpgrade";
import { FeedGraphic, TimedFeedGraphic } from "../graphics/FeedGraphic";
import { ModalClose } from "../reader/Header/ModalCloseButton";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { PlanSelectButton } from "./PlanSelectButton";

export default function Upgrade() {
  const { packages } = useUpgrade();

  const renderBackdrop = useCallback(
    (props_: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props_}
        pressBehavior="close"
        opacity={0.25}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const [plan, setPlan] = useState<"Monthly" | "Yearly">("Yearly");
  const planModalRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  return (
    <SafeAreaView className="h-full">
      <View className="flex h-full flex-col justify-between">
        {Platform.OS == "ios" && (
          <ModalClose type="Navigation" navigation={navigation} />
        )}

        <Text className="mb-4 mt-28 text-center text-4xl font-bold">
          Refeed Pro
        </Text>
        <FeaturesCarousel />

        <View className="my-auto" />
        <Animated.View sharedTransitionTag="Button">
          <TouchableOpacity
            onPressOut={() => planModalRef.current?.present()}
            className="mx-6 mb-4 mt-2 rounded-lg bg-[#0A84FF] py-3"
          >
            <Text className="text-center text-base font-semibold text-white">
              Try Now Free
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <View className="my-auto" />

        {/** @ts-ignore */}
        <Text>{JSON.stringify(packages)?.product?.priceString}</Text>
      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          index={0}
          ref={planModalRef}
          snapPoints={[265]}
          backdropComponent={renderBackdrop}
          bottomInset={46}
          detached={true}
          style={styles.sheetContainer}
          handleComponent={null}
        >
          <BottomSheetView style={styles.container}>
            <View className="mt-3">
              <PlanSelectButton
                setPlan={setPlan}
                selected={plan == "Yearly"}
                plan="Yearly"
              />
              <PlanSelectButton
                setPlan={setPlan}
                selected={plan == "Monthly"}
                plan="Monthly"
              />
              <TouchableOpacity
                onPress={() => {
                  Purchases.purchaseProduct("pro_monthly");
                }}
                className="mx-4 mt-6 rounded-lg bg-[#0A84FF] py-3"
              >
                <Text className="text-center text-base font-semibold text-white">
                  Subscribe
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const FeaturesCarousel = () => {
  const width = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 1.2}
        autoPlay={true}
        data={[...new Array(3).keys()]}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View className="mt-28 flex items-center justify-center">
              {index == 0 ? (
                <>
                  <FeedGraphic />
                  <Features
                    svg={Folder}
                    svgStroke="#C566FF"
                    feature="Bookmark Folders"
                    details="Organize your Bookmarks to into Folders"
                  />
                </>
              ) : index == 1 ? (
                <>
                  <TimedFeedGraphic />
                  <Features
                    svg={Clock}
                    svgStroke="#0998FF"
                    feature="Timed Bookmarks"
                    details="Add Bookmarks that disappear after a preset time"
                  />
                </>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const Features = (props: {
  svg: LucideIcon;
  svgStroke: string;
  feature: string;
  details: string;
}) => {
  return (
    <View className="ml-8 mr-10 mt-6 flex w-9/12 flex-row">
      <View className="mt-2">
        <props.svg opacity={0.9} stroke={props.svgStroke} />
      </View>
      <View className="ml-4 flex flex-col">
        <Text className="text-base font-semibold">{props.feature}</Text>
        <Text className="text-base text-neutral-500">{props.details}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetContainer: {
    marginHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F2F1F6",
    borderColor: "#BDBDBD",
    borderWidth: 0.65,
  },
});
