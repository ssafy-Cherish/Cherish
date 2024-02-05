import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Intro from "../../components/User/Intro";
import { useEffect } from "react";

const UserLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
		if (location.pathname === "/user") {
			navigate({ pathname: "/user/login" }, { replace: true });
		}
	}, []);

	return (
		<>
			<div className="grid grid-cols-8 gap-5 h-[100vh]">
				<div className="col-span-5">
					<Intro></Intro>
				</div>
				<div className="col-span-3">
					<Outlet></Outlet>
				</div>
			</div>
		</>
	);
};

export default UserLayout;
