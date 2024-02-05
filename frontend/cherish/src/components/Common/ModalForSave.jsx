import { motion, useAnimate } from "framer-motion";
import { createPortal } from "react-dom";
import CloseIcon from "../../assets/CloseIcon.svg";

export default function Modal({
  children,
  z,
  modalcss,
  isX,
  closeModalfun,
}) {
  // childern : 모달 안에 들어갈 내용물
  // z : 백드롭에 주고싶은 z 인덱스 값
  // modalcss : 모달의 className 값, 테일윈드 css 사용하면 커스텀 가능
  // isX : 불리언값 넣어주면 true, false에 따라 모달에 x아이콘 표시

  const [scope, animate] = useAnimate();
  function onClose() {
    animate("dialog", { opacity: 0, y: 30 });
    setTimeout(() => {
      closeModalfun();
    }, 300);
  }
  const backdropStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: z || "9",
  };
  const modalStyle = {
    margin: "10% auto",
    maxWidth: "90%",
    zIndex: "10",
  };

  return createPortal(
    <div onClick={onClose} ref={scope} style={backdropStyle}>
      <motion.dialog
        className={modalcss}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        open
        onClick={(e) => {
          // 다이얼로그 안을 클릭 했을 때 onClose가 실행되는 이벤트 캡쳐링 방지
          e.stopPropagation();
        }}
        style={modalStyle}
      >
        {isX && (
          <button
            onClick={onClose}
            className="float-right mt-[1.5vw] mr-[1.5vw]"
          >
            <img src={CloseIcon} alt="CloseIcon" />
          </button>
        )}
        {children}
      </motion.dialog>
    </div>,
    document.body
  );
}
