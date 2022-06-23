import React, { useState, useEffect } from "react";
import "./../../css/Committee.css";
import UserData from "../../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import ComputerIcon from "@mui/icons-material/Computer";
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
} from "../../CONSTANT";
const axios = require("axios");

function DailyEquipmentCheckReport(props) {
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [filters, setFilters] = useState({
    staff: "",
    type: "",
    category: "",
  });

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
      .get(
        CONSTANT.server +
          `dailyEquipmentReport/view/dynamic/${props.type}/monthly`
      )
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

  const total = () => {
    let tt = 0;
    dates.map((a, b) => {
      tt += parseInt(a.problem);
    });
    return tt;
  };

  useEffect(() => {
    if (data.personal._id !== "" && props.type !== "") {
      fetchLabOfStaff();
      fetchDates();
    }
  }, [data, props]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5 row d-flex flex-row justify-content-center align-items-center">
          <span className="text-center text-muted display-6">Monthly Report</span>
          <span className="text-center display-6">{fetchTodayDate()}</span>
        </div>
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">
            {capitalizeFirstLetter(props.type)} Problems
          </h1>
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

          <div className="row">
            <div className="col-6">
              <div className="custom-input input-group mb-3">
                <span className="input-group-text">
                  <ComputerIcon />
                </span>
                <select
                  className="form-select form-control"
                  name="labId"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      staff: e.target.value,
                    });
                  }}
                  value={filters.staff}
                  aria-label="Select Lab"
                >
                  <option
                    value=""
                    selected={filters.staff === "" ? true : false}
                  >
                    Select Lab (All)
                  </option>
                  {labs.length > 0
                    ? labs.map((one, i) => {
                        return (
                          <option
                            key={one._id}
                            value={one.controller.toString()}
                            selected={
                              filters.staff === one.controller.toString()
                                ? true
                                : false
                            }
                          >
                            {one.name}
                          </option>
                        );
                      })
                    : ""}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="custom-input input-group mb-3">
                <span className="input-group-text">
                  <ComputerIcon />
                </span>
                <select
                  className="form-select form-control"
                  name="labId"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      category: e.target.value,
                    });
                  }}
                  value={filters.category}
                  aria-label="Select Category"
                >
                  <option
                    value=""
                    selected={filters.category === "" ? true : false}
                  >
                    Select Category (All)
                  </option>
                  {dates.length > 0
                    ? [
                        ...new Set(
                          dates.map((a, b) => {
                            return a.problemDomain;
                          })
                        ),
                      ].map((one, i) => {
                        return (
                          <option
                            key={one}
                            value={one}
                            selected={filters.category === one ? true : false}
                          >
                            {one}
                          </option>
                        );
                      })
                    : ""}
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Lab</th>
                  <th scope="col">Staff Name</th>
                  <th scope="col">Problems</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                      .filter((date, i) => {
                        return date.staffId.username.includes(search);
                      })
                      .filter((date, i) => {
                        return date.problemDomain.includes(filters.category);
                      })
                      .filter((date, i) => {
                        return date.staffId._id
                          .toString()
                          .includes(filters.staff);
                      })
                      .map((date, i) => {
                        return (
                          <tr>
                            <td>
                              {labs.length > 0
                                ? labs
                                    .filter((a, b) => {
                                      return (
                                        a.controller ===
                                        date.staffId._id.toString()
                                      );
                                    })
                                    .map((a, b) => {
                                      return a.name;
                                    })
                                : ""}
                            </td>
                            <td>
                              {date.staffId.username} ({date.staffId.email} -{" "}
                              {date.staffId.identity})
                            </td>
                            <td>
                              {date.problem}
                              {" PCs - "}
                              {date.problemDomain}
                            </td>
                            <td>{date.date}</td>
                          </tr>
                        );
                      })
                  : "No Report"}
                {dates.length > 0 ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <th scope="col">Total : {total()}</th>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyEquipmentCheckReport;
