import React, { useState, useEffect } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromCommittee,checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
} from "./../../CONSTANT";
const axios = require("axios");

function DailyLabBookingsReport(props) {
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
      .get(CONSTANT.server + `bookLab/view/all/monthly`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            let data = res;
            setDates(data);
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
          <span className="text-center text-muted display-6">
            Monthly Report
          </span>
          <span className="text-center display-6">{fetchTodayDate()}</span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Lab Bookings</h1>
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
                  <th scope="col">By</th>
                  <th scope="col">Event</th>
                  <th scope="col">Number of PC</th>
                  <th scope="col">Description</th>
                  <th scope="col">Labs</th>
                  <th scope="col">Completed?</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                      .filter((date, i) => {
                        return (
                          date.ename.includes(search) ||
                          date.name.includes(search) ||
                          date.email.includes(search)
                        );
                      })
                      .map((date, i) => {
                        return (
                          <tr>
                            <td>
                              {date.name} ({date.email})
                            </td>
                            <td>
                              {date.ename} (
                              {new Date(date.date).toLocaleDateString()}) - (
                              {date.time})
                            </td>
                            <td>{date.pc}</td>
                            <td>{date.desc}</td>
                            <td>
                              {date.confirmation
                                .map((a, b) => {
                                  return labs.filter((k, l) => {
                                    return k._id === a;
                                  })[0]?.name;
                                })
                                .map((a, b) => {
                                  return (
                                    <>
                                      <span>{a}</span>
                                      <br />
                                    </>
                                  );
                                })}
                            </td>
                            <td>{date.completed ? "Yes" : "No"}</td>
                            <td>{new Date(date.createdAt).toLocaleString()}</td>
                          </tr>
                        );
                      })
                  : "No Leave Requests"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyLabBookingsReport;
