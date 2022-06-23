import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CONSTANT, Loader } from "./../CONSTANT";
import { createSearchParams, useSearchParams } from "react-router-dom";
const axios = require("axios");

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function FeedbackPage(props) {
  let navigate = useNavigate();

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  const [message, setMessage] = useState({
    data: "Wrong QR",
    type: "",
    date: fetchTodayDate(),
    id: "",
    status: "",
    url: window.location.origin.replace(/(^\w+:|^)\/\//, ""),
    type: "",
    slot: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const checkStaffAttendance = async (id) => {
    await axios
      .post(CONSTANT.server + "staffAttendance/check", {
        staffId: id,
        date: fetchTodayDate(),
      })
      .then((responce) => {
        if (responce.status === 200) {
          let op = responce.data;
          if (op.length !== 2) {
            let status = "in";
            if (op.includes("in") && op.length === 1) {
              status = "out";
            }
            setMessage({
              ...message,
              status: status,
              type: searchParams.get("type"),
              id: searchParams.get("id"),
            });
          }
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkTeacherAttendance = async (id) => {
    await axios
      .get(
        CONSTANT.server +
          `timetable/view/teacher/qr/${id}/${days[new Date().getDay()]}`
      )
      .then((responce) => {
        if (responce.status === 200) {
          let hh = responce.data;
          if (hh.length > 0) {
            let slot = hh[0];
            axios
              .post(CONSTANT.server + "teacherAttendance/check", {
                teacherId: id,
                date: fetchTodayDate(),
                slotId: slot._id,
              })
              .then((responce) => {
                if (responce.status === 200) {
                  let op = responce.data;
                  if (op.length !== 2) {
                    let status = "in";
                    if (op.includes("in") && op.length === 1) {
                      status = "out";
                    }
                    setMessage({
                      ...message,
                      status: status,
                      type: searchParams.get("type"),
                      id: searchParams.get("id"),
                      slot: slot._id,
                    });
                  }
                  navigate("/");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [data, setData] = useState({
    personal: {
      username: "",
      email: "",
      phone: "",
      role: "",
      identity: "",
      createdAt: "",
      _id: "",
    },
    isLoggedIn: false,
  });

  useEffect(() => {
    if (localStorage.getItem("loggedin")) {
      setData({
        personal: {
          ...JSON.parse(localStorage.getItem("loggedin")).data,
        },
        isloggedIn: true,
      });
    }
  }, []);

  useEffect(() => {
    if (data.personal._id !== "") {
      if (
        message.date !== "" &&
        message.id !== "" &&
        message.status !== "" &&
        message.url !== "" &&
        message.type === "staff"
      ) {
        console.log("READY TO FLY STAFF");

        window.location.href = `${CONSTANT.server}staffAttendance/qrcode/${message.date}/${message.id}/${message.status}/${message.url}`;
      } else if (
        message.date !== "" &&
        message.id !== "" &&
        message.status !== "" &&
        message.url !== "" &&
        message.type === "teacher"
      ) {
        console.log("READY TO FLY TEACHER");

        window.location.href = `${CONSTANT.server}teacherAttendance/qrcode/${message.date}/${message.id}/${message.slot}/${message.status}/${message.url}`;
      } else if (
        searchParams.get("type") &&
        searchParams.get("type") === "staff" &&
        searchParams.get("id") &&
        message.status === "" &&
        message.type === "" &&
        message.id === ""
      ) {
        console.log("STAFF TYPE and ID get");
        if (searchParams.get("id") === data.personal._id.toString()) {
          console.log("TYPE and ID get - SAME USER");
          checkStaffAttendance(
            searchParams.get("id"),
            searchParams.get("type")
          );
        } else {
          console.log(
            "TYPE and ID get - NOT SAME USER",
            searchParams.get("id"),
            data.personal._id.toString()
          );
          navigate("/");
        }
      } else if (
        searchParams.get("type") &&
        searchParams.get("type") === "teacher" &&
        searchParams.get("id") &&
        message.status === "" &&
        message.type === "" &&
        message.id === ""
      ) {
        console.log("TEACHER TYPE and ID get");
        if (searchParams.get("id") === data.personal._id.toString()) {
          console.log("TYPE and ID get - SAME USER");
          checkTeacherAttendance(
            searchParams.get("id"),
            searchParams.get("type")
          );
        } else {
          console.log(
            "TYPE and ID get - NOT SAME USER",
            searchParams.get("id"),
            data.personal._id.toString()
          );
          navigate("/");
        }
      } else if (searchParams.get("message") && message.data === "Wrong QR") {
        console.log("MESSAGE SET");
        setMessage({
          ...message,
          data: searchParams.get("message"),
        });
      }
    }
  }, [searchParams, message, data]);
  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center text-center mt-5">
        <h1>{message.data}</h1>
        <div
          style={{ width: "15rem" }}
          className="mt-5 custom-button text-center"
        >
          <Link to="/">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                padding: "12px 15px",
              }}
            >
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage;
