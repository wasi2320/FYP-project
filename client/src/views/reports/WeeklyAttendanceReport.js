import React, { useState, useEffect } from "react";
import "./../../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import axios from "axios";

import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "./../../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ComputerIcon from "@mui/icons-material/Computer";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TodayIcon from "@mui/icons-material/Today";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UserData from "../../components/UserData";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
import Legend from "./../../components/Legend";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function WeeklyAttendanceReport() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromCommittee() && checkLoginFromHOD()) {
      navigate("/dashboard");
    }
  }, []);
  useEffect(() => {
    if (data.personal._id !== "") {
      fetchLab();
    }
  }, [data]);

  const [labs, setLabs] = useState([]);

  const fetchLab = async () => {
    await axios
      .get(CONSTANT.server + `labs/view/staffId`)
      .then((responce) => {
        if (responce.status === 200) {
          axios
            .post(CONSTANT.server + `timetable/lab`, responce.data)
            .then((responce2) => {
              if (responce2.status === 200) {
                if (responce2.data) {
                  setLabs([...responce2.data]);
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

  const __init = {
    labId: "",
    slots: [],
  };

  const [send, setSend] = useState(__init);

  const [range, setRange] = useState([[], []]);

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const fetchPreviousWeekDate = () => {
    let now = new Date();
    let today = "";
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const [StaffAttendance, setStaffAttendance] = useState([]);
  const fetchStaffAttendance = async (labId) => {
    await axios
      .post(CONSTANT.server + `staffAttendance/view/dated/weekly`, {
        from: fetchPreviousWeekDate(),
        till: fetchTodayDate(),
        staffId:
          labs.length > 1 &&
          labs.filter((a, b) => {
            return labId.toString() === a._id.toString();
          })[0].controller._id,
      })
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setStaffAttendance(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [TeacherAttendance, setTeacherAttendance] = useState([]);
  const fetchTeacherAttendance = async (labId) => {
    await axios
      .post(CONSTANT.server + `teacherAttendance/view/dated/weekly`, {
        from: fetchPreviousWeekDate(),
        till: fetchTodayDate(),
        labId: labId,
      })
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setTeacherAttendance(res);
            console.log(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fetchTimetable = async (labId) => {
    await axios
      .get(CONSTANT.server + `timetable/lab/${labId}`)
      .then((responce) => {
        if (responce.status === 200) {
          setSend({
            labId: labId,
            slots: responce.data.slots,
          });
          setRange(responce.data.addOn);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSpecificClass = (day, time) => {
    let data = send.slots.filter((slot, i) => {
      return (
        slot.day.toUpperCase() === day.toUpperCase() &&
        slot.startTime + "-" + slot.endTime === deFormatDate(time)
      );
    })[0];
    let lenOfAtten = 0;
    let title = [];
    TeacherAttendance.filter((a, b) => {
      return a.day.toUpperCase() === day.toUpperCase();
    }).map((a, b) => {
      a.data.map((c, d) => {
        if (c.startTime + "-" + c.endTime === deFormatDate(time)) {
          lenOfAtten++;
          title.push(
            `${capitalizeFirstLetter(c.status)} : ${new Date(
              c.time
            ).toLocaleTimeString()}`
          );
        }
      });
    });
    if (data) {
      return (
        <HtmlTooltip
          title={
            <React.Fragment>
              {title.length > 0 ? (
                title.map((a, b) => {
                  return (
                    <>
                      <span>{a}</span>
                      <br />
                    </>
                  );
                })
              ) : (
                <span>Absent</span>
              )}
            </React.Fragment>
          }
        >
          <td
            className={`bg-${
              parseInt(lenOfAtten) === 2
                ? "two"
                : parseInt(lenOfAtten) === 1
                ? "one"
                : "zero"
            }`}
          >
            <span className="text-primary h4">{data.subjectName}</span>
            <br />
            <span className="text-muted h5">{data.teacherId.username}</span>
          </td>
        </HtmlTooltip>
      );
    } else {
      return <td></td>;
    }
  };

  const deFormatDate = (time) => {
    let temp = time.split("-");
    let str = "";
    temp.map((one, i) => {
      let type = one.slice(one.length - 2);
      if (type === "AM") {
        str += one.slice(0, one.length - 2);
      } else {
        str +=
          parseInt(parseInt(one.slice(0, 2)) + 12) +
          one.slice(2, one.length - 2);
      }
      if (i === 0) {
        str += "-";
      }
    });
    return str;
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form row">
        <h1 className="mb-5 text-center">Weekly Attendance Report</h1>

        <Legend />

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <ComputerIcon />
          </span>
          <select
            className="form-select form-control"
            name="labId"
            onChange={(e) => {
              fetchTimetable(e.target.value);
              fetchStaffAttendance(e.target.value);
              fetchTeacherAttendance(e.target.value);
            }}
            value={send.labId}
            aria-label="Select Lab"
          >
            <option
              value=""
              disabled
              selected={send.labId === "" ? true : false}
            >
              Select Lab
            </option>
            {labs.length > 0
              ? labs.map((one, i) => {
                  return (
                    <option
                      key={one._id}
                      value={one._id}
                      selected={send.labId === one._id ? true : false}
                      disabled={!one.status}
                    >
                      {one.name}
                    </option>
                  );
                })
              : ""}
          </select>
        </div>
        <span className="mt-5"></span>
        <div className="">
          <p className="display-6">Staff Attendance</p>
          {send.labId !== "" ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Day</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {StaffAttendance.length > 0
                    ? StaffAttendance.map((one, i) => {
                        return (
                          <tr>
                            <td>{one.date}</td>
                            <td>{days[new Date(one.date).getDay()]}</td>
                            <td>
                              {one.data.map((a, b) => {
                                return (
                                  <>
                                    <span>
                                      {capitalizeFirstLetter(a.status)} :{" "}
                                      {new Date(a.time).toLocaleTimeString()}
                                    </span>
                                    <br />
                                  </>
                                );
                              })}
                            </td>
                          </tr>
                        );
                      })
                    : "No Staff Attendance"}
                </tbody>
              </table>
            </div>
          ) : (
            "No Lab Selected"
          )}
        </div>
        <span className="mt-5"></span>
        <div className="timetable">
          <p className="display-6">Teacher Attendance</p>
          {send.slots.length > 0 &&
          range[0].length > 0 &&
          range[1].length > 0 ? (
            <>
              {" "}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      {range[0].map((day, i) => {
                        return (
                          <th key={i} scope="col">
                            {day.slice(0, 1).toUpperCase() + "" + day.slice(1)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {range[1].map((time, i) => {
                      return (
                        <tr>
                          <td scope="col">{time}</td>
                          {range[0].map((day, i) => {
                            return fetchSpecificClass(day, time);
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            "No Lab Selected"
          )}
        </div>
      </div>
    </div>
  );
}
