import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { DialogClose } from "../ui/dialog";

interface Props {
  noprevbtn?: boolean;
  nextBtnClick?: () => void;
  showSaveBtn?: boolean;
  prevBtnClick?: () => void;
  loading?: boolean;
  handleCancel?: () => void;
}
const ActionBtns = ({
  noprevbtn,
  nextBtnClick,
  prevBtnClick,
  showSaveBtn,
  loading,
}: Props) => {
  return (
    <div className='flex items-center justify-end gap-x-6 border-t border-border  px-4 py-4 sm:px-8'>
      {!noprevbtn && (
        <button
          className='cancel-btn text-sm font-semibold rounded-sm flex items-center gap-x-1'
          onClick={prevBtnClick}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
      )}
      <div className='flex gap-3 ml-auto'>
        <DialogClose asChild>
          <button className='cancel-btn text-sm font-semibold rounded-sm'>
            Cancel
          </button>
        </DialogClose>

        <button
          className='done-btn text-sm font-semibold flex items-center gap-x-1 rounded-sm'
          onClick={nextBtnClick}
        >
          {showSaveBtn ? (
            <DialogClose
              className='flex items-center gap-1'
              style={{ color: "var(--text-text-primary)" }}
            >
              {loading && <Loader2 size={20} className='animate-spin' />}
              Save
            </DialogClose>
          ) : (
            <>
              Next
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionBtns;
