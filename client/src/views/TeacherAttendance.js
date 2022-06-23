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
  checkLoginFromTeacher,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";
const axios = require("axios");

function TeacherAttendance(props) {
  const { data, setData } = React.useContext(UserData);

  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromTeacher()) {
      navigate("/dashboard");
    }
  }, []);

  const [day, setDay] = useState("");
  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  };

  const __init = {
    date: fetchTodayDate(),
    slotId: "",
    status: "",
  };

  useEffect(() => {
    if (data.personal._id !== "") {
      let days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      setDay(days[new Date().getDay()]);
      fetchSlots(days[new Date().getDay()]);
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
    if (send.date !== "" && send.status !== "" && send.slotId !== "") {
      await axios
        .post(CONSTANT.server + "teacherAttendance/insert", {
          ...send,
          teacherId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage(`Checked ${send.status} successfully!`, "success");
              setSend(__init);
              fetchSlots();
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

  const [slots, setSlots] = useState([]);

  const fetchSlots = async (dday) => {
    await axios
      .get(
        CONSTANT.server +
          `timetable/view/teacher/${data.personal._id}/${day || dday}`
      )
      .then((responce) => {
        if (responce.status === 200) {
          axios
            .post(CONSTANT.server + `teacherAttendance/checkSlotAttendance`, {
              slots: responce.data,
              date: send.date,
              teacherId: data.personal._id,
            })
            .then((responce2) => {
              if (responce2.status === 200) {
                if (responce2.data) {
                  setSlots([...responce2.data]);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [featureLab, setFeatureLab] = useState("");

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">Today's Date</span>
          <span className="text-center display-6">
            {send.date} ({day && day[0].toUpperCase() + day.slice(1)})
          </span>
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
              name="featureLab"
              onChange={(e) => {
                setFeatureLab(e.target.value);
              }}
              value={featureLab}
              aria-label="Select Lab"
            >
              <option
                value=""
                disabled
                selected={featureLab === "" ? true : false}
              >
                Select Lab
              </option>
              {slots.length > 0 &&
                [
                  ...new Set(
                    slots.map((a) => {
                      return a.name;
                    })
                  ),
                ].map((one, i) => {
                  return (
                    <option
                      value={one}
                      selected={featureLab === one ? true : false}
                      key={one}
                    >
                      {one}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <CoPresentIcon />
            </span>
            <select
              className="form-select form-control"
              name="slotId"
              onChange={changeSend}
              value={send.slotId}
              aria-label="Select Slot"
            >
              <option
                value=""
                disabled
                selected={send.slotId === "" ? true : false}
              >
                Select Slot
              </option>
              {slots.length > 0 &&
                slots
                  .filter((a, b) => {
                    return featureLab === a.name;
                  })
                  .map((one, i) => {
                    return (
                      <option
                        value={one._id}
                        selected={send.slotId === one._id ? true : false}
                        key={one._id}
                        disabled={
                          one.status.length === 2 ||
                          !(
                            String(new Date().getHours()).padStart(2, "0") +
                              ":" +
                              String(new Date().getMinutes()).padStart(
                                2,
                                "0"
                              ) >=
                              one.startTime &&
                            String(new Date().getHours()).padStart(2, "0") +
                              ":" +
                              String(new Date().getMinutes()).padStart(
                                2,
                                "0"
                              ) <=
                              one.endTime
                          )
                        }
                      >
                        {one.subjectName} - {one.name} ({one.range}){" "}
                        {one.status.length === 2 && "(Already Marked)"}
                      </option>
                    );
                  })}
            </select>
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
              disabled={
                slots.length > 0 &&
                slots.filter((a, b) => {
                  return send.slotId === a._id;
                })[0]?.status.length === 2
                  ? true
                  : false
              }
            >
              <option value="" selected={send.status === "" ? true : false} disabled>
                Select Status
              </option>
              <option
                value="in"
                disabled={
                  slots.length > 0 &&
                  slots
                    .filter((a, b) => {
                      return send.slotId === a._id;
                    })[0]
                    ?.status.includes("in")
                    ? true
                    : false
                }
                selected={send.status === "in" ? true : false}
              >
                In
              </option>
              <option
                value="out"
                disabled={
                  slots.length > 0 &&
                  (slots
                    .filter((a, b) => {
                      return send.slotId === a._id;
                    })[0]
                    ?.status.includes("out") ||
                    slots.filter((a, b) => {
                      return send.slotId === a._id;
                    })[0]?.status.length < 1)
                    ? true
                    : false
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
            >
              {false ? "Already Marked" : "Mark Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;
