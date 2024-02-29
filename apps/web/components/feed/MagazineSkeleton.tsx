import { ThemedSkeleton } from "../ui/Skeleton";

export const MagazineSkeleton = ({ i }: { i: number }) => {
  return (
    <>
      <DateInfoSkelton i={i} />
      <div className="relative mx-1 mt-1 flex cursor-pointer flex-row space-x-[4px] rounded-md pb-2 pt-2">
        <ImageSkelton />
        <div className="flex w-full flex-col pl-2">
          <TitleSkelton />
          <FeedInfoSkelton />
        </div>
      </div>
    </>
  );
};

const DateInfoSkelton = ({ i }: { i: number }) => (
  <>{i == 0 && <ThemedSkeleton width={50} className="ml-5 mt-4" />}</>
);

const ImageSkelton = () => (
  <div
    className={`
        relative top-0 mb-3 ml-2 mr-1.5 h-20 w-[175px] rounded-md`}
  >
    <ThemedSkeleton className="h-full w-full" />
  </div>
);

const TitleSkelton = () => <ThemedSkeleton className="w-9/12 pb-1.5 pl-2" />;

const SummarySkelton = () => <ThemedSkeleton count={1} className="w-fit" />;

const FeedInfoSkelton = () => (
  <>
    <div className="flex flex-row">
      <ThemedSkeleton width={80} className="" />
    </div>
    <SummarySkelton />
  </>
);
