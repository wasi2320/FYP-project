import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CONSTANT,
  checkLoginFromAdmin,
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
import { QRCodeCanvas } from "qrcode.react";

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

export default function AddUser() {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromAdmin()) {
      navigate("/dashboard");
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const __init = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
    identity: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const fetchUsers = async () => {
    await axios
      .get(CONSTANT.server + "users/view")
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setUsers(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteMe = async (id) => {
    await axios
      .post(CONSTANT.server + `users/delete/${id}`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setMessage("User Deleted Successfully!", "success");
            fetchUsers();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editMe = (id) => {
    let temp = users.filter((one, i) => {
      return one._id === id;
    })[0];
    setData({
      id: temp._id,
      username: temp.username,
      email: temp.email,
      password: "",
      phone: temp.phone,
      role: temp.role,
      identity: temp.identity,
    });
    handleModalOpen();
  };

  const updateData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      data.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    ) {
      if (
        data.username !== "" &&
        data.phone !== "" &&
        data.role !== "" &&
        data.identity !== ""
      ) {
        await axios
          .post(CONSTANT.server + `users/update/${data.id}`, data)
          .then((responce) => {
            if (responce.status === 200) {
              let res = responce.data;
              if (res.message) {
                setMessage(res.message, "danger");
              } else {
                fetchUsers();
                setMessage("User Updated Successfully!", "success");
                setData(__init);
                handleModalClose();
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setMessage("Fill All Fields", "danger");
      }
    } else {
      setMessage("Please Enter Valid Email", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Update";
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form viewPage col-12">
        <h1 className="mb-5 text-center">View Users</h1>
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
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Role</th>
                <th scope="col">Identity Number</th>
                <th scope="col">QR Code</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0
                ? users
                  .filter((user, i) => {
                    return (
                      user.username.includes(search) ||
                      user.email.includes(search) ||
                      user.phone.includes(search) ||
                      user.role.includes(search) ||
                      user.identity.includes(search)
                    );
                  })
                  .map((user, i) => {
                    return (
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>{user.identity}</td>
                        <td><QRCodeCanvas value={`feedback?type=${user.role}&id=${user._id}`} includeMargin={true} className="qrcode-image d-none" id={user._id} size={256} /><span role="button" className="text-primary" onClick={() => {
                          let link = document.createElement('a');
                          link.download = `${user.username}-qrcode.png`;
                          link.href = document.getElementById(user._id).toDataURL()
                          link.click();
                        }}>Download</span></td>
                        <td>
                          <span className="d-flex justify-content-center align-items-center">
                            <span
                              role="button"
                              className="text-danger"
                              onClick={(e) => {
                                deleteMe(user._id);
                              }}
                            >
                              <DeleteIcon />
                            </span>
                            <span
                              role="button"
                              className="mx-2 text-success"
                              onClick={(e) => {
                                editMe(user._id);
                              }}
                            >
                              <EditIcon />
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                : "No Users"}
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
              placeholder="Username"
              name="username"
              onChange={changeData}
              value={data.username}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <EmailIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              name="email"
              onChange={changeData}
              value={data.email}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <VpnKeyIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Leave Empty for Same Password"
              name="password"
              onChange={changeData}
              value={data.password}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <LocalPhoneIcon />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Phone"
              name="phone"
              onChange={changeData}
              value={data.phone}
            />
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <AdminPanelSettingsIcon />
            </span>
            <select
              className="form-select form-control"
              name="role"
              onChange={changeData}
              value={data.role}
              aria-label="Select Role"
            >
              <option
                value="admin"
                selected={data.role === "admin" ? true : false}
              >
                Admin
              </option>
              <option
                value="staff"
                selected={data.role === "staff" ? true : false}
              >
                Staff
              </option>
              <option
                value="teacher"
                selected={data.role === "teacher" ? true : false}
              >
                Teacher
              </option>
              <option
                value="committee"
                selected={data.role === "committee" ? true : false}
              >
                Committee
              </option>
              <option value="hod" selected={data.role === "hod" ? true : false}>
                HOD
              </option>
            </select>
          </div>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <NumbersIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Identity Number"
              name="identity"
              onChange={changeData}
              value={data.identity}
            />
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
