import ModalRoute from "../../components/Common/ModalRoute";
import {
  fetchClipCnt,
  fetchExpLevel,
  fetchExpTimeLine,
} from "../../services/PotService.js";
import PotTimeLine from "../../components/Main/PotTimeLine.jsx";
import { useQuery } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore.js";
import PotStatus from "../../components/Main/PotStatus.jsx";
import PotImg from "../../components/Main/PotImg.jsx";

export default function PotPage() {
  const { coupleId } = useCoupleStore();
  // const { data: clipCnt, isLoading: clipCntLoading } = useQuery({
  //   queryKey: ["cilpCnt", coupleId],
  //   queryFn: () => fetchClipCnt(coupleId),
  // });
  return (
    <ModalRoute modalcss="h-[41vw] w-[65vw] rounded-[20px] bg-beige" isX={true}>
      <div
        id="Wrapper"
        className="grid grid-cols-12 gap-5 h-[35vw] mt-[4vw] mx-[2vw]"
      >
        <PotStatus />
        <PotImg />
        <div id="PotHistory" className="col-span-4 h-[35vw]">
          <div className="flex flex-col items-center mt-[1.5vw]">
            <p className="text-[2vw] text-text-black font-bold">
              이달의 성장 내역
            </p>
            <ul
              id="PotTimeLine"
              className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-[1vw] overflow-y-auto h-[30vw]"
            >
              <PotTimeLine />
            </ul>
          </div>
        </div>
      </div>
    </ModalRoute>
  );
}
