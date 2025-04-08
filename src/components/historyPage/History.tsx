import ActionsBtns from "./ActionsBtns";
import DateSlider from "./dateSlider/DateSlider";
import HoursBalls from "./HoursBalls";

const History = () => {
  return (
    <>
      <div className='max-lg:pl-[100px] max-sm:pl-[80px] max-lg:pr-4 max-lg:pt-4'>
        <DateSlider />
        <HoursBalls />
        <ActionsBtns />
      </div>
    </>
  );
};

export default History;
