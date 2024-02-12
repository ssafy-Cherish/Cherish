import ModalRoute from "../../components/Common/ModalRoute";
import PotImg from "../../components/Main/PotImg.jsx";
import Potstatustest from "../../components/Main/Potstatustest.jsx";
import PotExp from "../../components/Main/PotExp.jsx";

export default function PotPage() {
  return (
    <ModalRoute modalcss="h-[41vw] w-[65vw] rounded-[20px] bg-beige" isX={true}>
      <div
        id="Wrapper"
        className="grid grid-cols-12 gap-5 h-[35vw] mt-[4vw] mx-[2vw]"
      >
        <Potstatustest />
        <PotImg />
        <PotExp />
      </div>
    </ModalRoute>
  );
}
