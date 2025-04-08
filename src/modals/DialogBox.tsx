import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePageContext } from "@/context/PageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DialogBox = ({ trigger, children, className }: Props) => {
  const [open, setOpen] = useState(false);
  const { setDialogOpen } = usePageContext();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setDialogOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
        <DialogTrigger
          className='text-sm text-foreground hover:text-text transition-colors max-lg:self-baseline'
          onClick={() => setOpen(true)}
        >
          {trigger}
        </DialogTrigger>
        <DialogContent
          className={cn("!bg-background gap-0", className)}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogBox;
