import { useQuery } from "@tanstack/react-query";
import PotLv1 from "../../assets/Pot/PotLv1.svg";
import PotLv2 from "../../assets/Pot/PotLv2.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import { fetchExpLevel } from "../../services/PotService";


const Level = ["새싹 단계", "떡잎 단계", "체리나무 단계"];

export default function PotImg() {

  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["expLevel", coupleId],
    queryFn: () => fetchExpLevel(coupleId),
  });

  if (isLoading) {
    return <div>로딩중</div>
  } 

  return (
    <div
      id="CherryPot"
      className="col-span-4 flex flex-col items-center mt-[3vw]"
    >
      <div className="h-[70%]">
        <img className="w-[100%] animate-wiggle" src={PotLv2} alt="PotLv1" />
      </div>
      <p className="mt-[4vw] text-text-black font-bold text-[2vw]">
        {Level[data.level]}
      </p>
    </div>
  );
}
