import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CONSTANT,
    checkLoginFromCommittee,
    setMessage,
    resetMessage,
    isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function AddCategory() {
    let navigate = useNavigate();

    useEffect(() => {
        if (checkLoginFromCommittee()) {
            navigate("/dashboard");
        }
    }, []);

    const __init = {
        type: "",
        name: "",
    };
    const [data, setData] = useState(__init);
    const changeData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const addData = async (e) => {
        e.target.style.pointerEvents = "none";
        e.target.innerHTML =
            '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
        e.preventDefault();
        resetMessage();
        if (data.name !== "" && data.type !== "") {
            await axios
                .post(CONSTANT.server + "categories/insert", data)
                .then((responce) => {
                    if (responce.status === 200) {
                        let res = responce.data;
                        if (res.message) {
                            setMessage(res.message, "danger");
                        } else {
                            setMessage("Category Added Successfully!", "success");
                            setData(__init);
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
        e.target.innerHTML = "Add";
    };
    return (
        <div className="__AddUser row d-flex justify-content-center align-items-center">
            <div className="form col-lg-6 col-sm-12">
                <h1 className="mb-5 text-center">Add Categories</h1>
                <div className="custom-input input-group mb-3">
                    <span className="input-group-text">
                        <AdminPanelSettingsIcon />
                    </span>
                    <select
                        className="form-select form-control"
                        name="type"
                        onChange={changeData}
                        value={data.type}
                        aria-label="Select Type"
                    >
                        <option
                            value=""
                            disabled
                            selected={data.type === "" ? true : false}
                        >
                            Select Category
                        </option>
                        {["Hardware", "Software", "Networking", "Other"].map((one, i) => {
                            return (
                                <option
                                    key={one}
                                    value={one.toLowerCase()}
                                    selected={data.type === one ? true : false}
                                >
                                    {one}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="custom-input input-group mb-3">
                    <span className="input-group-text">
                        <AlternateEmailIcon />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        onChange={changeData}
                        value={data.name}
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
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
