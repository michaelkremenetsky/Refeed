import { AccountSettingsPage } from "../pages/Account";
import { BookmarksSettingsPage } from "../pages/Bookmarks";
import { FeedsSettingsPage } from "../pages/Feeds";
import { GeneralSettingsPage } from "../pages/General";
import { SharingSettingsPage } from "../pages/Sharing";
import { SettingsMenuButtons } from "./SettingsMenuButtons";

interface SettingsProps {
  page: string;
}

const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  return (
    <div className="flex">
      <div className="sticky top-0 flex h-screen flex-col border-r bg-[#F6F6F6]/60">
        <div className="mx-2 mt-4 flex flex-row pl-2">
          <div className="flex-basis-1/4">
            <SettingsMenuButtons name="general" />
            <SettingsMenuButtons name="appearance" />
            <SettingsMenuButtons name="feeds" />
            <SettingsMenuButtons name="sharing" />
            <SettingsMenuButtons name="bookmarks" />
            <SettingsMenuButtons name="account" />
            <SettingsMenuButtons name="billing" />
            <SettingsMenuButtons name="integrations" />
          </div>
        </div>
      </div>
      <div className="grow"></div>
      <div className="mx-8 w-[1000px] overflow-hidden">
        {props.page == "general" && <GeneralSettingsPage />}
        {props.page == "sharing" && <SharingSettingsPage />}
        {props.page == "bookmarks" && <BookmarksSettingsPage />}
        {props.page == "account" && <AccountSettingsPage />}
        {props.page == "feeds" && <FeedsSettingsPage />}
      </div>
      <div className="grow"></div>
    </div>
  );
};

export default Settings;
