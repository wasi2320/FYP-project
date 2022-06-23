import React, { useState, useEffect, useRef } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { Chart } from "react-google-charts";
import Legend from "./../../components/Legend";

import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "../../CONSTANT";
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
    fetchStaff();
  }, []);

  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState([]);
  const absentDate = useRef(null);

  const makeAbsentsTd = (presents, totaldays, firstDate) => {
    let temp = [];
    let day = new Date(firstDate);
    let nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    let myDate = nextDay;
    [...Array(totaldays).keys()].map((a, b) => {
      day = new Date(myDate);
      nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      myDate = nextDay;
      if (presents.includes(formatDate(myDate))) {
        return "";
      }
      temp.push(formatDate(myDate));
    });
    return temp;
  };

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

  const [dates, setDates] = useState();
  const [labs, setLabs] = useState([]);
  const fetchDates = async (staffIdd) => {
    await axios
      .post(CONSTANT.server + `staffAttendance/view/dated`, {
        from: fetchPreviousMonthDate(),
        till: fetchTodayDate(),
        staffId: staffIdd,
      })
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

  const formatDate = (date) => {
    var today = new Date(date);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

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

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchLabOfStaff();
    }
  }, [data]);
  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">
            Monthly Report
          </span>
          <span className="text-center display-6">
            {fetchPreviousMonthDate() + " - " + fetchTodayDate()}
          </span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Staff Attendance</h1>
          <Legend />
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <AdminPanelSettingsIcon />
            </span>
            <select
              className="form-select form-control"
              name="staffId"
              onChange={(e) => {
                setStaffId(e.target.value);
                fetchDates(e.target.value);
              }}
              value={staffId}
              aria-label="Select Staff"
            >
              <option
                value=""
                disabled
                selected={staffId === "" ? true : false}
              >
                Select Staff
              </option>
              {staff.length > 0
                ? staff.map((one, i) => {
                    return (
                      <option
                        key={one._id}
                        value={one._id}
                        selected={staffId === one._id ? true : false}
                      >
                        {one.username} ({one.email})
                      </option>
                    );
                  })
                : ""}
            </select>
          </div>

          <div className="mt-3">
            {dates ? (
              <>
                <div className="mr-4">
                  <h4>
                    Staff :{" "}
                    {dates.staff.length > 0
                      ? dates.staff
                          .filter((a, b) => {
                            return a._id === staffId.toString();
                          })
                          .map((a, b) => {
                            if (b > 0) return;
                            return (
                              a.username +
                              " (" +
                              a.email +
                              " - " +
                              a.identity +
                              ")"
                            );
                          })
                      : ""}
                  </h4>
                  <br />
                  <h4>
                    Lab Assigned :{" "}
                    {labs.length > 0
                      ? labs
                          .filter((a, b) => {
                            return a.controller === staffId.toString();
                          })
                          .map((a, b) => {
                            if (b > 0) return;
                            return a.name;
                          })
                      : ""}
                  </h4>
                </div>
              </>
            ) : (
              ""
            )}
            {dates ? (
              <Chart
                chartType="PieChart"
                data={[
                  ["Status", "Quantity"],
                  ["Present", dates.present],
                  ["Absent", dates.absent],
                ]}
                options={{
                  title: `Attendance of Last ${dates.total} days!`,
                  is3D: true,
                }}
                width={"100%"}
                height={"600px"}
              />
            ) : (
              ""
            )}
          </div>
          {dates ? (
            <div className="table-responsive mt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Absent Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {dates.staff.length > 0
                    ? makeAbsentsTd(
                        dates.staff.map((a, b) => {
                          return a.date;
                        }),
                        dates.total,
                        fetchPreviousMonthDate()
                      ).map((a, b) => {
                        return (
                          <tr className="bg-danger text-light">
                            <td>{a}</td>
                          </tr>
                        );
                      })
                    : "No Attendance"}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyStaffAttendanceReport;
