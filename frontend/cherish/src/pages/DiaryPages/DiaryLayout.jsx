import { Link, Outlet } from "react-router-dom";

const DiaryLayout = () => {
	const date = new Date();

	return (
		<>
			<h1>다이어리 레이아웃</h1>
			<Link to={{ pathname: "year", search: `?year=${date.getFullYear()}` }}>
				<button>year</button>
			</Link>
			<br />
			<Link
				to={{
					pathname: "month",
					search: `?year=${date.getFullYear()}&month=${date.getMonth() + 1}`,
				}}
			>
				<button>month</button>
			</Link>
			<br />
			<Link
				to={{
					pathname: "day",
					search: `?year=${date.getFullYear()}&month=${
						date.getMonth() + 1
					}&day=${date.getDate()}`,
				}}
			>
				<button>daily</button>
			</Link>
			<Outlet></Outlet>
		</>
	);
};

export default DiaryLayout;
