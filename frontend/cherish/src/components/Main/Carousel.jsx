import { motion } from "framer-motion";
import "./Carousel.css";
import { useQuery } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore";
import { getPinedClip } from "../../services/IndexPageService";

export default function Testca() {
  const listEl = [1, 2, 3, 4, 5, 6];
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["pinedClip", coupleId],
    queryFn: () => getPinedClip(coupleId),
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <>
      <div className="view border-2 rounded-[20px] px-[1.2vw] shadow-md h-[17vw]">
        <ul className="slide">
          {listEl.concat(listEl).map((el, idx) => {
            // ⭐️ concat으로 original과 clone 연결
            return (
              <motion.li
                whileHover={{ scale: 1.1 }}
                key={idx}
                className="bg-pink mx-[1vw] rounded-[25px] border-[5px] border-cherry"
              >
                {el}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
