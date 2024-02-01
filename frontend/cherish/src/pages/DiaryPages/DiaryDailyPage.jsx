import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, useAnimate } from "framer-motion";
import { useState } from "react";
import Modal from "../../components/Common/Modal";
import dayjs from "dayjs";
import dailyImg from "../../assets/diary/DiaryDailyPage.svg";
import "./DiaryDailyPage.css";
import ChatModal from "../../components/Diary/ChatModal";
import MemoImg from "../../assets/MemoImg.svg";
import chatImg from "../../assets/diary/chat.svg";

const DiaryDailyPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [scope, animate] = useAnimate();
	const navigate = useNavigate();
	let year = searchParams.get("year");
	let month = searchParams.get("month");
	let day = searchParams.get("day");
	const date = new Date(year, +month - 1, day);

	// 내 kakaoId, 채팅 위치 식별 용
	// TODO : zustand에 저장되어 있는 값 가져와야 함
	const myId = 1;

	// 시작 날
	// TODO : zustand에 저장되어 있는 값 가져와야 함
	const [anniversary, setAnniversary] = useState(["2024-1-2"]);

	// 미팅 데이터
	// TODO : DB에서 데이터 가져와야 함
	const [meetings, setMeetings] = useState([
		{
			id: 1,
			craetedAt: "2024-1-13 09:37:00",
			chats: [
				{
					kakaoId: 1,
					nickname: "A",
					content: "hello",
				},
				{
					kakaoId: 2,
					nickname: "B",
					content: "im fine",
				},
			],

			clips: [
				{
					id: 1,
					keyword: "Hi",
					data: "data",
					isPinned: false,
				},
				{
					id: 2,
					keyword: "Hi",
					data: "data2",
					isPinned: true,
				},
				{
					id: 3,
					keyword: "love",
					data: "data3",
					isPinned: true,
				},
				{
					id: 4,
					keyword: "love",
					data: "data4",
					isPinned: true,
				},
			],
		},
		{
			id: 2,
			craetedAt: "2024-1-13 16:21:00",
			chats: [
				{
					kakaoId: 1,
					nickname: "A",
					content: "hello",
				},
				{
					kakaoId: 2,
					nickname: "B",
					content: "im fine",
				},
				{
					kakaoId: 1,
					nickname: "A",
					content: "im fine",
				},
				{
					kakaoId: 1,
					nickname: "A",
					content: "im fine",
				},
				{
					kakaoId: 2,
					nickname: "B",
					content: "im fine",
				},
				{
					kakaoId: 2,
					nickname: "B",
					content: "im fine",
				},
				{
					kakaoId: 1,
					nickname: "B",
					content: "im fine",
				},
				{
					kakaoId: 2,
					nickname: "B",
					content:
						"im finesdlkamsdlkamdlkamdlkasmdlaskmdalskdmaklsdmasldkmasldkasmdlkasmdlkamsdlkamsldkasmdlkasmdlsakmdlaskm",
				},
				{
					kakaoId: 1,
					nickname: "B",
					content: "im fine",
				},
				{
					kakaoId: 1,
					nickname: "B",
					content: "im fine",
				},
			],

			clips: [
				{
					id: 1,
					keyword: "Hi",
					data: "data",
					isPinned: false,
				},
				{
					id: 2,
					keyword: "Hi",
					data: "data2",
					isPinned: true,
				},
				{
					id: 3,
					keyword: "love",
					data: "data3",
					isPinned: true,
				},
				{
					id: 4,
					keyword: "love",
					data: "data4",
					isPinned: true,
				},
			],
		},
	]);

	const [memo, setMemo] = useState({
		id: 1,
		content: "메모에 적힐 내용",
	});

	const [openChatModal, setOpenChatModal] = useState(false);
	// Modal에 전달할 채팅 기록
	const [chats, setChats] = useState([]);

	function showChat(selChats) {
		setChats(selChats);
		console.log(selChats);
		setOpenChatModal(true);
	}

	function closeChatModal() {
		setOpenChatModal(false);
	}

	return (
		<>
			<Modal z={1} modalcss="h-[90vh] w-[70vw]" isX={false}>
				<div
					className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[50vw] items-center"
					ref={scope}
				>
					{/* 선택한 날짜와 며칠째인지 나오는 곳 */}
					<div className="me-auto">
						<div className="text-[1vw]">{dayjs(date).format("YYYY년 MM월 DD일")}</div>
						<div className="text-[2vw]">
							<span className="text-cherry">
								{dayjs(date).diff(anniversary, "day") + 1}
							</span>
							<span>일째의 우리</span>
						</div>
					</div>

					{/* 미팅 타임라인, 채팅 등 */}
					<div className="grid grid-cols-3 w-full gap-6">
						{/* 미팅 타임라인 */}
						<div className="me-auto relative col-span-2">
							<ul
								className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical  overflow-y-auto h-[35vw]"
								id="dailyTimeline"
							>
								{meetings.map((meeting) => (
									// <MeetingTimeline key={meeting.id} meeting={meeting} />
									<li key={meeting.id} className="grid grid-cols-2 gap-5">
										<div className="timeline-middle">
											<div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
										</div>
										<div className="timeline-end">
											<div className="flex justify-between items-center mb-2">
												<span className="text-[1.5vw]">
													{dayjs(meeting.craetedAt).format("A hh : mm")}
												</span>
												<button
													className="btn rounded-full bg-pink shadow-lg"
													onClick={() => showChat(meeting.chats)}
												>
													<img src={chatImg} alt="" />
													<span>채팅 기록</span>
												</button>
											</div>
											{meeting.clips.map((clip) => (
												<div
													key={clip.id}
													className="h-1/3 mb-5 flex justify-center bg-gray-200"
												>
													<img
														src={`https://cataas.com/cat/cute?${clip.id}`}
														className="h-full w-full"
													/>
												</div>
											))}
										</div>
										<hr className="bg-subpuple" />
									</li>
								))}
							</ul>
						</div>

						{/* 메모 영역 */}
						<div className="flex justify-end items-center">
							<div className="w-[17vw] relative">
								<div className="max-w-full h-full grid grid-rows-6 justify-center absolute">
									<div className="text-[1vw] text-center row-start-2 max-w-full">
										<span>Memo</span>
									</div>
									<div
										className="row-start-3 row-span-2 max-w-[17vw] w-[17vw] text-center  px-[4vw] text-[0.8vw]"
										style={{
											whiteSpace: "pre-line",
											wordWrap: "break-word",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{memo.content}
									</div>
								</div>
								<img className="w-full" src={MemoImg} alt="MemoImg" />
							</div>
						</div>
					</div>
				</div>
				<div>
					<img className="w-full" src={dailyImg} alt="" />
				</div>
			</Modal>
			<AnimatePresence>
				{openChatModal && (
					<ChatModal chats={chats} onClose={closeChatModal} myId={myId}></ChatModal>
				)}
			</AnimatePresence>
		</>
	);
};

export default DiaryDailyPage;
