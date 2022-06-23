import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CONSTANT,
  checkLoginFromCommittee,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
import Modal from "@mui/material/Modal";

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

export default function ViewLabs() {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromCommittee()) {
      navigate("/dashboard");
    }
  }, []);

  const [labs, setLabs] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const __init = {
    name: "",
    controller: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

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

  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    await axios
      .get(CONSTANT.server + "users/view/role/staff")
      .then((responce) => {
        if (responce.status === 200) {
          setStaff(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchLabs();
    fetchStaff();
  }, []);

  const deleteMe = async (id) => {
    await axios
      .post(CONSTANT.server + `labs/delete/${id}`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setMessage("Lab Deleted Successfully!", "success");
            fetchLabs();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editMe = (id) => {
    let temp = labs.filter((one, i) => {
      return one._id === id;
    })[0];
    setData({
      id: temp._id,
      name: temp.name,
      controller: temp.controller._id,
    });
    handleModalOpen();
  };

  const updateData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (data.name !== "" && data.controller !== "") {
      await axios
        .post(CONSTANT.server + `labs/update/${data.id}`, data)
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              fetchLabs();
              setMessage("Lab Updated Successfully!", "success");
              setData(__init);
              handleModalClose();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill All Fields!", "danger");
    }

    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Update";
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form viewPage col-12">
        <h1 className="mb-5 text-center">View Labs</h1>
        <p className="p-0 m-0 mb-2" id="error" style={{ display: "none" }}>
          Error
        </p>

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
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Identity Number</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labs.length > 0
                ? labs
                    .filter((lab, i) => {
                      return (
                        lab.name.includes(search) ||
                        lab.controller.email.includes(search) ||
                        lab.controller.username.includes(search) ||
                        lab.controller.identity.includes(search)
                      );
                    })
                    .map((lab, i) => {
                      return (
                        <tr>
                          <th scope="row">{i + 1}</th>
                          <td>{lab.name}</td>
                          <td>{lab.controller.username}</td>
                          <td>{lab.controller.email}</td>
                          <td>{lab.controller.identity}</td>
                          <td>
                            <span className="d-flex justify-content-center align-items-center">
                              <span
                                role="button"
                                className="text-danger"
                                onClick={(e) => {
                                  deleteMe(lab._id);
                                }}
                              >
                                <DeleteIcon />
                              </span>
                              <span
                                role="button"
                                className="mx-2 text-success"
                                onClick={(e) => {
                                  editMe(lab._id);
                                }}
                              >
                                <EditIcon />
                              </span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                : "No Labs"}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal d-flex justify-content-center align-items-center"
      >
        <div className="form col-lg-6 col-sm-12 ">
          <p className="p-0 m-0 mb-2" id="error" style={{ display: "none" }}>
            Error
          </p>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <AlternateEmailIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="name"
              onChange={changeData}
              value={data.name}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <AdminPanelSettingsIcon />
            </span>
            <select
              className="form-select form-control"
              name="controller"
              onChange={changeData}
              value={data.controller}
              aria-label="Select Controller"
            >
              <option
                value=""
                disabled
                selected={data.controller === "" ? true : false}
              >
                Select Staff
              </option>
              {staff.length > 0
                ? staff.map((one, i) => {
                    return (
                      <option
                        key={one._id}
                        value={one._id}
                        selected={data.controller === one._id ? true : false}
                      >
                        {one.username} ({one.email})
                      </option>
                    );
                  })
                : ""}
            </select>
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
              onClick={updateData}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
