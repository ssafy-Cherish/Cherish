import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";




export default function RootLayout() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <NavBar />
<<<<<<< HEAD
            <div className="col-span-10">
=======
            <div className="col-span-10 mx-5">
>>>>>>> fbcf9be05b16cf7b0bbf994a54ba674c3a301946
                <Outlet />
            </div>
        </div>
    )
}