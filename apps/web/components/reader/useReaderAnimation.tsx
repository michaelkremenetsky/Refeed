import { useEffect, useState } from "react";
import { SideBarWidth } from "@components/layout/SideBar";
import { fullscreenAtom } from "@components/reader/Reader";
import useWindowSize from "@lib/useWindowSize";
import { useAtom, useAtomValue } from "jotai";

import { settingsAtom } from "../../stores/settings";

export const useReaderAnimation = () => {
  const settings = useAtomValue(settingsAtom);
  const [fullscreen, setFullscren] = useAtom(fullscreenAtom);

  useEffect(() => {
    setFullscren(settings.OpenReaderInFullScreenByDefault);
  }, [settings.OpenReaderInFullScreenByDefault]);

  const width = useAtomValue(SideBarWidth);
  const { width: screenWidth } = useWindowSize();

  const [prevFull, setPrevFull] = useState(fullscreen);

  // Calculate the full screen percentage
  const fullScreenWidthPercent = ((screenWidth! - width) / screenWidth!) * 100;
  const widthStyle = fullscreen
    ? { width: `${fullScreenWidthPercent}%` }
    : undefined;

  // Checks if the transtion was caused by a change in `full`.
  // Any other change will not trigger a transition.
  useEffect(() => {
    setPrevFull(fullscreen);
  }, [fullscreen]);

  // Determine transition duration based on change in `full`
  const transitionDuration = fullscreen !== prevFull ? 0.2 : 0;

  return { fullscreen, widthStyle, transitionDuration };
};
