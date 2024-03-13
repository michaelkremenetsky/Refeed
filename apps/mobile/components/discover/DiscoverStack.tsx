import { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSetAtom } from "jotai";
import { Plus } from "lucide-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { HeaderButtonIcon } from "../reader/Header/HeaderButtonIcon";
import { addFeedLinkAtom, AddFeedRefContext } from "../sheet/AddFeedRefContext";
import { Discover } from "./DiscoverLayout";

const Stack = createNativeStackNavigator();

export const DiscoverStack = () => {
  const opener = useContext(AddFeedRefContext);
  const setLink = useSetAtom(addFeedLinkAtom);
  const setTitle = useSetAtom(addFeedLinkAtom);

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: "#fcfcfc",
        },
      }}
    >
      <Stack.Screen
        name="DiscoverStack"
        options={{
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
              <Item
                title="search"
                iconName="search"
                onPress={() => {
                  // @ts-ignore
                  opener.current?.expand();
                  opener?.current?.present();
                  setLink(undefined);
                  setTitle(undefined);
                }}
                IconComponent={() => (
                  <TouchableOpacity>
                    <Plus strokeWidth={1.5} stroke="#a3a3a3" />
                  </TouchableOpacity>
                )}
              />
            </HeaderButtons>
          ),
          headerShadowVisible: false,
          headerTitle: "Discover",
          headerStyle: {
            backgroundColor: "#fafafa",
          },
        }}
        component={Discover}
      />
    </Stack.Navigator>
  );
};
