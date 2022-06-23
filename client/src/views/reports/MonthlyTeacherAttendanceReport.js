import React, { useState, useEffect } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import Legend from "./../../components/Legend";
import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "../../CONSTANT";
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

  const fetchPreviousMonthDate = () => {
    let now = new Date();
    let today = "";
    if (now.getMonth() === 0) {
      today = new Date(now.getFullYear() - 1, 3, now.getDate());
    } else {
      today = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() - 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const [dates, setDates] = useState([]);
  const [labs, setLabs] = useState([]);
  const fetchDates = async () => {
    await axios
      .post(CONSTANT.server + `teacherAttendance/view/dated/monthly`, {
        from: fetchPreviousMonthDate(),
        till: fetchTodayDate(),
      })
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            let presentTeacher = res;
            axios
              .get(CONSTANT.server + "timetable/view")
              .then((responce2) => {
                if (responce2.status === 200) {
                  let slotsData = responce2.data;
                  if (slotsData.message) {
                    setMessage(slotsData.message, "danger");
                  } else {
                    let ddata = [];
                    [
                      ...new Set(
                        slotsData.map((a, b) => {
                          return a.teacherId;
                        })
                      ),
                    ].map((teacher, index) => {
                      let tS = slotsData.filter((a, b) => {
                        return a.teacherId === teacher;
                      });
                      let attended = 0;
                      tS.map((c, d) => {
                        if (presentTeacher.includes(c._id)) {
                          attended++;
                        }
                      });
                      ddata.push({
                        name: teacher,
                        total: tS.length,
                        attended: attended,
                      });
                    });
                    setDates(ddata);
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
          <span className="text-center text-muted display-6">Monthly Report</span>
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
                  <th scope="col" colspan="1"></th>
                  <th scope="col" colspan="3" className="text-center">
                    Number of Classes
                  </th>
                </tr>
                <tr>
                  <th scope="col">Teacher Name</th>
                  <th scope="col">Attended</th>
                  <th scope="col">Unattended</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates.map((date, i) => {
                      return (
                        <tr>
                          <td>
                            {labs.length > 0
                              ? labs
                                  .filter((a, b) => {
                                    return a._id === date.name.toString();
                                  })
                                  .map((a, b) => {
                                    return (
                                      a.username +
                                      " (" +
                                      a.email +
                                      " - " +
                                      a.identity
                                    );
                                  })
                              : ""}
                          </td>
                          <td>{date.attended}</td>
                          <td>
                            {parseInt(date.total) - parseInt(date.attended)}
                          </td>
                          <td>{date.total}</td>
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
