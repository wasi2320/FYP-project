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
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EmailIcon from "@mui/icons-material/Email";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function AddLeaveRequest() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const __init = {
    staffId: "",
    content: "",
    from: "",
    to: "",
    type: "",
    attachment: undefined
  };
  const [send, setSend] = useState(__init);
  const changeData = (e) => {
    setSend({
      ...send,
      [e.target.name]: e.target.name === "attachment" ? e.target.files[0] : e.target.value,
    });
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (send.content !== "" && send.from !== "" && send.to !== "" && send.type !== "") {
      let formData = new FormData();
      formData.append('staffId', data.personal._id);
      formData.append('content', send.content);
      formData.append('from', send.from);
      formData.append('to', send.to);
      formData.append('type', send.type);
      if (send.attachment) {
        formData.append('myfile', send.attachment);
      }
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      await axios
        .post(CONSTANT.server + "leaveRequest/insert", formData, config)
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage(
                "Application Sent to Committee Successfully!",
                "success"
              );
              setSend(__init);
              checkCasual()
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

  const [limit, setLimit] = useState(0);

  const checkCasual = async () => {
    await axios.get(CONSTANT.server + `leaveRequest/view/checkCasual/${data.personal._id}`).then((responce) => {
      if (responce.status === 200) {
        let res = responce.data;
        setLimit(res)
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (data.personal._id !== "") {
      checkCasual()
    }
  }, [data])

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form col-lg-6 col-sm-12">
        <h1 className="mb-5 text-center">Add Leave Request</h1>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <NotesIcon />
          </span>
          <textarea
            type="text"
            className="form-control"
            rows={10}
            placeholder="Write here..."
            name="content"
            onChange={changeData}
            value={send.content}
          ></textarea>
        </div>
        <div className="col-12">
          <label
            className={`text-dark`}
          >
            Select Type
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <CheckBoxIcon />
            </span>
            <select
              className="form-select form-control"
              name="type"
              onChange={changeData}
              value={data.type}
              aria-label="Select Type"
            >
              <option
                value=""
                selected
              >
                Select Type
              </option>
              <option
                value="casual"
                selected={
                  data.type === "casual" ? true : false
                }
                disabled={limit >= 2 ? true : false}
              >
                Casual ({2-limit} left)
              </option>
              <option
                value="medical"
                selected={data.type === "medical" ? true : false}
              >
                Medical
              </option>
              <option
                value="earned"
                selected={data.type === "earned" ? true : false}
              >
                Earned
              </option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <label
            className={`text-${send.to ? (send.from > send.to ? "danger" : "dark") : "dark"
              }`}
          >
            {send.to
              ? send.from > send.to
                ? "Can't be greater than 'to' date."
                : "From"
              : "From"}
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="date"
              className="form-control"
              placeholder="From"
              name="from"
              onChange={changeData}
              value={send.from}
            />
          </div>
        </div>
        <div className="col-12">
          <label
            className={`text-${send.to ? (send.to < send.from ? "danger" : "dark") : "dark"
              }`}
          >
            {send.to
              ? send.to < send.from
                ? "Can't be less than 'from' date."
                : "To"
              : "To"}
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="date"
              className="form-control"
              placeholder="To"
              name="to"
              onChange={changeData}
              value={send.to}
            />
          </div>
        </div>

        <div className="col-12">
          <label
            className={`text-dark`}
            for="formFile"
          >
            Attach Image of Proof (If Any)
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <UploadFileIcon />
            </span>
            <input
              type="file"
              className="form-control"
              placeholder="Attachment"
              name="attachment"
              onChange={changeData}
              id="formFile"
            />
          </div>
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
