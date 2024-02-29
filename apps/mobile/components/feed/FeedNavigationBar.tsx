import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

interface FeedNavigationBarTypes extends NativeStackHeaderProps {
  title?: string;
}

export function FeedNavigationBar({
  navigation,
  back,
  title,
}: FeedNavigationBarTypes) {
  return (
    <Appbar.Header elevated>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : navigation ? (
        <Appbar.Action
          icon="menu"
          isLeading
          onPress={() =>
            (
              navigation as any as DrawerNavigationProp<NonNullable<unknown>>
            ).openDrawer()
          }
        />
      ) : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
