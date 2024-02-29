import type { MotionProps } from "framer-motion";
import { m } from "framer-motion";

export function CMDKWrapper(
  props: MotionProps & { children: React.ReactNode },
) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        height: 475,
      }}
      {...props}
    />
  );
}
