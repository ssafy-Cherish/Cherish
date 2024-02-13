import { motion } from "framer-motion";
import "./Carousel.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore";
import { getPinedClip } from "../../services/IndexPageService";

export default function Testca() {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["pinedClip", coupleId],
    queryFn: () => getPinedClip(coupleId),
    refetchOnMount: true,
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  const videoList = new Array(6).fill(null);
  data.pinnedclip.forEach((item, idx) => {
    videoList[idx] = item.filepath;
  });

  return (
    <>
      <div className="view border-2 rounded-[20px] px-[1.2vw] shadow-md h-[17vw]">
        <ul className="slide">
          {videoList.concat(videoList).map((item, idx) => {
            // ⭐️ concat으로 original과 clone 연결
            return (
              <motion.li
                whileHover={{ scale: 1.1 }}
                key={idx}
                className="bg-pink mx-[1vw] rounded-[25px] border-[5px] border-cherry"
              >
                <video
                  onClick={(event) => {
                    event.preventDefault();
                    if (event.target.paused === false) {
                      event.target.pause();
                    } else {
                      event.target.play();
                    }
                  }}
                  className="w-full h-full"
                  src={item}
                ></video>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
