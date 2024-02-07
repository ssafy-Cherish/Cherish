import { Outlet, Navigate } from "react-router-dom";
import NavBar from "../components/Common/NavBar";
import useUserStore from "../stores/useUserStore";

export default function RootLayout() {
	const { userId } = useUserStore();

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
