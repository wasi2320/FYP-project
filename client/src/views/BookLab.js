import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserData from "../components/UserData";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import InputIcon from '@mui/icons-material/Input';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import NotesIcon from "@mui/icons-material/Notes";
import CellTowerIcon from "@mui/icons-material/CellTower";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmailIcon from "@mui/icons-material/Email";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import HardwareIcon from "@mui/icons-material/Hardware";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

import ComputerIcon from "@mui/icons-material/Computer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function BookLab() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();
  const __init = {
    email: "",
    name: "",
    ename: "",
    date: "",
    time: "",
    pc: "",
    desc: "",
  };
  const [send, setSend] = useState(__init);
  const changeData = (e) => {
    setSend({
      ...send,
      [e.target.name]: e.target.value,
    });
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      send.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(send.email) &&
      send.name !== "" &&
      send.ename !== "" &&
      send.date !== "" &&
      send.time !== "" &&
      send.pc !== "" &&
      send.desc !== ""
    ) {
      await axios
        .post(CONSTANT.server + "bookLab/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Lab Booking Requested Successfully!", "success");
              setSend(__init);

            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill All Fields", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Add";
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center mt-5">
      <div className="form col-lg-6 col-sm-12">
        <h1 className="mb-5 text-center">Book Lab</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <InputIcon />
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={send.email}
            onChange={changeData}
          />
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <InputIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={send.name}
            onChange={changeData}
          />
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <InputIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Event Name"
            name="ename"
            value={send.ename}
            onChange={changeData}
          />
        </div>

        <div className="col-12">
          <label>Event Date</label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="date"
              className="form-control"
              placeholder="Event Date"
              name="date"
              onChange={changeData}
              value={send.date}
            />
          </div>
        </div>
        <div className="col-12">
          <label>Event Time</label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="time"
              step={60 * 30}
              className="form-control"
              placeholder="Event Time"
              name="time"
              onChange={changeData}
              value={send.time}
            />
          </div>
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <InputIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Number of PC"
            name="pc"
            value={send.pc}
            onChange={changeData}
          />
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <InputIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            name="desc"
            value={send.desc}
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
            Add
          </button>
        </div> <div className="w-100 mt-1 custom-button mt-5">
          <Link to="/"><button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "12px 15px",
            }}
            onClick={""}
          >
            Go Home
          </button></Link>
        </div>
      </div>
    </div>
  );
}
