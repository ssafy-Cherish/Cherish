import { Outlet, Navigate } from "react-router-dom";
import NavBar from "../components/Common/NavBar";
import useUserStore from "../stores/useUserStore";
import Kakao from "../utils/Kakao";
import useCoupleStore from "../stores/useCoupleStore";
import { useEffect } from "react";

export default function RootLayout() {
  const { userId } = useUserStore();

  const { reset: coupleReset } = useCoupleStore();
  const { reset: userReset } = useUserStore();

  useEffect(() => {
    Kakao.Auth.getStatusInfo(({ status }) => {
      if (status == "not_connected") {
        coupleReset();
        userReset();
        localStorage.removeItem("user-store");
        localStorage.removeItem("couple-store");
      }
    });
  }, []);

  return (
    <>
      {userId ? (
        <div className="grid grid-cols-mainLayout gap-5">
          <NavBar />
          <div className="col-span-10 mx-5">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to="/user" replace />
      )}
    </>
  );
}
