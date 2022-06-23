import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate, useLocation } from "react-router-dom";
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

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddTimetable(props) {
  const { data, setData } = React.useContext(UserData);
  const [isEdit, setIsEdit] = useState(props.type === "edit" ? true : false);
  let navigate = useNavigate();

  let query = useQuery();
  useEffect(() => {
    if (isEdit) {
      let id = query.get("id");
      if (!id) {
        navigate("/viewTimetables");
      } else {
        fetchExisting(id);
      }
    }
  }, [isEdit]);

  const fetchExisting = async (labId) => {
    await axios
      .get(CONSTANT.server + `timetable/editLab/${labId}`)
      .then((responce) => {
        if (responce.status === 200) {
          if (responce.data.message) {
            navigate("/viewTimetables");
          }
          setSend(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);
  useEffect(() => {
    if (data.personal._id !== "") {
      fetchLab();
      fetchTeachers();
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
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    await axios
      .get(CONSTANT.server + `users/view/role/teacher`)
      .then((responce) => {
        if (responce.status === 200) {
          setTeachers(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const __init = {
    labId: "",
    slots: [
      {
        day: "",
        startTime: "",
        endTime: "",
        subjectName: "",
        teacherId: "",
      },
    ],
  };

  const [send, setSend] = useState(__init);
  const changeSend = (e) => {
    setSend({
      ...send,
      [e.target.name]: e.target.value,
    });
  };

  const actions = (type, index, e) => {
    if (type === "addSlot") {
      let tt = {
        day: "",
        startTime: "",
        endTime: "",
        subjectName: "",
        teacherId: "",
      };
      if (isEdit) {
        tt.labId = send.labId;
      }
      setSend({
        ...send,
        slots: [...send.slots, tt],
      });
    } else if (type === "removeSlot") {
      let temp = send.slots.filter((one, i) => {
        return i !== index;
      });
      setSend({
        ...send,
        slots: [...temp],
      });
    } else if (type === "update") {
      let temp = send.slots;
      temp[index] = {
        ...temp[index],
        [e.target.name]: e.target.value,
      };
      setSend({
        ...send,
        slots: [...temp],
      });
    }
  };

  const checkSlots = (e) => {
    resetMessage();
    send.slots.map((one, i) => {
      if (one.day === "") {
        setMessage("Enter day for slot#" + (i + 1), "danger");
      } else if (one.startTime === "") {
        setMessage("Enter start time for slot#" + (i + 1), "danger");
      } else if (one.endTime === "") {
        setMessage("Enter end time for slot#" + (i + 1), "danger");
      } else if (one.subjectName === "") {
        setMessage("Enter subject name for slot#" + (i + 1), "danger");
      } else if (one.teacherId === "") {
        setMessage("Select teacher for slot#" + (i + 1), "danger");
      }
    });
    if (!isMessage()) {
      if (isEdit) {
        updateTimetable(e);
      } else {
        createTimetable(e);
      }
    }
  };

  const createTimetable = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (send.labId !== "" && send.slots.length > 0) {
      await axios
        .post(CONSTANT.server + "timetable/insert", send)
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Timetable Created Successfully!", "success");
              setSend(__init);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill atleast one slot or select lab!", "danger");
    }

    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Create";
  };

  const labName = () => {
    try {
      return labs.filter((a, b) => {
        return send.labId === a._id;
      })[0].name;
    } catch (e) {
      return "";
    }
  };

  const updateTimetable = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (send.labId !== "" && send.slots.length > 0) {
      await axios
        .put(CONSTANT.server + "timetable/evaluate", send)
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else if (!res) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Timetable Updated Successfully!", "success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill atleast one slot or select lab!", "danger");
    }

    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Update";
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form row">
        <h1 className="mb-5 text-center">
          {isEdit ? "Edit" : "Add"} Timetable
        </h1>

        {isEdit ? (
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <ComputerIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Lab"
              name="labId"
              value={labName()}
              disabled={true}
            />
          </div>
        ) : (
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <ComputerIcon />
            </span>
            <select
              className="form-select form-control"
              name="labId"
              onChange={(e) => {
                changeSend(e);
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
                        disabled={one.status}
                      >
                        {one.name} {one.status ? "(Already Created)" : ""}
                      </option>
                    );
                  })
                : ""}
            </select>
          </div>
        )}

        {send.slots.map((item, i) => {
          return (
            <div className="row mt-3 mb-3" key={i}>
              <div className="col-lg-4 col-sm-12">
                <label className="text-muted">
                  Slot #{i + 1} (
                  <span
                    className="text-danger"
                    role="button"
                    onClick={(e) => {
                      actions("removeSlot", i);
                    }}
                  >
                    Delete
                  </span>
                  )
                </label>
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">
                    <TodayIcon />
                  </span>
                  <select
                    className="form-select form-control"
                    name="day"
                    onChange={(e) => {
                      actions("update", i, e);
                    }}
                    value={item.day}
                    aria-label="Select Day"
                  >
                    <option
                      value=""
                      disabled
                      selected={item.day === "" ? true : false}
                    >
                      Select Day
                    </option>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((one, i) => {
                      return (
                        <option
                          key={one}
                          value={one.toLowerCase()}
                          selected={
                            item.day === one.toLowerCase() ? true : false
                          }
                        >
                          {one}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <label>Start Time</label>
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">
                    <HourglassEmptyIcon />
                  </span>
                  <input
                    type="time"
                    step={60 * 30}
                    className="form-control"
                    placeholder="Start Time"
                    name="startTime"
                    onChange={(e) => {
                      actions("update", i, e);
                    }}
                    value={item.startTime}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <label>End Time</label>
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">
                    <HourglassEmptyIcon />
                  </span>
                  <input
                    type="time"
                    step={60 * 30}
                    className="form-control"
                    placeholder="End Time"
                    name="endTime"
                    onChange={(e) => {
                      actions("update", i, e);
                    }}
                    value={item.endTime}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">
                    <SubjectIcon />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject Name"
                    name="subjectName"
                    onChange={(e) => {
                      actions("update", i, e);
                    }}
                    value={item.subjectName}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">
                    <AccountBoxIcon />
                  </span>
                  <select
                    className="form-select form-control"
                    name="teacherId"
                    onChange={(e) => {
                      actions("update", i, e);
                    }}
                    value={item.teacherId}
                    aria-label="Select Teacher"
                  >
                    <option
                      value=""
                      disabled
                      selected={item.labId === "" ? true : false}
                    >
                      Select Teacher
                    </option>
                    {teachers.length > 0
                      ? teachers.map((one, i) => {
                          return (
                            <option
                              key={one._id}
                              value={one._id}
                              selected={
                                item.teacherId === one._id ? true : false
                              }
                            >
                              {one.username} ({one.email})
                            </option>
                          );
                        })
                      : ""}
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        <p
          className="text-danger p-0 m-0 mb-2"
          id="error"
          style={{ display: "none" }}
        >
          Error
        </p>
        <div className="row mt-1 custom-button">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-success "
              style={{
                padding: "12px 15px",
              }}
              onClick={() => {
                actions("addSlot");
              }}
            >
              Add Slot
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-primary col-6"
              style={{
                padding: "12px 15px",
              }}
              onClick={checkSlots}
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
