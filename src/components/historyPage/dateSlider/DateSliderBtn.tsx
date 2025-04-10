interface Props {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
const DateSliderBtn = ({ icon, onClick, disabled }: Props) => {
  return (
    <button
      disabled={disabled}
      className='h-[42px] max-w-[25px] w-full flex items-center  max-lg:hidden justify-center rounded border-border   bg-card hover:bg-hover  transition duration-200'
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default DateSliderBtn;
