import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Defs, G, Image, Pattern, Rect, Use } from "react-native-svg";

const Empty = (props: SvgProps) => (
  <Svg width={276} height={230} fill="none" {...props}>
    <G filter="url(#a)">
      <Rect x={69.284} y={5} width={141} height={116} rx={7} fill="#fff" />
      <Rect
        x={69.284}
        y={5}
        width={141}
        height={116}
        rx={7}
        fill="url(#b)"
        fillOpacity={0.1}
      />
      <Rect
        x={68.784}
        y={4.5}
        width={142}
        height={117}
        rx={7.5}
        stroke="#d4d4d4"
        strokeOpacity={0.9}
      />
    </G>
    <G filter="url(#c)">
      <Rect
        x={152.342}
        y={40}
        width={119.562}
        height={116.132}
        rx={7}
        transform="rotate(15 152.342 40)"
        fill="#fff"
      />
      <Rect
        x={152.342}
        y={40}
        width={119.562}
        height={116.132}
        rx={7}
        transform="rotate(15 152.342 40)"
        fill="url(#d)"
        fillOpacity={0.1}
      />
      <Rect
        x={151.988}
        y={39.388}
        width={120.562}
        height={117.132}
        rx={7.5}
        transform="rotate(15 151.988 39.388)"
        stroke="#d4d4d4"
        strokeOpacity={0.9}
      />
    </G>
    <G filter="url(#e)">
      <Rect
        x={8}
        y={72.433}
        width={165}
        height={106.936}
        rx={7}
        transform="rotate(-20 8 72.433)"
        fill="#fff"
      />
      <Rect
        x={8}
        y={72.433}
        width={165}
        height={106.936}
        rx={7}
        transform="rotate(-20 8 72.433)"
        fill="url(#f)"
        fillOpacity={0.1}
      />
      <Rect
        x={7.359}
        y={72.135}
        width={166}
        height={107.936}
        rx={7.5}
        transform="rotate(-20 7.36 72.135)"
        stroke="#d4d4d4"
        strokeOpacity={0.9}
      />
    </G>
    <G filter="url(#g)">
      <Rect x={35.284} y={72} width={204} height={145} rx={7} fill="#fff" />
      <Rect
        x={35.284}
        y={72}
        width={204}
        height={145}
        rx={7}
        fill="url(#h)"
        fillOpacity={0.1}
      />
      <Rect
        x={34.784}
        y={71.5}
        width={205}
        height={146}
        rx={7.5}
        stroke="#d4d4d4"
        strokeOpacity={0.9}
      />
    </G>
    <Defs>
      <Pattern
        id="b"
        patternContentUnits="objectBoundingBox"
        width={0.085}
        height={0.103}
      >
        <Use xlinkHref="#i" transform="scale(.0071 .00862)" />
      </Pattern>
      <Pattern
        id="d"
        patternContentUnits="objectBoundingBox"
        width={0.1}
        height={0.103}
      >
        <Use xlinkHref="#i" transform="scale(.00836 .00861)" />
      </Pattern>
      <Pattern
        id="f"
        patternContentUnits="objectBoundingBox"
        width={0.073}
        height={0.112}
      >
        <Use xlinkHref="#i" transform="scale(.00606 .00935)" />
      </Pattern>
      <Pattern
        id="h"
        patternContentUnits="objectBoundingBox"
        width={0.059}
        height={0.083}
      >
        <Use xlinkHref="#i" transform="scale(.0049 .0069)" />
      </Pattern>
      <Image
        id="i"
        width={12}
        height={12}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA6SURBVHgB7dE7EQAwCANQ8BdP4KetuCjoBwWwdYA7tpcsUUkcBl1U7L6nMCY3Fq3xJzgCBRyLV/ArPzZpWF7OZr6oAAAAAElFTkSuQmCC"
      />
    </Defs>
  </Svg>
);

export default Empty;
