import HeartIcon from "../../assets/HeartIcon.svg";
import PotLv1 from "../../assets/Pot/PotLv1.svg";


export default function PotCard() {
  return (
    <>
      <div id="PotState" className="col-span-2 flex flex-col items-center">
        <div id="PotImg">
          <img src={PotLv1} alt="PotImg" />
        </div>
        <p id="PotName" className="text-[1.2vw] text-cherry">
          체리 떡잎
        </p>
        <progress
          id="PotExp"
          className="PotExp h-2 w-[7vw] mt-5"
          max="100"
          value="70"
        />
      </div>
      <div
        id="PotDescrption"
        className="h-[15vw] mt-[2vw] col-span-3 flex flex-col items-center justify-around"
      >
        <p id="PotCouple" className="text-[1.5vw]">
          알콩달콩 <span className="text-cherry">커플</span>
        </p>
        <div id="PotCoupleName" className="flex flex-row items-center">
          <p className="text-[1.2vw]">나희도</p>
          <div>
            <img src={HeartIcon} alt="HeartIcon" />
          </div>
          <p className="text-[1.2vw]">백이진</p>
        </div>
        <p className="text-[1.2vw]">D + 99</p>
        <button id="GoPot" className="text-[1.2vw]">
          경험치 기록 보기
        </button>
      </div>
    </>
  );
}
