import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import WarnIcon from "../components/svgs/WarnIcon";
import RenameIcon from "../components/svgs/RenameIcon";

const NoTagAlertBox = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='btn secondary rounded flex items-center gap-2'>
        <RenameIcon />
        Rename Tag
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-lg gap-0 transform overflow-hidden rounded-md bg-card  px-4 pb-4 pt-5 text-left shadow-xl dark:shadow-black/90 transition-all sm:my-8 w-full sm:p-6'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <h2 className='mb-6 text-xl'>Rename Tag</h2>
            <div className='mb-6'>
              <div className='rounded-md p-4 bg-warn border border-warn-border '>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <WarnIcon />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-text'>
                      There are no tags to rename.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex gap-3 mt-2 items-center justify-end'>
          <AlertDialogCancel className='btn secondary'>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NoTagAlertBox;
