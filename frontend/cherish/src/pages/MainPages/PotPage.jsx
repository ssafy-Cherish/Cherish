import HeartIcon from "../../assets/Common/HeartIcon.svg";
import PotLv2 from "../../assets/Pot/PotLv2.svg";
import ModalRoute from "../../components/Common/ModalRoute";
import { fetchExp } from "../../utils/FetchMain.js";
import PotTimeLine from "../../components/Main/PotTimeLine.jsx";
import { useQuery } from "@tanstack/react-query";

export default function PotPage() {
  const { data } = useQuery({
    queryKey: ["exp"],
    // 추후에 커플아이디가 입력되도록 수정해야함
    queryFn: () => fetchExp(1),
  });

  return (
    <ModalRoute modalcss="h-[41vw] w-[65vw] rounded-[20px] bg-beige" isX={true}>
      <div
        id="Wrapper"
        className="grid grid-cols-12 gap-5 h-[35vw] mt-[4vw] mx-[2vw]"
      >
        <div id="Total" className="col-span-4 grid grid-rows-12 gap-2 h-[37vw]">
          <div id="Des" className="row-span-2">
            <p className="text-[1.3vw]">D + 99</p>
            <div id="PotCoupleName" className="flex flex-row items-center">
              <p className="text-[2.5vw]">나희도</p>
              <div>
                <img src={HeartIcon} alt="HeartIcon" />
              </div>
              <p className="text-[2.5vw]">백이진</p>
            </div>
          </div>
          <div id="CoupleStatus" className="row-start-4 row-end-7">
            <p className="text-[1.5vw]">우리가 모은 클립 갯수는?</p>
            <p className="text-[1.3vw]">
              <span className="text-[2vw] text-cherry">78</span>개
            </p>
            <p className="text-[1.5vw]">우리가 체리콜로 만난 시간은?</p>
            <p className="text-[1.3vw]">
              <span className="text-[2vw] text-cherry">129</span>시간{" "}
              <span className="text-[2vw] text-cherry">28</span>분{" "}
              <span className="text-[2vw] text-cherry">17</span>초
            </p>
          </div>
          <div
            id="Graph"
            className="row-start-8 row-end-12 flex justify-center items-center"
          >
            <div
              className="radial-progress text-cherry mt-[3vw] flex flex-col justify-center items-center"
              style={{ "--value": 60, "--size": "12vw" }}
              role="progressbar"
            >
              <p className="text-[1.3vw] text-gray-800">현재 성장치</p>
              <p className="text-[1.5vw]">60%</p>
            </div>
          </div>
        </div>
        <div
          id="CherryPot"
          className="col-span-4 flex flex-col items-center mt-[3vw]"
        >
          <div className="h-[70%]">
            <img className="w-[100%] animate-wiggle" src={PotLv2} alt="PotLv1" />
          </div>
          <p className="mt-[4vw]">체리 떡잎 단계</p>
        </div>
        <div id="PotHistory" className="col-span-4 h-[35vw]">
          <div className="flex flex-col items-center mt-[1.5vw]">
            <p className="text-[2vw] text-text-black font-bold">
              이달의 성장 내역
            </p>
            <ul
              id="PotTimeLine"
              className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-[1vw] overflow-y-auto h-[30vw]"
            >
              {data && <PotTimeLine timeLine={data} />}
            </ul>
          </div>
        </div>
      </div>
    </ModalRoute>
  );
}
