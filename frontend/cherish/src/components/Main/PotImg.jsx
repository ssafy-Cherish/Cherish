import { useQuery } from "@tanstack/react-query";
import PotLv1 from "../../assets/Pot/PotLv1.png";
import PotLv2 from "../../assets/Pot/PotLv2.png";
import PotLv3 from "../../assets/Pot/PotLv3.png";

import useCoupleStore from "../../stores/useCoupleStore";
import { fetchExpLevel } from "../../services/PotService";

const Level = ["새싹 단계", "떡잎 단계", "체리나무 단계"];
const potImage = [PotLv1, PotLv2, PotLv3, PotLv3, PotLv3];

export default function PotImg() {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["expLevel", coupleId],
    queryFn: () => fetchExpLevel(coupleId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <div id="CherryPot" className="col-span-4 flex flex-col items-center">
      <div className="h-[70%] my-auto">
        <img
          className="w-full h-full animate-wiggle"
          src={potImage[data.level]}
          alt="PotLv1"
        />
      </div>
      <p className="text-text-black font-bold text-[2vw] my-auto">
        {Level[data.level]}
      </p>
    </div>
  );
}
