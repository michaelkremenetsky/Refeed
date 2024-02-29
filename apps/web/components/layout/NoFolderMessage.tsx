import { DialogTrigger } from "components/ui/Dialog";
import Balancer from "react-wrap-balancer";

export const NoFoldersMessage = ({ show }: { show: boolean }) => {
  if (show) {
    return (
      <div className="mx-auto mr-3 mt-3 flex flex-col justify-center rounded-md">
        <div className="flex-grow" />
        <h1 className="mx-auto mb-1.5 text-center text-sm font-[550] tracking-wide ">
          No Folders
        </h1>
        <Balancer className="mx-auto px-4 text-center text-sm text-neutral-500">
          To get started create a folder to put your feeds in.
        </Balancer>
        <DialogTrigger className="mb-3 mr-2 mt-1 rounded-md py-1.5 font-medium tracking-tight text-sky-500">
          + Add Folder
        </DialogTrigger>
      </div>
    );
  }
};
