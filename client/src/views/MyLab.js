import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CONSTANT,
    checkLoginFromStaff,
    setMessage,
    resetMessage,
    isMessage,
} from "./../CONSTANT";
import UserData from "../components/UserData";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
export default function MyLab() {
    const { data, setData } = React.useContext(UserData);
    let navigate = useNavigate();

    useEffect(() => {
        if (checkLoginFromStaff()) {
            navigate("/dashboard");
        }
    }, []);


    const __init = {
        cameraIp: "",
        numberOfPcs: ""
    };
    const [dataL, setDataL] = useState(__init);

    useEffect(() => {
        if (data.personal._id !== "") {
            fetchLab();
        }
    }, [data]);

    const [labs, setLabs] = useState([]);

    const fetchLab = async () => {
        await axios
            .get(CONSTANT.server + `labs/view/staffId/${data.personal._id}`)
            .then((responce) => {
                if (responce.status === 200) {
                    setLabs([...responce.data]);
                    if (responce.data.length > 0) {
                        setDataL({
                            cameraIp: responce.data[0].cameraIp,
                            numberOfPcs: responce.data[0].numberOfPcs
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

    const addData = async (e) => {
        e.target.style.pointerEvents = "none";
        e.target.innerHTML =
            '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
        e.preventDefault();
        resetMessage();
        if (data.cameraIp !== "" && labs.length > 0) {
            await axios
                .post(CONSTANT.server + `labs/update/${labs[0]._id}`, dataL)
                .then((responce) => {
                    if (responce.status === 200) {
                        let res = responce.data;
                        if (res.message) {
                            setMessage(res.message, "danger");
                        } else {
                            setMessage("Camera IP Updated Successfully!", "success");
                            fetchLab();
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setMessage("Fill All Fields!", "danger");
        }

        e.target.style.pointerEvents = "unset";
        e.target.innerHTML = "Update";
    };
    return (
        <div className="__AddUser row d-flex justify-content-center align-items-center">
            <div className="form col-lg-6 col-sm-12">
                <h1 className="mb-5 text-center">My Lab</h1>
                {
                    labs.length > 0 ? <><div className="custom-input input-group mb-3">
                        <span className="input-group-text">
                            <AlternateEmailIcon />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Lab Name"
                            name="name"
                            value={labs.length > 0 ? labs[0].name : ""}
                            readOnly={true}
                            disabled={true}
                        />
                    </div>
                        <div className="custom-input input-group mb-3">
                            <span className="input-group-text">
                                <CameraOutdoorIcon />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Camera IP"
                                name="cameraIp"
                                value={dataL.cameraIp}
                                onChange={changeData}
                            />
                        </div>

                        <div className="custom-input input-group mb-3">
                            <span className="input-group-text">
                                <CameraOutdoorIcon />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Number of PCs"
                                name="numberOfPcs"
                                value={dataL.numberOfPcs}
                                onChange={changeData}
                            />
                        </div>
                        <p
                            className="text-danger p-0 m-0 mb-2"
                            id="error"
                            style={{ display: "none" }}
                        >
                            Error
                        </p>
                        <div className="w-100 mt-1 custom-button">
                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                    padding: "12px 15px",
                                }}
                                onClick={addData}
                            >
                                Update
                            </button>
                        </div></> : "Please wait..."
                }
            </div>
        </div>
    );
}
