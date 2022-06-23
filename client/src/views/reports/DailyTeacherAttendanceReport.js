import React, { useState, useEffect } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Legend from "./../../components/Legend";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "./../../CONSTANT";
const axios = require("axios");

function DailyTeacherAttendanceReport(props) {
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromCommittee() && checkLoginFromHOD()) {
      navigate("/dashboard");
    }
  }, []);

  const [labs, setLabs] = useState([]);

  const [dates, setDates] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(CONSTANT.server + `teacherAttendance/view/dated/today`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setDates(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchLabOfStaff = async () => {
    await axios
      .get(CONSTANT.server + `users/view/role/teacher`)
      .then((responce) => {
        if (responce.status === 200) {
          setLabs(responce.data);
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

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchLabOfStaff();
      fetchDates();
    }
  }, [data]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">Daily Report</span>
          <span className="text-center display-6">{fetchTodayDate()}</span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Teacher Attendance</h1>
          <Legend />
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <PersonSearchIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              name="search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
            />
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Lab</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Timings</th>
                  <th scope="col">Status</th>
                  <th scope="col">Confirmation</th>
                  <th scope="col">Marked On</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates.map((date, i) => {
                      return (
                        <tr
                          className={`bg-${
                            date.status === "in" ? "success" : "danger"
                          } text-light`}
                        >
                          <td>{date.date}</td>
                          <td>{date.name}</td>
                          <td>{date.subjectName}</td>
                          <td>{date.range}</td>
                          <td>{capitalizeFirstLetter(date.status)}</td>
                          <td>{date.confirmation ? "" : "Not "}Confirmed</td>
                          <td>{new Date(date.createdAt).toLocaleString()}</td>
                        </tr>
                      );
                    })
                  : "No Attendance"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyTeacherAttendanceReport;
