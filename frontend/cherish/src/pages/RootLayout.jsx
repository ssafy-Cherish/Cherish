import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";




export default function RootLayout() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <NavBar />
            <div className="col-span-9">
                <Outlet />
            </div>
        </div>
    )
}