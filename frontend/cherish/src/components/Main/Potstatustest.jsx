import dayjs from "dayjs";
import HeartIcon from "../../assets/Common/HeartIcon.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import { useQuery } from "@tanstack/react-query";
import {
  fetchClipCnt,
  fetchExpLevel,
  fetchMeetingSum,
} from "../../services/PotService";
import PotGraph from "./PotGraph";

export default function Potstatustest() {
  const { userInfos, anniversary, coupleId } = useCoupleStore();
  const today = dayjs();
  const anni = dayjs(anniversary);
  const rs = today.diff(anni, "day", true);
  const dday = Math.floor(rs) + 1;

  const { data: clipCntdata, isLoading: loading1 } = useQuery({
    queryKey: ["clipCnt", coupleId],
    queryFn: () => fetchClipCnt(coupleId),
  });

  const { data: expLeveldata, isLoading: loading2 } = useQuery({
    queryKey: ["expLevel", coupleId],
    queryFn: () => fetchExpLevel(coupleId),
  });

  const { data: meetingsum, isLoading: loading3 } = useQuery({
    queryKey: ["meetingSum", coupleId],
    queryFn: () => fetchMeetingSum(coupleId),
  });

  if (loading1 || loading2 || loading3) {
    return <div>로딩중</div>;
  }

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
        <p className="text-[1.5vw] text-text-black font-bold">
          우리가 모은 클립 갯수는?
        </p>
        <p className="text-[1.3vw] text-text-black font-bold">
          <span className="text-[2vw] text-cherry">{clipCntdata.clipCnt}</span>
          개
        </p>
        <p className="text-[1.5vw] text-text-black font-bold">
          우리가 체리콜로 만난 시간은?
        </p>
        <p className="text-[1.3vw] text-text-black font-bold">
          <span className="text-[2vw] text-cherry">{meetingsum.hour}</span>시간
          <span className="text-[2vw] text-cherry"> {meetingsum.minute}</span>분
          <span className="text-[2vw] text-cherry"> {meetingsum.second}</span>초
        </p>
      </div>
      <PotGraph exp={expLeveldata.exp} />
    </div>
  );
}
