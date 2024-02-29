import { Share } from "react-native";

export const openShareSheet = async (url: string) => {
  await Share.share({
    message: url,
  });
};
