import { useQuery } from "@tanstack/react-query";
import HeartIcon from "../../assets/Common/HeartIcon.svg";
import PotLv1 from "../../assets/Pot/PotLv1.png";
import PotLv2 from "../../assets/Pot/PotLv2.png";
import PotLv3 from "../../assets/Pot/PotLv3.png";

import useCoupleStore from "../../stores/useCoupleStore";
import { fetchExpLevel } from "../../services/PotService";

const Level = ["새싹 단계", "떡잎 단계", "체리나무 단계"];
const potImage = [PotLv1, PotLv2, PotLv3, PotLv3, PotLv3];
const coupleLevel = ["풋풋한", "알콩달콩", "천생연분"];

export default function PotCard({ dday }) {
  const { coupleId, userInfos } = useCoupleStore();
  const { data: expLevel, isLoading } = useQuery({
    queryKey: ["expLevel", coupleId],
    queryFn: () => fetchExpLevel(coupleId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <>
      <div id="PotState" className="col-span-2 flex flex-col items-center">
        <div id="PotImg">
          <img
            className="mt-[1vw]"
            src={potImage[expLevel.level]}
            alt="PotImg"
          />
        </div>
        <p id="PotName" className="text-[1.2vw] text-cherry font-bold">
          {Level[expLevel.level]}
        </p>
        <progress
          id="PotExp"
          className="PotExp h-2 w-[7vw]"
          max="100"
          value={expLevel.exp}
        />
      </div>
      <div
        id="PotDescrption"
        className="h-[15vw] mt-[2vw] col-span-3 flex flex-col items-center justify-around"
      >
        <p id="PotCouple" className="text-[1.5vw] font-bold text-text-black">
          {coupleLevel[expLevel.level]}{" "}
          <span className="text-cherry">커플</span>
        </p>
        <div id="PotCoupleName" className="flex flex-row items-center">
          <p className="text-[1.2vw] text-text-black">
            {userInfos[0].nickname}
          </p>
          <div>
            <img src={HeartIcon} alt="HeartIcon" />
          </div>
          <p className="text-[1.2vw] text-text-black">
            {userInfos[1].nickname}
          </p>
        </div>
        <p className="text-[1.2vw] text-text-black">D + {dday}</p>
        <button id="GoPot" className="text-[1.2vw] text-text-black">
          경험치 기록 보기
        </button>
      </div>
    </>
  );
}
