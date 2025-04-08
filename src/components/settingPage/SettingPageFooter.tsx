import DocumentationIcon from "../svgs/DocumentationIcon";
import { DialogClose } from "../ui/dialog";

const SettingPageFooter = () => {
  return (
    <div className=' mt-auto flex items-center justify-end gap-x-3 border-t border-border  px-4 py-4 sm:px-8'>
      <a href='#' className='flex gap-2 items-center'>
        <DocumentationIcon />
        Docs
      </a>
      <DialogClose asChild>
        <button className='btn secondary ml-auto inline-flex rounded '>
          Done
        </button>
      </DialogClose>
    </div>
  );
};

export default SettingPageFooter;
