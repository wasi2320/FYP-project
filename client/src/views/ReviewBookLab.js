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
import Modal from "@mui/material/Modal";

import {
  CONSTANT,
  checkLoginFromCommittee,
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

function ReviewBookLab(props) {
  const [labs, setLabs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const fetchLabs = async () => {
    await axios
      .get(CONSTANT.server + "labs/view")
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setLabs(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchLabs();
  }, []);
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");
  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromCommittee()) {
      navigate("/dashboard");
    }
  }, []);

  const [dates, setDates] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(CONSTANT.server + `bookLab/view/`)
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

  const [app, setApp] = useState([])
  const [item, setItem] = useState("")



  const confirm = async () => {
    await axios
      .put(CONSTANT.server + `bookLab/confirm/${item}`, {
        confirmation: app
      })
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            fetchDates();
            handleModalClose();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">Review Lab Booking</h1>
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
                  <th scope="col">Action</th>
                  <th scope="col">By</th>
                  <th scope="col">Event</th>
                  <th scope="col">Number of PC</th>
                  <th scope="col">Description</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                    .filter((date, i) => {
                      return (
                        date.name.includes(search) ||
                        date.ename.includes(search) ||
                        date.email.includes(search) ||
                        date.date.includes(search) ||
                        date.time.includes(search) ||
                        date.pc.includes(search)
                      );
                    })
                    .map((date, i) => {
                      return (
                        <tr>
                          <td className="text-primary">
                            <u
                              role="button"
                              onClick={(e) => {
                                handleModalOpen();
                                setItem(date._id)
                              }}
                            >
                              Confirm
                            </u>
                          </td>
                          <td>
                            {date.name} ({date.email})
                          </td>
                          <td>{date.ename} ({new Date(date.date).toLocaleDateString()}) - ({date.time})</td>
                          <td>{date.pc}</td>
                          <td>{date.desc}</td>
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
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal d-flex justify-content-center align-items-center"
      >
        <div className="card col-lg-8 col-sm-12 p-3">
          <p className="p-0 m-0 mb-2" id="error" style={{ display: "none" }}>
            Error
          </p>
          <div className="row d-flex justify-content-around align-items-center mt-2 mb-2">
            {
              labs.length > 0 ? labs.map((a, b) => {
                return <div className={`col-4 card-header d-flex justify-content-center align-items-center flex-column font-weight-bold bg-${app.includes(a._id) ? "success" : "warning"}`} style={{ height: "50px" }} role="button" onClick={(e) => {
                  if (app.includes(a._id)) {
                    setApp([...removeItemOnce(app, a._id)])
                  }
                  else {
                    setApp([...app, a._id])
                  }
                }}>
                  <span>{a.name}</span>
                  <span>PC : {a.numberOfPcs}</span>
                </div>
              }) : "No Labs"
            }
          </div>
          <p
            className="text-danger p-0 m-0 mb-2"
            id="error"
            style={{ display: "none" }}
          >
            Error
          </p>
          <div className="w-100 mt-1 custom-button">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                padding: "12px 15px",
              }}
              onClick={confirm}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ReviewBookLab;
