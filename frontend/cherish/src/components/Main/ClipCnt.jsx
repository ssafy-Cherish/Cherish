import { useQuery } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore";
import { fetchClipCnt } from "../../services/PotService";

export default function ClipCnt() {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["cilpCnt", coupleId],
    queryFn: () => fetchClipCnt(coupleId),
  });
  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <>
      <p className="text-[1.5vw] text-text-black font-bold">
        우리가 모은 클립 갯수는?
      </p>
      <p className="text-[1.3vw] text-text-black font-bold">
        <span className="text-[2vw] text-cherry">{data.clipCnt}</span>개
      </p>
    </>
  );
}
