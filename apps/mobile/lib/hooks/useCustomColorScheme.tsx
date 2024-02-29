import { useEffect, useRef, useState } from "react";
import type { ColorSchemeName } from "react-native";
import { Appearance } from "react-native";

export default function useCustomColorScheme(
  delay = 500,
): NonNullable<ColorSchemeName> {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  let timeout = useRef<NodeJS.Timeout | null>(null).current;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(onColorSchemeChange);

    return () => {
      resetCurrentTimeout();
      subscription.remove();
    };
  }, []);

  function onColorSchemeChange(preferences: Appearance.AppearancePreferences) {
    resetCurrentTimeout();

    timeout = setTimeout(() => {
      setColorScheme(preferences.colorScheme);
    }, delay);
  }

  function resetCurrentTimeout() {
    if (timeout) {
      clearTimeout(timeout);
    }
  }

  // Temp Stub as dark mode switching is too buggy for now
  return "light";

  return colorScheme!;
}
