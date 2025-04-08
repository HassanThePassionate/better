const Stats = () => {
  return (
    <>
      <div className='flex items-center flex-col justify-center gap-2 h-full w-full  bg-card rounded-[16px] py-3 '>
        <div className='min-[1600px]:w-12 min-[1600px]:h-12 w-11 h-11 flex items-center justify-center rounded-full bg-green-200'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 11 12'
            fill='none'
          >
            <path
              d='M1.375 11.5C2.13125 11.5 2.75 10.8813 2.75 10.125V5.3125C2.75 4.55625 2.13125 3.9375 1.375 3.9375C0.61875 3.9375 0 4.55625 0 5.3125V10.125C0 10.8813 0.61875 11.5 1.375 11.5ZM8.25 8.0625V10.125C8.25 10.8813 8.86875 11.5 9.625 11.5C10.3813 11.5 11 10.8813 11 10.125V8.0625C11 7.30625 10.3813 6.6875 9.625 6.6875C8.86875 6.6875 8.25 7.30625 8.25 8.0625ZM5.5 11.5C6.25625 11.5 6.875 10.8813 6.875 10.125V1.875C6.875 1.11875 6.25625 0.5 5.5 0.5C4.74375 0.5 4.125 1.11875 4.125 1.875V10.125C4.125 10.8813 4.74375 11.5 5.5 11.5Z'
              fill='#2A9D8F'
            ></path>
          </svg>
        </div>
        <h2 className='font-medium min-[1600px]:text-[17px] text-base'>
          23.00
        </h2>
      </div>
    </>
  );
};

export default Stats;
