import { usePageContext } from "@/context/PageContext";
import SelectFolder from "./SelectFolder";

const AddNew = () => {
  const { page } = usePageContext();
  const isExtensionsPage = page === "extensions";
  return (
    <div className=' flex items-center justify-center  '>
      <div className='w-full relative'>
        <h2 className=' text-text font-semibold text-lg pb-2'>
          {isExtensionsPage
            ? "Add Group to Extensions bar"
            : " Add Folder to Bookmarks bar"}
        </h2>
        <div className=' flex flex-col mt-4'>
          <label
            htmlFor='name'
            className='text-text font-semibold text-sm mb-4'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='title'
            required
            placeholder={
              isExtensionsPage ? "Enter group name" : "Enter folder name"
            }
            className='flex h-12 w-full rounded border bg-transparent px-3 py-3 text-base transition-colors focus-visible:outline-none input  md:text-sm border-border  text-text'
          />
        </div>
        <label
          htmlFor='name'
          className='text-text font-semibold text-sm mb-4 mt-6 block'
        >
          {isExtensionsPage ? "Groups" : "Parent Folder"}
        </label>
        <SelectFolder popoverClassName='max-w-[500px] bg-white' />

        <div className='py-2 flex justify-end'>
          <button className='btn rounded mt-2 '>
            {isExtensionsPage ? "Add Group" : "Add Folder"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
