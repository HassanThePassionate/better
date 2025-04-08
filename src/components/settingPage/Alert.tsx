import Info from "../svgs/Info";
import RocketIcon from "../svgs/RocketIcon";

const Alert = ({ title }: { title: string }) => {
  return (
    <div className='mb-6'>
      <div className='rounded-md p-4 bg-card  border border-brand '>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <Info />
          </div>
          <div className='ml-3'>
            <div className='text-text'>
              <p>{title}</p>
              <div className='mt-3'>
                <button className='btn flex items-center gap-2 rounded'>
                  <RocketIcon />
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
