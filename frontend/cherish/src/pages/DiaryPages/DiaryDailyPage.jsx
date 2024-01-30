import Modal from "../../components/Diary/Modal";
import dailyImg from "../../assets/DiaryDailyPage.svg";

const DiaryDailyPage = () => {
  return (
    <Modal img={dailyImg} z={1} height="90vh" width="auto">
      <div style={{ margin: "1rem 30%" }}>
        <h1>dailyImg</h1>
      </div>
    </Modal>
  );
};

export default DiaryDailyPage;
