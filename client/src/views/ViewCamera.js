import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CONSTANT,
    checkLoginFromStaff,
    checkLoginFromCommittee,
    setMessage,
    resetMessage,
    isMessage,
    checkLoginFromHOD,
} from "./../CONSTANT";
import UserData from "../components/UserData";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import ComputerIcon from "@mui/icons-material/Computer";
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
export default function ViewCamera() {
    const { data, setData } = React.useContext(UserData);
    let navigate = useNavigate();

    useEffect(() => {
        if (checkLoginFromStaff() && checkLoginFromCommittee() && checkLoginFromHOD()) {
            navigate("/dashboard");
        }
    }, []);


    const __init = {
        name: "",
        cameraIp: "",
    };
    const [dataL, setDataL] = useState(__init);

    useEffect(() => {
        if (data.personal._id !== "") {
            if (data.personal.role === "staff") {
                fetchLab(`labs/view/staffId/${data.personal._id}`);
            }
            else {
                fetchLab("labs/view")
            }
        }
    }, [data]);

    const [labs, setLabs] = useState([]);

    const fetchLab = async (link) => {
        await axios
            .get(CONSTANT.server + link)
            .then((responce) => {
                if (responce.status === 200) {
                    setLabs([...responce.data]);
                    if (responce.data.length > 0) {
                        setDataL({
                            name: responce.data[0].name,
                            cameraIp: responce.data[0].cameraIp,
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const changeData = (e) => {
        setDataL({
            ...dataL,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <div className="__AddUser row d-flex justify-content-center align-items-center">
            <div className="form col-lg-6 col-sm-12">
                <h1 className="mb-5 text-center">View Camera</h1>
                {
                    labs.length > 0 ? <><div className="custom-input input-group mb-3">
                        <span className="input-group-text">
                            <ComputerIcon />
                        </span>
                        <select
                            className="form-select form-control"
                            name="name"
                            onChange={(e) => {
                                setDataL({
                                    name: e.target.value,
                                    cameraIp: labs.filter((a, b) => { return a.name === e.target.value })[0].cameraIp
                                })
                            }}
                            value={dataL.name}
                            aria-label="Select Lab"
                        >
                            {labs.length > 0
                                ? labs.map((one, i) => {
                                    return (
                                        <option
                                            key={one._id}
                                            value={one.name}
                                        >
                                            {one.name}
                                        </option>
                                    );
                                })
                                : ""}
                        </select>
                    </div>
                        <div className="mt-3 videoTag w-100 h-100">
                            <iframe className="w-100" src={dataL.cameraIp} frameborder="0" allowFullScreen></iframe>
                            {/* <iframe width="640" height="480" src="https://rtsp.me/embed/fYsiZdYB/" frameborder="0" allowfullscreen></iframe> */}

                        </div></> : <p className="text-center">No Labs</p>
                }
            </div>
        </div>
    );
}
