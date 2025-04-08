import { cn, useHandleDelete } from "@/lib/utils";
import CrossIcon from "./svgs/CrossIcon";
interface Props {
  id: number;
  text?: string;
  className?: string;
}
const DeleteEntry = ({ id, text, className }: Props) => {
  const handleDelete = useHandleDelete();

  const onDelete = () => {
    handleDelete(id, text);
  };
  return (
    <span
      className={cn(
        "sm:opacity-0 opacity-100 cursor-pointer  group-hover:opacity-100",
        className
      )}
      onClick={onDelete}
    >
      <CrossIcon />
    </span>
  );
};

export default DeleteEntry;
