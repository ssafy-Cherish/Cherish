import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { fetchMonthList } from "../../services/CherryBoxService";
import useCoupleStore from "../../stores/useCoupleStore";

export default function VideoList({ selectKeyword, handleClickVideoOpen }) {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["monthList", coupleId, selectKeyword],
    queryFn: () => fetchMonthList(coupleId, selectKeyword),
  });
  if (isLoading) {
    return (
      <>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center"></div>
      </>
    );
  }

  return (
    <>
      {data.VideoDtoList.map((video) => (
        <div
          key={video.id}
          onClick={() =>
            handleClickVideoOpen({
              filepath: video.filepath,
              keyword: video.keyword,
            })
          }
          className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center"
        >
          <p className="text-[1.5vw]">
            우리들의 "<span className="text-cherry">{video.keyword}</span>"
          </p>
        </div>
      ))}
    </>
  );
}
