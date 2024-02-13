import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Modal from "../../components/Common/Modal";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import highlight from "../../assets/diary/paintingLine.svg";
import monthlyImg from "../../assets/diary/DiaryMonthlyPage.svg";
import Cake from "../../assets/diary/Cake.svg";
import Popper from "../../assets/diary/popper.svg?react";
import useCoupleStore from "../../stores/useCoupleStore";
import "../../components/Diary/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { meetingFetch } from "../../services/diaryService";

const DiaryMonthlyPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [scope, animate] = useAnimate();
	const { anniversary, userInfos, coupleId } = useCoupleStore();

	const [isHover, setIsHover] = useState(false);
	const [hoverText, setHoverText] = useState("");

	function handleHoverOpen(text) {
		setIsHover(true);
		setHoverText(text);
	}
	function handleHoverClose(text) {
		setIsHover(false);
	}

	const navigate = useNavigate();
	let year = searchParams.get("year");
	let month = searchParams.get("month");
	const date = new Date(year, month - 1);
	const nowYear = new dayjs().year();

	// 생일
	const birthdays = userInfos.map((item) => ({
		date: dayjs(item.birthday).format("M-D"),
		text: `${item.nickname}님의 생일이에요`,
	}));

	const [highlights, setHighlight] = useState([]);
	useEffect(() => {
		let anni = dayjs(anniversary);
		let anniyear = anni.year();
		let anniday = anni.format("M-D");
		let annis = [{ date: `${anniyear}-${anniday}`, text: "만나기 시작한 날" }];
		for (let i = 1; i <= nowYear + 1 - anniyear; i++) {
			annis.push({ date: `${anniyear + i}-${anniday}`, text: `만난 지 ${i}년 되는 날` });
		}
		anni = anni.subtract(1, "day");
		for (let i = 1; anni.year() <= nowYear + 1; i++) {
			anni = anni.add(100, "day");
			annis.push({ date: anni.format("YYYY-M-D"), text: `만난 지 ${i}00일 되는 날` });
		}
		// 각 특별한 날에 해당하는 날짜들을 모아서 식별하기 위한 배열
		setHighlight([...birthdays, ...annis]);
	}, []);

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

		animate("#year", { x: [0, -5, 5, 0] }, { duration: 0.3 });
		animate(".react-calendar__month-view__days", { opacity: [0.2, 1] }, { duration: 1 });
		searchParams.set("year", mvYear);
		searchParams.set("month", mvMonth);
		setSearchParams(searchParams, { replace: true });
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

	function moveToYearly(year) {
		navigate({
			pathname: "/diary/year",
			search: `?year=${year}`,
		});
	}

	function setImage(src, className, style, date, text) {
		return (
			<div
				key={`${date}${src}${text}`}
				onMouseEnter={src == Cake ? () => handleHoverOpen(text) : undefined}
				onMouseLeave={src == Cake ? handleHoverClose : undefined}
			>
				<img
					src={src}
					className={className}
					style={{
						...style,
						transform: "translate(-50%, -50%)",
					}}
				/>
			</div>
		);
	}

	const { data: meetingDates } = useQuery({
		queryKey: ["meetingDates", year, month],
		queryFn: () => meetingFetch(coupleId, dayjs(date).format("YYYY-MM")),
		staleTime: 60000,
		refetchOnWindowFocus: false,
	});

	return (
		// Diary 재사용 모달
		<Modal z={1} modalcss="h-[90vh] w-[70vw] bg-transparent" isX={false} nav="/">
			<div
				className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center"
				ref={scope}
			>
				{/* MonthYear */}
				<div className="flex flex-row w-full items-center">
					<div className="grid grid-cols-[10%_80%_10%] w-[15vw] justify-center items-center">
						<div>
							<motion.button
								className={`text-[3vw] ${
									year == dayjs(anniversary).year() && month == 1
										? "text-gray-300"
										: "text-[#FD8680]"
								} font-bold`}
								onClick={() => moveMonth(-1)}
								whileHover={{ scale: 1.2 }}
								disabled={year == dayjs(anniversary).year() && month == 1}
							>
								&lt;
							</motion.button>
						</div>
						<div className="flex flex-col items-center justify-center">
							<motion.div
								className="text-zinc-700 text-[2vw] font-bold block hover:cursor-pointer"
								id="year"
								onClick={() => moveToYearly(year)}
								whileHover={{ scale: 1.2 }}
								transition={{ duration: 0.2 }}
							>
								{year}
							</motion.div>
							<div className="text-[#FD8680] text-[4vw] font-bold" id="month">
								{dayjs(date).format("MM")}
							</div>
						</div>
						<div>
							<motion.button
								className={`text-[3vw] ${
									year == nowYear + 1 && month == 12
										? "text-gray-300"
										: "text-[#FD8680]"
								} font-bold`}
								onClick={() => moveMonth(1)}
								whileHover={{ scale: 1.2 }}
								disabled={year == nowYear + 1 && month == 12}
							>
								&gt;
							</motion.button>
						</div>
					</div>
					<div className="chat chat-start grow flex justify-center">
						{isHover && (
							<>
								<pre className="chat-bubble bg-skyblue text-black font-light flex flex-row justify-center items-center gap-[1vw]">
									<div>{hoverText}</div>
									<Popper className="w-[1.5vw]"></Popper>
								</pre>
							</>
						)}
					</div>
				</div>
				{/* react-calendar 컴포넌트 */}
				<Calendar
					value={date}
					onChange={moveToDay}
					formatDay={(locale, date) => dayjs(date).format("D")}
					minDetail="month"
					maxDetail="month"
					locale="en-US"
					showNeighboringMonth={false}
					tileClassName={({ date }) => {
						if (
							highlights.find(
								(x) =>
									x.date === dayjs(date).format("M-D") ||
									x.date === dayjs(date).format("YYYY-M-D")
							)
						) {
							return "relative";
						}
						if (
							meetingDates &&
							meetingDates.find((x) => x === dayjs(date).format("YYYY-MM-DD"))
						) {
							return "relative";
						}
					}}
					tileContent={({ date }) => {
						let html = [];
						let texts = "";
						if (
							meetingDates &&
							meetingDates.find((x) => x === dayjs(date).format("YYYY-MM-DD"))
						) {
							html.push(
								setImage(
									highlight,
									"absolute w-full",
									{
										top: "50%",
										left: "50%",
									},
									date
								)
							);
						}

						highlights.forEach((item) => {
							if (
								item.date === dayjs(date).format("M-D") ||
								item.date === dayjs(date).format("YYYY-M-D")
							) {
								texts += item.text + "\n";
							}
						});

						if (
							highlights.find(
								(x) =>
									x.date === dayjs(date).format("M-D") ||
									x.date === dayjs(date).format("YYYY-M-D")
							)
						) {
							html.push(
								setImage(
									Cake,
									"absolute w-1/5",
									{
										top: "15%",
										left: "50%",
									},
									date,
									texts
								)
							);
						}

						return (
							<>
								{html.length > 0 && (
									<motion.div
										variants={{
											init: { opacity: 0 },
											visible: { opacity: 1 },
										}}
										initial="init"
										animate="visible"
									>
										{html}
									</motion.div>
								)}
							</>
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
