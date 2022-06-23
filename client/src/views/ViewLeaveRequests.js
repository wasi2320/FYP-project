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
  capitalizeFirstLetter,
} from "../CONSTANT";
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

function ViewLeaveRequests(props) {
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");
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
      .get(CONSTANT.server + `leaveRequest/view/me/${data.personal._id}`)
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

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchDates();
    }
  }, [data]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">View Leave Requests</h1>
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
                  <th scope="col">Committee Status</th>
                  <th scope="col">HOD Status</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Content</th>
                  <th scope="col">Type</th>
                  <th scope="col">Added On</th>
                  <th scope="col">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                      .filter((date, i) => {
                        return (  
                          date.from.includes(search) ||
                          date.to.includes(search) ||
                          date.content.includes(search) ||
                          date.createdAt.includes(search) ||
                          date.type.includes(search.toLowerCase())
                        );
                      })
                      .map((date, i) => {
                        return (
                          <tr>
                            <td
                              className={`text-${
                                date.confirmation1 ? "success" : "danger"
                              }`}
                            >
                              {date.confirmation1 ? "Clear" : "Pending"}
                            </td>
                            <td
                              className={`text-${
                                date.confirmation2 ? "success" : "danger"
                              }`}
                            >
                              {date.confirmation2 ? "Clear" : "Pending"}
                            </td>
                            <td>
                              {date.from} ({days[new Date(date.from).getDay()]})
                            </td>
                            <td>
                              {date.to} ({days[new Date(date.to).getDay()]})
                            </td>
                            <td>{date.content}</td>
                            <td>{capitalizeFirstLetter(date.type)}</td>
                            <td>{new Date(date.createdAt).toLocaleString()}</td>
                            <td>
                              {date.attachment !== "" ? (
                                <a
                                  href={`${CONSTANT.client}proofs/${date.attachment}`}
                                  target="_blank"
                                  download={true}
                                  role="button"
                                  className="text-primary"
                                >
                                  Download
                                </a>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        );
                      })
                  : "No Requests"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLeaveRequests;
