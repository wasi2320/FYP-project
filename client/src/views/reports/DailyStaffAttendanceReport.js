import React, { useState, useEffect } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Legend from "./../../components/Legend";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "./../../CONSTANT";
const axios = require("axios");

function DailyStaffAttendanceReport(props) {
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

  const [dates, setDates] = useState([]);
  const [labs, setLabs] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(CONSTANT.server + `staffAttendance/view/dated/${fetchTodayDate()}`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            let presentStaff = res;
            axios
              .get(CONSTANT.server + "users/view/role/staff")
              .then((responce2) => {
                if (responce2.status === 200) {
                  let res2 = responce2.data;
                  if (res2.message) {
                    setMessage(res2.message, "danger");
                  } else {
                    res2.map((staff, index) => {
                      let status = "absent";
                      if (presentStaff.includes(staff._id)) {
                        status = "present";
                      }
                      res2[index] = {
                        ...staff,
                        status: status,
                      };
                    });
                    setDates(res2);
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchLabOfStaff = async () => {
    await axios
      .get(CONSTANT.server + `labs/view/lab/fetch`)
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
          <h1 className="mb-4 text-center">Staff Attendance</h1>
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
                  <th scope="col">Lab</th>
                  <th scope="col">Staff Name</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                      .filter((date, i) => {
                        return (
                          date.username.includes(search) ||
                          date.status.includes(search)
                        );
                      })
                      .map((date, i) => {
                        return (
                          <tr
                            className={`bg-${
                              date.status === "present" ? "success" : "danger"
                            } text-light`}
                          >
                            <td>
                              {labs.length > 0
                                ? labs
                                    .filter((a, b) => {
                                      return (
                                        a.controller === date._id.toString()
                                      );
                                    })
                                    .map((a, b) => {
                                      return a.name;
                                    })
                                : ""}
                            </td>
                            <td>
                              {date.username} ({date.email} - {date.identity})
                            </td>
                            <td>{capitalizeFirstLetter(date.status)}</td>
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

export default DailyStaffAttendanceReport;
