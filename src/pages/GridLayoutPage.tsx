// import GridStackComponent from "@/components/gridStack/GridStack";
import { GridStackComponent } from "@/components/gridStack/GridStack";
import HomeSidebar from "@/components/homeSidebar/HomeSidebar";

const GridLayoutPage = () => {
  return (
    <div className='flex'>
      <HomeSidebar />
      <GridStackComponent />
    </div>
  );
};

export default GridLayoutPage;
