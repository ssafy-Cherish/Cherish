/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../components/Diary/DiaryDailyPage.css";
import Modal from "./Modal";

const ChatModal = ({ onClose, memo, setMemo }) => {
	const [isWriting, setIsWriting] = useState();
	const [content, setContent] = useState(memo.content);

	function changeContent(event) {
		setContent(event.target.value);
	}

	function cancelContent() {
		setContent(memo.content);
		setIsWriting(false);
	}

	function saveContent() {
		// TODO : 업데이트 쿼리 날려야 함, 또는 memoId가 없다면 insert

		setMemo((prev) => ({ ...prev, content: content }));
		setIsWriting(false);
	}

	return (
		<Modal
			onClose={onClose}
			dialogCss="w-[30vw] h-[60vh] bg-skyblue p-5 rounded-2xl relative"
			isX={true}
		>
			<div className="flex flex-col h-full">
				<div className="flex flex-row justify-center max-w-full ">
					<div className="text-[2vw] italic">Memo</div>
				</div>
				<div className="divider  divider-start italic">Content</div>
				<div className="h-full max-h-full p-[1vw]">
					{isWriting ? (
						<textarea
							cols="30"
							rows="10"
							className="w-full h-full resize-none rounded-xl drop-shadow-xl"
							value={content}
							onChange={changeContent}
						></textarea>
					) : (
						<div
							style={{
								backgroundColor: "#E0F4FF",
								whiteSpace: "pre-line",
								wordWrap: "break-word",
							}}
							className="rounded-xl drop-shadow-xl h-full "
						>
							{memo.content}
						</div>
					)}
				</div>
				<div className="flex flex-row justify-around">
					{isWriting ? (
						<>
							<div
								onClick={cancelContent}
								className="btn btn-outline bg-white text-cherry"
							>
								취소
							</div>
							<div onClick={saveContent} className="btn bg-cherry text-white">
								저장
							</div>
						</>
					) : (
						<div
							onClick={() => setIsWriting(true)}
							className="btn btn-outline bg-white text-cherry"
						>
							수정
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ChatModal;
