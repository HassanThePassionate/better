import { cn } from "@/lib/utils";

interface Props {
  path?: string;
  title?: string;
  className?: string;
  imageClassName?: string;
}
const TabCardHeading = ({ path, title, className, imageClassName }: Props) => {
  return (
    <>
      <h2
        className={cn(
          "text-2xl font-semibold flex items-center gap-3 text-text pr-7",
          className
        )}
      >
        <img
          aria-label='Favicon'
          className={cn(
            "w-[32px] h-[32px] flex-none rounded overflow-hidden mr-2",
            imageClassName
          )}
          src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${path}/&size=32`}
        />
        <span className='max-w-[186px] truncate text-text'>{title}</span>
      </h2>
    </>
  );
};

export default TabCardHeading;
