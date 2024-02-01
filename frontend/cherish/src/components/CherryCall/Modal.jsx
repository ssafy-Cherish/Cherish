
import classes from "./Modal.module.css";

const Modal = ({ children, z, img, width, height, onClose }) => {
  return (
    <div
      className={classes.backdrop}
      onClick={onClose}
      style={{ zIndex: z ? z : undefined }}
    >
      <dialog
        className={classes.modal}
        open
        onClick={(e) => {
          // 다이얼로그 안을 클릭 했을 때 onClose가 실행되는 이벤트 캡쳐링 방지
          e.stopPropagation();
        }}
        style={{
          backgroundSize: "100% 100%",
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundRepeat: `no-repeat`,
          height: height ? height : "300",
          width: width ? width : "",
        }}
      >
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
