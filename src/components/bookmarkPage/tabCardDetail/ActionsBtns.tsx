import AlertDialogBox from "@/modals/AlertDialogBox";
import DialogBox from "@/modals/DialogBox";
import Copy from "@/components/svgs/Copy";
import Edit from "@/components/svgs/Edit";

import { useBookmarks } from "@/context/BookmarkContext";

import EditBookmark from "@/pages/EditBookmark";
import { Card } from "@/types/TabCardType";

import { toast } from "react-toastify";
import { copyToClipboard } from "@/lib/handle-copy";
import SettingIcon from "@/components/svgs/SettingIcon";
import { usePageContext } from "@/context/PageContext";
import { MdOutlineHome } from "react-icons/md";
interface Props {
  activeTabData?: Card | undefined;
}
const ActionsBtns = ({ activeTabData }: Props) => {
  const { deleteCard, setShowCardDetail } = useBookmarks();
  const { path, id } = activeTabData ?? {};
  const handleCopy = () => {
    copyToClipboard(
      path ?? "",
      () => toast.success("URL copied to clipboard!"),
      () => toast.error("URL is not copied")
    );
  };
  const handleDelete = () => {
    setShowCardDetail(false);
    deleteCard(id ? id : 0);
    toast.success("Bookmark Deleted");
  };
  const { page } = usePageContext();
  return (
    <div className='flex items-center justify-start gap-4'>
      <DialogBox
        className='!p-0 !rounded-[32px] bg-card max-w-[550px]  w-full '
        trigger={
          <button className='px-3  py-3 text-sm text-foreground rounded-[14px]  hover:text-text bg-badge flex items-center hover:opacity-80'>
            <Edit />
          </button>
        }
      >
        <EditBookmark activeTabData={activeTabData} />
      </DialogBox>
      {page !== "extensions" && (
        <button
          onClick={handleCopy}
          className='px-3  py-3 text-sm text-foreground rounded-[14px]  hover:text-text bg-badge flex items-center '
        >
          <Copy />
        </button>
      )}

      {page === "extensions" && (
        <>
          <button className='px-3  py-3 text-sm text-foreground rounded-[14px]  hover:text-text bg-badge flex items-center '>
            <SettingIcon />
          </button>
          <button className='px-3  py-3 text-sm text-foreground rounded-[14px]  hover:text-text bg-badge flex items-center '>
            <MdOutlineHome size={24} />
          </button>
        </>
      )}

      <AlertDialogBox
        className='px-3  py-3 text-sm text-foreground rounded-[14px]  hover:text-text bg-badge flex items-center'
        onClick={handleDelete}
      />
    </div>
  );
};

export default ActionsBtns;
