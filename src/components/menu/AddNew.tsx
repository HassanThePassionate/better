"use client";

import { Globe, Loader2 } from "lucide-react";
import CrossIcon from "../svgs/CrossIcon";
import { Button } from "@/components/ui/button";
import { useMenu } from "@/context/MenuContext";

const AddNew = () => {
  const {
    formValues,
    handleFormSubmit,
    handleFormChange,
    addFavorite,
    handleCloseDropdown,
    loading
  } = useMenu();

  return (
    <>
      <div className='fixed top-0 left-0 h-full w-full bg-black/40'></div>
      <form
        onSubmit={handleFormSubmit}
        className='flex rounded-[32px] p-6 py-8 shadow-sm  border border-border flex-col gap-4 bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px]'
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='url' className='text-sm font-medium'>
            URL
          </label>
          <div className='input flex items-center gap-2 justify-between rounded-sm'>
          <div className="flex items-center gap-2 w-full">
          <Globe />
            <input
              type='text'
              name='url'
              id='url'
              value={formValues.url}
              onChange={handleFormChange}
              placeholder='www...'
              className='bg-transparent w-full outline-none ml-2'
            />
          </div>
          {loading && <span className="animate-spin"><Loader2 size={20}/></span>}
        
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='caption' className='text-sm font-medium'>
            Caption
          </label>
          <input
            type='text'
            name='caption'
            id='caption'
            value={formValues.caption}
            onChange={handleFormChange}
            placeholder='Site...'
            className='w-full outline-none input focus:ring-1 focus:ring-border'
          />
        </div>

        <Button
          className='mt-1 btn bg-text text-card hover:!bg-text hover:opacity-90 '
          type='submit'
          onClick={addFavorite}
        >
          Add
        </Button>

        <span
          className='absolute top-3 right-4 h-7 w-7  cursor-pointer flex items-center justify-center bg-badge hover:bg-hover border border-border rounded-full  transition focus:outline-none focus:ring-2 focus:ring-ring  focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-card data-[state=open]:text-muted-foreground'
          onClick={handleCloseDropdown}
        >
          <CrossIcon />
        </span>
      </form>
    </>
  );
};

export default AddNew;
