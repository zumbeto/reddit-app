import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';

const Root = () => {
  return (
    <>
      <Header />
      <SideBar />
      <Outlet />
    </>
  );
};

export default Root;
