interface Props {
  icon: React.ReactNode;
  onClick?: () => void;
}
const DateSliderBtn = ({ icon, onClick }: Props) => {
  return (
    <button
      className='h-[42px] max-w-[25px] w-full flex items-center  max-lg:hidden justify-center rounded border-border   bg-card hover:bg-hover  transition duration-200'
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default DateSliderBtn;
