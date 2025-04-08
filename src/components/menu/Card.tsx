interface Props {
  children: React.ReactNode;
}
const Card = ({ children }: Props) => {
  return (
    <div className=' py-4 bg-input border border-border rounded-lg mt-4 px-4'>
      {children}
    </div>
  );
};

export default Card;
