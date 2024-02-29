export const LandingButton = (props: { children: string }) => {
  return (
    <button className="rounded-md border border-[#DCDCDC] bg-white px-4 py-1.5 text-base font-medium shadow-[0_1px_2px_rgba(16,29,52,.15)] hover:bg-[#fafafa]">
      {props.children}
    </button>
  );
};
