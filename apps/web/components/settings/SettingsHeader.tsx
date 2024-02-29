interface SettingsHeaderProps {
  title: string;
  subtitle: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = (
  props: SettingsHeaderProps,
) => {
  return (
    <div className="mt-4">
      <h1 className="select-none pb-1 text-[16px] font-[550] leading-5 tracking-[-0.01em]">
        {props.title}
      </h1>
    </div>
  );
};
