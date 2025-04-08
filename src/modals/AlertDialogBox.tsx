import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import React from "react";
import WarningIcon from "../components/svgs/WarningIcon";
import Bin from "../components/svgs/Bin";
import {
  AlertDialogAction,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";
import { DialogClose } from "@/components/ui/dialog";

interface Props {
  className?: string;
  allowText?: boolean;
  disabled?: boolean;
  trigger?: React.ReactNode;
  onClick?: () => void;
  isDialogBtn?: boolean;
}
const AlertDialogBox = ({
  className,
  allowText,
  disabled,
  trigger,
  onClick,
  isDialogBtn,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          "px-4 py-2 text-sm text-foreground  hover:text-text",
          className
        )}
        disabled={disabled}
      >
        {trigger ? (
          trigger
        ) : (
          <>
            <Bin />
            {allowText && "Delete"}
          </>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-lg border-none transform overflow-hidden rounded-md bg-card  p-6 text-left shadow-xl transition-all sm:my-8 w-full sm:p-6'>
        <AlertDialogHeader>
          <AlertDialogTitle className='pb-4'>
            <div className='flex flex-col gap-4'>
              <WarningIcon />
              <h3
                className='text-lg font-semibold leading-6 text-text tracking-tight'
                id='modal-title'
              >
                Are you absolutely sure?
              </h3>
            </div>
            <div className='mt-2'>
              <p className='text-[15px] font-normal text-foreground '>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t -mx-6 -mb-6 px-6 py-5'>
          <AlertDialogCancel className='btn  secondary sm:mt-0 sm:w-auto mt-3 inline-flex w-full justify-center   text-text  px-6  border border-border py-2 h-[36px] bg-card  hover:bg-hover rounded'>
            Cancel
          </AlertDialogCancel>
          {isDialogBtn ? (
            <DialogClose
              className='inline-flex w-full justify-center gap-x-2 bg-error rounded  px-4 py-2 text-sm font-semibold !text-text-primary shadow-sm  hover:opacity-80 sm:ml-3 sm:w-auto h-[36px] border-transparent'
              onClick={onClick}
            >
              <Bin />
              Continue
            </DialogClose>
          ) : (
            <AlertDialogAction
              className='inline-flex w-full justify-center gap-x-2 bg-error rounded  px-4 py-2 text-sm font-semibold !text-text-primary shadow-sm bg-red-500 hover:opacity-80 sm:ml-3 sm:w-auto h-[36px] border-transparent'
              onClick={onClick}
            >
              <Bin />
              Continue
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogBox;
