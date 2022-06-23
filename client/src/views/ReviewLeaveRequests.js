import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import UserData from "../components/UserData";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromCommittee,
  checkLoginFromStaff,
  checkLoginFromHOD,
  setMessage,
  resetMessage,
  isMessage,
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

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function ReviewLeaveRequests(props) {
  let query = useQuery();
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState("");
  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    let type = query.get("type");
    setTypes(type);
    if (type === "committee") {
      if (checkLoginFromCommittee()) {
        navigate("/dashboard");
      }
    } else if (type === "hod") {
      if (checkLoginFromHOD()) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  }, []);

  const [dates, setDates] = useState([]);
  const [labs, setLabs] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(CONSTANT.server + `leaveRequest/view/${types}`)
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

  const confirm = async (id) => {
    await axios
      .put(CONSTANT.server + `leaveRequest/${types}/confirm/${id}`)
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
    if (data.personal._id !== "" && types !== "") {
      fetchLabOfStaff();
      fetchDates();
    }
  }, [data, types]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Review Leave Requests</h1>
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
                  <th scope="col">Proceed</th>
                  <th scope="col">Staff Person</th>
                  <th scope="col">Lab</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Content</th>
                  <th scope="col">Added On</th>
                  <th scope="col">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                    .filter((date, i) => {
                      return (
                        date.name.includes(search) ||
                        date.email.includes(search) ||
                        date.from.includes(search) ||
                        date.to.includes(search)
                      );
                    })
                    .map((date, i) => {
                      return (
                        <tr>
                          <td className="text-primary">
                            <u
                              role="button"
                              onClick={(e) => {
                                confirm(date._id);
                              }}
                            >
                              Confirm
                            </u>
                          </td>
                          <td>
                            {date.name} ({date.email} - {date.id})
                          </td>
                          <td>
                            {labs.length > 0
                              ? labs.filter((a, b) => {
                                return (
                                  a.controller === date.staffId.toString()
                                );
                              })[0].name
                              : ""}
                          </td>
                          <td>
                            {date.from} ({days[new Date(date.from).getDay()]})
                          </td>
                          <td>
                            {date.to} ({days[new Date(date.to).getDay()]})
                          </td>
                          <td>{date.content}</td>
                          <td>{new Date(date.createdAt).toLocaleString()}</td>
                          <td>{date.attachment !== "" ? <a href={`${CONSTANT.client}proofs/${date.attachment}`} target="_blank" download={true} role="button" className="text-primary">Download</a> : ""}</td>
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

export default ReviewLeaveRequests;
