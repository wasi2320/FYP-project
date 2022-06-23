import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import UserData from "../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";
const axios = require("axios");

function Staff(props) {
  const { data, setData } = React.useContext(UserData);

  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const [isMarked, setIsMarked] = useState([]);

  const checkAttendance = async () => {
    await axios
      .post(CONSTANT.server + "staffAttendance/check", {
        staffId: data.personal._id,
        date: send.date,
      })
      .then((responce) => {
        if (responce.status === 200) {
          setIsMarked(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const __init = {
    staffId: "",
    date: fetchTodayDate(),
    status: "",
  };

  useEffect(() => {
    if (data.personal._id !== "") {
      checkAttendance();
    }
  }, [data]);
  const [send, setSend] = useState(__init);
  const changeSend = (e) => {
    setSend({
      ...send,
      [e.target.name]: e.target.value,
    });
  };
  const markAttendance = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (send.date !== "" && send.status !== "") {
      await axios
        .post(CONSTANT.server + "staffAttendance/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage(`Checked ${send.status} successfully!`, "success");
              setSend(__init);
              setIsMarked([]);
              checkAttendance();
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
    e.target.innerHTML = "Mark Attendance";
  };

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">Today's Date</span>
          <span className="text-center display-6">{send.date}</span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center w-50">
          <h1 className="mb-4 text-center">Mark Attendance</h1>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <CalendarTodayIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Date"
              name="date"
              disabled
              value={send.date}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <CoPresentIcon />
            </span>
            <select
              className="form-select form-control"
              name="status"
              onChange={changeSend}
              value={send.status}
              aria-label="Select Status"
              disabled={isMarked.length === 2 ? true : false}
            >
              <option
                value=""
                disabled
                selected={send.status === "" ? true : false}
              >
                Select Status
              </option>
              <option
                value="in"
                selected={send.status === "in" ? true : false}
                disabled={isMarked.includes("in") ? true : false}
              >
                In
              </option>
              <option
                value="out"
                disabled={
                  isMarked.includes("out") || isMarked.length < 1 ? true : false
                }
                selected={send.status === "out" ? true : false}
              >
                Out
              </option>
            </select>
          </div>
          <p className=" p-0 m-0 mb-2" id="error" style={{ display: "none" }}>
            Error
          </p>
          <div className="w-100 mt-1 custom-button">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                padding: "12px 15px",
              }}
              onClick={markAttendance}
              disabled={isMarked.length === 2 ? true : false}
            >
              {isMarked.length === 2 ? "Already Marked" : "Mark Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staff;
