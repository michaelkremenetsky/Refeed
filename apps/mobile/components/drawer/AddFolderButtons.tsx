import { TouchableOpacity } from "react-native-gesture-handler";

import { useAddFolder } from "../../features/useAddFolder";
import { Text } from "../ui/Text";

export const AddFolderButtonGray = () => {
  const { addFolder } = useAddFolder();

  return (
    <TouchableOpacity onPress={() => addFolder()}>
      <Text className="mb-6 ml-4 mt-1 text-base text-neutral-500">
        + Add Folder
      </Text>
    </TouchableOpacity>
  );
};

export const AddFolderButtonBlue = () => {
  const { addFolder } = useAddFolder();

  return (
    <TouchableOpacity onPress={() => addFolder()}>
      <Text
        className={`mb-3 mt-1 rounded-md py-1.5 text-center text-[16px] font-medium tracking-tight text-[#0496FF]`}
      >
        Add Folder
      </Text>
    </TouchableOpacity>
  );
};
