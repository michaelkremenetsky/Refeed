import { useEffect } from "react";

import { trpc } from "../../utils/trpc";

const usePrefetchSettings = () => {
  const utils = trpc.useUtils();

  useEffect(() => {
    utils.settings.getShareProviders.prefetch();
  }, []);

  return utils;
};

export default usePrefetchSettings;
