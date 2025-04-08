import Heading from "./Heading";

import Stepper from "./Stepper";

import StepContent from "./StepContent";
import { FormProvider } from "@/context/from-Context";

const AddNewCard = () => {
  return (
    <FormProvider>
      <div className='flex items-center flex-col  justify-center relative mx-2 '>
        <div className='w-full   '>
          <Heading />
          <div className='flex flex-col gap-6 sm:gap-8 overflow-hidden sm:overflow-visible'>
            <Stepper />
            <StepContent />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AddNewCard;
