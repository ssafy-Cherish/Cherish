/* eslint-disable react/prop-types */
import "../../components/Diary/DiaryDailyPage.css";
import Modal from "./Modal";

const ChatModal = ({ content, memoId, onClose }) => {
  return (
    <Modal onClose={onClose} dialogCss="w-[30vw] h-[60vh] bg-pink p-5 rounded-2xl">
      <div></div>
    </Modal>
  );
};

export default ChatModal;
