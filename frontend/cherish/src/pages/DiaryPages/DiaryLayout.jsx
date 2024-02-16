import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const DiaryLayout = () => {
	const date = new Date();
	const navigate = useNavigate();

	useEffect(() => {
		navigate(
			{
				pathname: "/diary/month",
				search: `?year=${date.getFullYear()}&month=${+date.getMonth() + 1}`,
			},
			{ replace: true }
		);
	}, []);

	return (
		<>
			<Outlet></Outlet>
		</>
	);
};

export default DiaryLayout;
