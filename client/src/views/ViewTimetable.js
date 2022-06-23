import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ComputerIcon from "@mui/icons-material/Computer";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TodayIcon from "@mui/icons-material/Today";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UserData from "../components/UserData";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function ViewTimetable() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
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
      .get(CONSTANT.server + `labs/view/staffId/${data.personal._id}`)
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
        slot.day === day &&
        slot.startTime + "-" + slot.endTime === deFormatDate(time)
      );
    })[0];
    if (data) {
      return (
        <td>
          <span className="text-primary h4">{data.subjectName}</span>
          <br />
          <span className="text-muted h5">{data.teacherId.username}</span>
        </td>
      );
    } else {
      return <td></td>;
    }
  };

  const editTimetable = () => {
    navigate(`/editTimetable?id=${send.labId}`);
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
        <h1 className="mb-5 text-center">View Timetable</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <ComputerIcon />
          </span>
          <select
            className="form-select form-control"
            name="labId"
            onChange={(e) => {
              fetchTimetable(e.target.value);
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

        <div className="timetable">
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
              <div>
                <button className="btn btn-primary" onClick={editTimetable}>
                  Edit
                </button>
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
