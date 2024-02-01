import { Outlet } from "react-router-dom";
import NavBar from "../components/Common/NavBar";




export default function RootLayout() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <NavBar />
            <div className="col-span-10 mx-5">
                <Outlet />
            </div>
        </div>
    )
}