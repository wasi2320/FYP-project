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
export default function AddLab() {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromCommittee()) {
      navigate("/dashboard");
    }
    fetchStaff();
  }, []);

  const __init = {
    name: "",
    controller: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    await axios
      .get(CONSTANT.server + "users/view/role/staff")
      .then((responce) => {
        if (responce.status === 200) {
          setStaff(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (data.name !== "" && data.controller !== "") {
      await axios
        .post(CONSTANT.server + "labs/insert", data)
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Lab Added Successfully!", "success");
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
        <h1 className="mb-5 text-center">Add Lab</h1>
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
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <AdminPanelSettingsIcon />
          </span>
          <select
            className="form-select form-control"
            name="controller"
            onChange={changeData}
            value={data.controller}
            aria-label="Select Controller"
          >
            <option
              value=""
              disabled
              selected={data.controller === "" ? true : false}
            >
              Select Staff
            </option>
            {staff.length > 0
              ? staff.map((one, i) => {
                  return (
                    <option
                      key={one._id}
                      value={one._id}
                      selected={data.controller === one._id ? true : false}
                    >
                      {one.username} ({one.email})
                    </option>
                  );
                })
              : ""}
          </select>
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
