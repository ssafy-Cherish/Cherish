import { Navigate, Outlet } from "react-router-dom";
import Intro from "../../components/User/Intro";
import useUserStore from "../../stores/useUserStore";

const UserLayout = () => {
  const { userId } = useUserStore();

  return (
    <>
      {userId ? (
        <Navigate to="/" replace />
      ) : (
        <div className="grid grid-cols-8 gap-5 h-[100vh]">
          <div className="col-span-5">
            <Intro></Intro>
          </div>
          <div className="col-span-3">
            <Outlet></Outlet>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLayout;
