import { PlusIcon } from "../svgs/PlusIcon";
import DialogBox from "../../modals/DialogBox";
import AddNewCard from "../addNewCard/AddNewCard";
import Button from "../ui/my-button";

const AddNewCardBtn = () => {
  return (
    <DialogBox
      className='w-full !rounded-[32px] bg-background max-w-[600px]  p-6  '
      trigger={
        <Button className='h-[40px] shadow-none'>
          <PlusIcon className='h-5 w-5 text-text mr-2' />
          New
        </Button>
      }
    >
      <AddNewCard />
    </DialogBox>
  );
};

export default AddNewCardBtn;
