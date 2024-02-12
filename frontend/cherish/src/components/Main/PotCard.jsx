import { useQuery } from "@tanstack/react-query";
import HeartIcon from "../../assets/Common/HeartIcon.svg";
import PotLv1 from "../../assets/Pot/PotLv1.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import { fetchExpLevel } from "../../services/PotService";

export default function PotCard({ dday }) {
	const { coupleId, userInfos } = useCoupleStore();
	const { data: expLevel, isLoading } = useQuery({
		queryKey: ["expLevel", coupleId],
		queryFn: () => fetchExpLevel(coupleId),
	});
	return (
		<>
			<div id="PotState" className="col-span-2 flex flex-col items-center">
				<div id="PotImg">
					<img src={PotLv1} alt="PotImg" />
				</div>
				<p id="PotName" className="text-[1.2vw] text-cherry font-bold">
					체리 떡잎
				</p>
				{isLoading ? (
					<div>로딩중</div>
				) : (
					<progress
						id="PotExp"
						className="PotExp h-2 w-[7vw] mt-5"
						max="100"
						value={expLevel?.exp}
					/>
				)}
			</div>
			<div
				id="PotDescrption"
				className="h-[15vw] mt-[2vw] col-span-3 flex flex-col items-center justify-around"
			>
				<p id="PotCouple" className="text-[1.5vw] font-bold text-text-black">
					알콩달콩 <span className="text-cherry">커플</span>
				</p>
				<div id="PotCoupleName" className="flex flex-row items-center">
					<p className="text-[1.2vw] text-text-black">{userInfos[0]?.nickname}</p>
					<div>
						<img src={HeartIcon} alt="HeartIcon" />
					</div>
					<p className="text-[1.2vw] text-text-black">{userInfos[1]?.nickname}</p>
				</div>
				<p className="text-[1.2vw] text-text-black">D + {dday}</p>
				<button id="GoPot" className="text-[1.2vw] text-text-black">
					경험치 기록 보기
				</button>
			</div>
		</>
	);
}
