import type { ImageStyle } from "expo-image";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { Dimensions, Text as RegularText } from "react-native";
import type { RendererInterface } from "react-native-marked";
import { Renderer } from "react-native-marked";

import { openWeb } from "../../lib/openWeb";
import { Text } from "../ui/Text";
import { View } from "../ui/View";

const width = Dimensions.get("window").width;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

// @ts-ignore
class CustomRenderer extends Renderer implements RendererInterface {
  constructor() {
    super();
  }
  html(): ReactNode {
    // For now
    return null;
  }
  link(
    children: string | ReactNode[],
    href: string,
    styles?: TextStyle,
  ): ReactNode {
    return (
      <RegularText
        selectable
        accessibilityRole="link"
        accessibilityHint="Opens in a new window"
        key={this.getKey()}
        onPress={() => {
          openWeb(href);
        }}
        style={[styles, { borderBottomWidth: 10, paddingBottom: 4 }]}
      >
        {children}
      </RegularText>
    );
  }
  image(uri: string, _alt?: string, _style?: ImageStyle): ReactNode {
    return (
      <Image
        key={this.getKey()}
        source={{ uri: uri }}
        placeholder={blurhash}
        style={{ borderRadius: 0 }}
        className={`h-[200px] w-[${width}]}`}
      />
    );
  }
  getTextNode(children: string | ReactNode[], styles?: TextStyle): ReactNode {
    if (children != " " && children != "" && children != "\n") {
      return (
        <Text selectable key={this.getKey()} style={styles}>
          {children}
        </Text>
      );
    } else {
      return null;
    }
  }
  getViewNode(children: ReactNode[] | null, styles?: ViewStyle): ReactNode {
    // Check if the children has is any array of nulls like [null, null, null, null]
    const check = children?.filter((child) => child !== null);

    if (check != null && check.length > 0) {
      return (
        <View key={this.getKey()} style={styles}>
          {children}
        </View>
      );
    } else {
      return null;
    }
  }
  getBlockquoteNode(children: ReactNode[], styles?: ViewStyle): ReactNode {
    {
      return (
        <View key={this.getKey()} style={styles}>
          {children}
        </View>
      );
    }
  }
}

export const markdownRenderer = new CustomRenderer();
