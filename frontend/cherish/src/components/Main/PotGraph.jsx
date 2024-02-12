import { useQuery } from "@tanstack/react-query";
import { fetchExpLevel } from "../../services/PotService";
import useCoupleStore from "../../stores/useCoupleStore";

export default function PotGraph() {
	const { coupleId } = useCoupleStore();
	const { data: expLevel, isLoading } = useQuery({
		queryKey: ["expLevel", coupleId],
		queryFn: () => fetchExpLevel(coupleId),
	});
	if (isLoading) {
		return <div>로딩중</div>;
	}

	return (
		<div id="Graph" className="row-start-8 row-end-12 flex justify-center items-center">
			<div
				className="radial-progress text-cherry mt-[3vw] flex flex-col justify-center items-center"
				style={{ "--value": expLevel?.exp, "--size": "12vw" }}
				role="progressbar"
			>
				<p className="text-[1.3vw] text-text-black font-bold">현재 성장치</p>
				<p className="text-[1.5vw] font-bold">{expLevel?.exp}%</p>
			</div>
		</div>
	);
}
