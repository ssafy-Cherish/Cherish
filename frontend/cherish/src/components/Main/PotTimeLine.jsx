import { useQuery } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore";
import { fetchExpTimeLine } from "../../services/PotService";

export default function PotTimeLine() {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["expTimeline", coupleId],
    queryFn: () => fetchExpTimeLine(coupleId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>로딩중입니다</div>;
  } else {
    const keys = Object.keys(data);
    const timeline = [];
    keys.forEach((key, idx) => {
      const date = (
        <li key={key}>
          <div className="timeline-middle">
            <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
          </div>
          <div
            className={
              "mb-10 " +
              (idx % 2 === 0
                ? "timeline-start md:text-start"
                : "timeline-end md:text-end")
            }
          >
            <div className="text-[1vw] text-text-black mb-[3vw] font-bold">
              {key}
            </div>
            {data[key].map((item) => (
              <div
                key={item.id}
                className="text-[1vw] mt-[1.5vw] text-text-gray"
              >
                {item.content} +{item.exp}
              </div>
            ))}
          </div>
          <hr className="bg-subpuple" />
        </li>
      );
      timeline.push(date);
    });

    return <>{timeline.length > 0 ? {timeline} : <div>체리콜로 화분을 성장시켜요!</div>}</>;
  }
}
