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

function ViewDailyEquipmentReport(props) {
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
      .get(
        CONSTANT.server + `dailyEquipmentReport/view/me/${data.personal._id}`
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

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchDates();
    }
  }, [data]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">View Daily Equipment Report</h1>
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
                  <th scope="col" colspan="4">
                    Status
                  </th>
                  <th scope="col" colspan="4">
                    Number of Issues
                  </th>
                  <th scope="col" colspan="2">
                    Info
                  </th>
                </tr>
                <tr>
                  <th scope="col">Hardware</th>
                  <th scope="col">Software</th>
                  <th scope="col">Networking</th>
                  <th scope="col">Other Equipment</th>
                  <th scope="col">Hardware</th>
                  <th scope="col">Software</th>
                  <th scope="col">Networking</th>
                  <th scope="col">Other Equipment</th>
                  <th scope="col">Description</th>
                  <th scope="col">Added On</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                    .filter((date, i) => {
                      return (
                        date.description.includes(search) ||
                        date.date.includes(search)
                      );
                    })
                    .map((date, i) => {
                      return (
                        <tr>
                          <td
                            className={`text-${date.problemDomain.hardware === "working"
                                ? "success"
                                : "danger"
                              }`}
                          >
                            {date.problemDomain.hardware
                              .slice(0, 1)
                              .toUpperCase() +
                              date.problemDomain.hardware.slice(1)}
                            <br />
                            {date.problemDomain.hardwareCategory !== "" ? `(${date.problemDomain.hardwareCategory})` : ""}
                          </td>
                          <td
                            className={`text-${date.problemDomain.software === "working"
                                ? "success"
                                : "danger"
                              }`}
                          >
                            {date.problemDomain.software
                              .slice(0, 1)
                              .toUpperCase() +
                              date.problemDomain.software.slice(1)}
                            <br />
                            {date.problemDomain.softwareCategory !== "" ? `(${date.problemDomain.softwareCategory})` : ""}
                          </td>
                          <td
                            className={`text-${date.problemDomain.networking === "working"
                                ? "success"
                                : "danger"
                              }`}
                          >
                            {date.problemDomain.networking
                              .slice(0, 1)
                              .toUpperCase() +
                              date.problemDomain.networking.slice(1)}
                            <br />
                            {date.problemDomain.networkingCategory !== "" ? `(${date.problemDomain.networkingCategory})` : ""}
                          </td>
                          <td
                            className={`text-${date.problemDomain.otherEquipment === "working"
                                ? "success"
                                : "danger"
                              }`}
                          >
                            {date.problemDomain.otherEquipment
                              .slice(0, 1)
                              .toUpperCase() +
                              date.problemDomain.otherEquipment.slice(1)}
                            <br />
                            {date.problemDomain.otherEquipmentCategory !== "" ? `(${date.problemDomain.otherEquipmentCategory})` : ""}
                          </td>
                          <td>{date.problemWithHardware}</td>
                          <td>{date.problemWithSoftware}</td>
                          <td>{date.problemWithNetworking}</td>
                          <td>{date.problemWithOtherEquipment}</td>
                          <td>{date.description}</td>
                          <td>{new Date(date.createdAt).toLocaleString()}</td>
                        </tr>
                      );
                    })
                  : "No Report"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDailyEquipmentReport;
