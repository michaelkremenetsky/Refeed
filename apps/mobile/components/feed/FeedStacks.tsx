import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { StackIcon } from "../../lib/Icons";
import type { NavigatorParams } from "../../lib/navTypes";
import { HeaderButtonIcon } from "../reader/Header/HeaderButtonIcon";
import { Text } from "../ui/Text";
import { Dropdown } from "./FeedDropDown";
import { BookmarkLayout, FeedLayout } from "./FeedLayout";

const Stack = createNativeStackNavigator<NavigatorParams>();

const Header = {
  headerStyle: {
    backgroundColor: "#FEFEFE",
  },
  headerShadowVisible: false,
  headerTitle: (props: any) => (
    <Text className="text-base font-semibold" {...props} />
  ),
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
      <Item
        title="dropdown"
        iconName="dropdown"
        className="translate-x-4"
        IconComponent={Dropdown}
      />
    </HeaderButtons>
  ),
};

export const FeedStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Feed"
        initialParams={{ type: "all" }}
        options={{
          ...Header,
          headerLeft: () => (
            <>
              <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
                <Item
                  title="drawer"
                  iconName="drawer"
                  IconComponent={StackIcon}
                  onPress={() => {
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}
                />
              </HeaderButtons>
            </>
          ),
        }}
        component={FeedLayout}
      />
    </Stack.Navigator>
  );
};

export const BookmarkStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Bookmark"
        initialParams={{ type: "bookmarks" }}
        options={{
          title: "Bookmarks",
          ...Header,
          headerLeft: () => (
            <>
              <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
                <Item
                  title="drawer"
                  iconName="drawer"
                  IconComponent={StackIcon}
                  onPress={() => {
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}
                />
              </HeaderButtons>
            </>
          ),
        }}
        component={BookmarkLayout}
      />
    </Stack.Navigator>
  );
};
