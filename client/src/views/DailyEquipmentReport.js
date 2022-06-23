import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserData from "../components/UserData";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import NotesIcon from "@mui/icons-material/Notes";
import CellTowerIcon from "@mui/icons-material/CellTower";
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmailIcon from "@mui/icons-material/Email";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import HardwareIcon from "@mui/icons-material/Hardware";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function DailyEquipmentReport() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  };
  const __init = {
    staffId: "",
    problemDomain: {
      hardware: "",
      software: "",
      networking: "",
      otherEquipment: "",
      hardwareCategory: "",
      softwareCategory: "",
      networkingCategory: "",
      otherEquipmentCategory: "",
    },
    problemWithHardware: 0,
    problemWithSoftware: 0,
    problemWithNetworking: 0,
    problemWithOtherEquipment: 0,
    description: "",
    date: fetchTodayDate(),
  };
  const [send, setSend] = useState(__init);
  const changeData = (e) => {
    if (e.target.name === "problemDomain") {
      setSend({
        ...send,
        problemDomain: {
          ...send.problemDomain,
          [e.target.getAttribute("data-name")]: e.target.value,
        },
      });
    } else {
      setSend({
        ...send,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      send.problemDomain.hardware !== "" &&
      send.problemDomain.software !== "" &&
      send.problemDomain.networking !== "" &&
      send.problemDomain.otherEquipment !== "" &&
      send.description !== ""
    ) {
      await axios
        .post(CONSTANT.server + "dailyEquipmentReport/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Report Submitted Successfully!", "success");
              setSend(__init);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill All Fields", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Add";
  };

  const [cat, setCat] = useState([])
  const getCat = async () => {
    await axios
      .get(CONSTANT.server + `categories/view`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setCat(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getCat();
  }, []);

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form col-lg-6 col-sm-12">
        <h1 className="mb-5 text-center">Daily Equipment Report</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CalendarTodayIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Date"
            name="date"
            disabled
            value={send.date}
          />
        </div>
        <br />

        <h5>Problem Domains</h5>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <HardwareIcon />
          </span>
          <select
            className="form-select form-control"
            name="problemDomain"
            data-name="hardware"
            onChange={changeData}
            value={send.problemDomain.hardware}
            aria-label="Hardware"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.hardware === "" ? true : false}
            >
              Hardware
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.hardware === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.hardware === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.hardware === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        {
          send.problemDomain.hardware !== "working" && send.problemDomain.hardware !== "" ?
            <div className="custom-input input-group mb-3">
              <span className="input-group-text">
                <HardwareIcon />
              </span>
              <select
                className="form-select form-control"
                name="problemDomain"
                data-name="hardwareCategory"
                onChange={changeData}
                value={send.problemDomain.hardwareCategory}
                aria-label="Hardware Category"
              >
                <option
                  value=""
                  disabled
                  selected={send.problemDomain.hardwareCategory === "" ? true : false}
                >
                  Hardware Category
                </option>
                {
                  cat.length > 0 ? cat.filter((a, b) => { return a.type === "hardware" }).map((a, b) => {
                    return <option
                      value={a.name}
                      selected={
                        send.problemDomain.hardwareCategory === a.name ? true : false
                      }
                    >
                      {a.name}
                    </option>
                  }) : ""
                }
              </select>
            </div> : ""
        }  {send.problemDomain.hardware !== "working" && send.problemDomain.hardware !== "" ? <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <HardwareIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Number of PC - Hardware"
            name="problemWithHardware"
            onChange={changeData}
            value={data.problemWithHardware}
          />
        </div> : ""}
        {/* hardware */}
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <AppShortcutIcon />
          </span>
          <select
            className="form-select form-control"
            name="problemDomain"
            data-name="software"
            onChange={changeData}
            value={send.problemDomain.software}
            aria-label="Software"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.software === "" ? true : false}
            >
              Software
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.software === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.software === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.software === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        {
          send.problemDomain.software !== "working" && send.problemDomain.software !== "" ? <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <AppShortcutIcon />
            </span>
            <select
              className="form-select form-control"
              name="problemDomain"
              data-name="softwareCategory"
              onChange={changeData}
              value={send.problemDomain.softwareCategory}
              aria-label="Software Category"
            >
              <option
                value=""
                disabled
                selected={send.problemDomain.softwareCategory === "" ? true : false}
              >
                Software Category
              </option>
              {
                cat.length > 0 ? cat.filter((a, b) => { return a.type === "software" }).map((a, b) => {
                  return <option
                    value={a.name}
                    selected={
                      send.problemDomain.softwareCategory === a.name ? true : false
                    }
                  >
                    {a.name}
                  </option>
                }) : ""
              }
            </select>
          </div> : ""
        }

        {
          send.problemDomain.software !== "working" && send.problemDomain.software !== "" ?
            <div className="custom-input input-group mb-3">
              <span className="input-group-text">
                <AppShortcutIcon />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Number of PC - Software"
                name="problemWithSoftware"
                onChange={changeData}
                value={data.problemWithSoftware}
              />
            </div> : ""
        }
        {/* software */}
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CellTowerIcon />
          </span>
          <select
            className="form-select form-control"
            name="problemDomain"
            data-name="networking"
            onChange={changeData}
            value={send.problemDomain.networking}
            aria-label="Networking"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.networking === "" ? true : false}
            >
              Networking
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.networking === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.networking === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.networking === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        {
          send.problemDomain.networking !== "working" && send.problemDomain.networking !== "" ? <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <CellTowerIcon />
            </span>
            <select
              className="form-select form-control"
              name="problemDomain"
              data-name="networkingCategory"
              onChange={changeData}
              value={send.problemDomain.networkingCategory}
              aria-label="Networking Category"
            >
              <option
                value=""
                disabled
                selected={send.problemDomain.networkingCategory === "" ? true : false}
              >
                Networking Category
              </option>
              {
                cat.length > 0 ? cat.filter((a, b) => { return a.type === "networking" }).map((a, b) => {
                  return <option
                    value={a.name}
                    selected={
                      send.problemDomain.networkingCategory === a.name ? true : false
                    }
                  >
                    {a.name}
                  </option>
                }) : ""
              }
            </select>
          </div> : ""
        }
        {
          send.problemDomain.networking !== "working" && send.problemDomain.networking !== "" ?
            <div className="custom-input input-group mb-3">
              <span className="input-group-text">
                <CellTowerIcon />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Number of PC - Networking"
                name="problemWithNetworking"
                onChange={changeData}
                value={data.problemWithNetworking}
              />
            </div> : ""
        }

        {/* networking */}
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <DevicesOtherIcon />
          </span>
          <select
            className="form-select form-control"
            name="problemDomain"
            data-name="otherEquipment"
            onChange={changeData}
            value={send.problemDomain.otherEquipment}
            aria-label="Other Equipment"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.otherEquipment === "" ? true : false}
            >
              Other Equipment
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.otherEquipment === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.otherEquipment === "notWorking"
                  ? true
                  : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.otherEquipment === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        {
          send.problemDomain.otherEquipment !== "working" && send.problemDomain.otherEquipment !== "" ? <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <DevicesOtherIcon />
            </span>
            <select
              className="form-select form-control"
              name="problemDomain"
              data-name="otherEquipmentCategory"
              onChange={changeData}
              value={send.problemDomain.otherEquipmentCategory}
              aria-label="Other Equipment Category"
            >
              <option
                value=""
                disabled
                selected={send.problemDomain.otherEquipmentCategory === "" ? true : false}
              >
                Other Equipment Category
              </option>
              {
                cat.length > 0 ? cat.filter((a, b) => { return a.type === "other" }).map((a, b) => {
                  return <option
                    value={a.name}
                    selected={
                      send.problemDomain.otherEquipmentCategory === a.name ? true : false
                    }
                  >
                    {a.name}
                  </option>
                }) : ""
              }
            </select>
          </div> : ""
        }
        {send.problemDomain.otherEquipment !== "working" && send.problemDomain.otherEquipment !== "" ? <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <DevicesOtherIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Number of PC - Other Equipment"
            name="problemWithOtherEquipment"
            onChange={changeData}
            value={data.problemWithOtherEquipment}
          />
        </div>
          : ""}

        {/* other */}




        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <NotesIcon />
          </span>
          <textarea
            type="text"
            className="form-control"
            rows={5}
            placeholder="Problem description..."
            name="description"
            onChange={changeData}
            value={send.description}
          ></textarea>
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
            onClick={addData}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
