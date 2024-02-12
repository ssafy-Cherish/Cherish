import dayjs from "dayjs";
import HeartIcon from "../../assets/Common/HeartIcon.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import PotGraph from "./PotGraph";
import ClipCnt from "./ClipCnt";

export default function PotStatus({ currentExp, clipCnt }) {
  const { userInfos, anniversary } = useCoupleStore();
  const today = dayjs();
  const anni = dayjs(anniversary);
  const rs = today.diff(anni, "day", true);
  const dday = Math.floor(rs) + 1;

  return (
    <div id="Total" className="col-span-4 grid grid-rows-12 gap-2 h-[37vw]">
      <div id="Des" className="row-span-2">
        <p className="text-[1.3vw] text-text-black">D + {dday}</p>
        <div id="PotCoupleName" className="flex flex-row items-center">
          <p className="text-[2.5vw] text-text-black">
            {userInfos[0].nickname}
          </p>
          <div>
            <img src={HeartIcon} alt="HeartIcon" />
          </div>
          <p className="text-[2.5vw] text-text-black">
            {userInfos[1].nickname}
          </p>
        </div>
      </div>
      <div id="CoupleStatus" className="row-start-4 row-end-7">
        <ClipCnt />
        <p className="text-[1.5vw] text-text-black font-bold">
          우리가 체리콜로 만난 시간은?
        </p>
        <p className="text-[1.3vw] text-text-black font-bold">
          <span className="text-[2vw] text-cherry">129</span>시간{" "}
          <span className="text-[2vw] text-cherry">28</span>분{" "}
          <span className="text-[2vw] text-cherry">17</span>초
        </p>
      </div>
      <PotGraph />
    </div>
  );
}
