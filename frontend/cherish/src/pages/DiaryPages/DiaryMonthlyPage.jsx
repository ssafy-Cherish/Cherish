import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Modal from "../../components/Diary/Modal";
import moment from "moment";
import Calendar from "react-calendar";
import highlight from "../../assets/paintingLine.svg";
import monthlyImg from "../../assets/DiaryMonthlyPage.svg";
import partyHat from "../../assets/PartyHat.svg";
import Cake from "../../assets/Cake.svg";
import "../../components/Diary/Calendar.css";

const DiaryMonthlyPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [scope, animate] = useAnimate();
	const navigate = useNavigate();
	let year = searchParams.get("year");
	let month = searchParams.get("month");
	const date = new Date(year, month - 1);

	// 화상채팅 했던 날들
	// TODO : useEffect로 서버에서 받아와야 함
	const [meetingDates, setMeetingDate] = useState([
		"2024-1-4",
		"2024-1-10",
		"2024-1-11",
		"2024-1-16",
	]);

	// 생일
	// TODO : zustand에 저장되어 있는 값 가져와야 함
	const [birthDay, setBirthDay] = useState(["2024-1-16", "2024-2-10"]);

	// 기념일
	// TODO : zustand에 저장되어 있는 값 가져와야 함
	const [anniversary, setAnniversary] = useState(["2024-1-16"]);

	// 각 특별한 날에 해당하는 날짜들을 모아서 식별하기 위한 배열
	const highlights = [...meetingDates, ...birthDay, ...anniversary];

	// 달 이동 함수
	function moveMonth(move) {
		let mvMonth = +month + move;
		let mvYear = year;
		if (mvMonth == 0) {
			mvMonth = 12;
			mvYear--;
		} else if (mvMonth == 13) {
			mvMonth = 1;
			mvYear++;
		}

		animate("#month, #year", { x: [0, -5, 5, 0] }, { duration: 0.2 });
		animate(".react-calendar", { opacity: [0, 1] }, { duration: 0.5 });
		searchParams.set("year", mvYear);
		searchParams.set("month", mvMonth);
		setSearchParams(searchParams);
	}

	// daily로 화면 이동
	function moveToDay(date) {
		navigate({
			pathname: "/diary/day",
			search: `?year=${date.getFullYear()}&month=${
				+date.getMonth() + 1
			}&day=${date.getDate()}`,
		});
	}

	function setImage(src, className, style) {
		return (
			<motion.div>
				<img
					src={src}
					className={className}
					style={{
						...style,
						transform: "translate(-50%, -50%)",
					}}
				/>
			</motion.div>
		);
	}

	return (
		// Diary 재사용 모달
		<Modal z={1} height="90vh" width="70vw">
			<div
				className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center"
				ref={scope}
			>
				{/* MonthYear */}
				<div className="flex flex-col me-auto my-[2vw]">
					<div className="bloc text-center">
						<span className="text-zinc-700 text-[2vw] font-bold block" id="year">
							{year}
						</span>
					</div>
					<div className="leading-9">
						<button
							className="text-[3vw] text-[#FD8680] font-bold"
							onClick={() => moveMonth(-1)}
						>
							&lt;
						</button>
						<span className="text-[#FD8680] text-[4vw] font-bold" id="month">
							&nbsp;{moment(date).format("MM")}&nbsp;
						</span>
						<button
							className="text-[3vw] text-[#FD8680] font-bold"
							onClick={() => moveMonth(1)}
						>
							&gt;
						</button>
					</div>
				</div>

				{/* react-calendar 컴포넌트 */}
				<Calendar
					value={date}
					onChange={moveToDay}
					formatDay={(locale, date) => moment(date).format("D")}
					formatMonthYear={(locale, date) => moment(date).format("YYYY MM")}
					minDetail="month"
					maxDetail="month"
					locale="en-US"
					calendarType="gregory"
					showNeighboringMonth={false}
					tileClassName={({ date }) => {
						if (highlights.find((x) => x === moment(date).format("YYYY-M-D"))) {
							return "relative";
						}
					}}
					tileContent={({ date }) => {
						let html = [];

						if (meetingDates.find((x) => x === moment(date).format("YYYY-M-D"))) {
							html.push(
								setImage(highlight, "absolute w-full", {
									top: "50%",
									left: "50%",
								})
							);
						}

						if (birthDay.find((x) => x === moment(date).format("YYYY-M-D"))) {
							html.push(
								setImage(partyHat, "absolute w-1/2", {
									top: "30%",
									left: "70%",
								})
							);
						}

						if (anniversary.find((x) => x === moment(date).format("YYYY-M-D"))) {
							html.push(
								setImage(Cake, "absolute w-1/5", {
									top: "15%",
									left: "50%",
								})
							);
						}

						if (anniversary.find((x) => x === moment(date).format("YYYY-M-D"))) {
							html.push(
								setImage(partyHat, "absolute w-1/2", {
									top: "30%",
									left: "70%",
								})
							);
						}

						return (
							<motion.div
								variants={{
									hidden: { opacity: 0 },
									visible: { opacity: 1, transition: { duration: 0.5 } },
								}}
								initial="hidden"
								animate="visible"
							>
								{html}
							</motion.div>
						);
					}}
				></Calendar>
			</div>
			<div>
				<img className="w-full" src={monthlyImg} alt="" />
			</div>
		</Modal>
	);
};

export default DiaryMonthlyPage;
