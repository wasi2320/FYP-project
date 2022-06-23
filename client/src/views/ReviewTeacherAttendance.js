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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Teacher(props) {
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const [dates, setDates] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(
        CONSTANT.server + `teacherAttendance/view/staff/${data.personal._id}`
      )
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

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const confirmAttendance = async (id) => {
    await axios
      .put(CONSTANT.server + `teacherAttendance/update/confirm/${id}`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            fetchDates();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchDates();
    }
  }, [data]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">Today's Date</span>
          <span className="text-center display-6">{fetchTodayDate()}</span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Review Attendance</h1>
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
                  ? dates
                      .filter((date, i) => {
                        return (
                          date.date.includes(search) ||
                          date.status.includes(search) ||
                          date.name.includes(search) ||
                          date.subjectName.includes(search) ||
                          date.createdAt.includes(search) ||
                          date.range.includes(search) ||
                          days[new Date(date.date).getDay()].includes(search)
                        );
                      })
                      .map((date, i) => {
                        return (
                          <tr>
                            <td>
                              {date.date} ({days[new Date(date.date).getDay()]})
                            </td>
                            <td>{date.name}</td>
                            <td>{date.subjectName}</td>
                            <td>{date.range}</td>
                            <td
                              className={`text-${
                                date.status === "in" ? "success" : "danger"
                              }`}
                            >
                              {capitalizeFirstLetter(date.status)}
                            </td>
                            <td className="text-primary">
                              <u
                                role="button"
                                onClick={(e) => {
                                  confirmAttendance(date._id);
                                }}
                              >
                                Confirm
                              </u>
                            </td>
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

export default Teacher;
