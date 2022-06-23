import React, { useState, useEffect } from "react";
import "./../css/Staff.css";
import UserData from "../components/UserData";
import { Link } from "react-router-dom";
import { CONSTANT, Loader } from "./../CONSTANT";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { QrReader } from "react-qr-reader";
const axios = require("axios");

function Staff(props) {
  let navigate = useNavigate();
  const { data, setData } = React.useContext(UserData);
  // User Data

  const [scanOpen, setScanOpen] = useState(false);
  const [QR, setQR] = useState("");

  useEffect(() => {
    if (QR !== "") {
      setScanOpen(!scanOpen);
      window.location.href = CONSTANT.client + QR;
    }
  }, [QR]);

  const [book, setBookings] = useState([]);

  const fetchBooking = async () => {
    await axios
      .get(CONSTANT.server + `labs/view/staffId/${data.personal._id}`)
      .then((responce) => {
        if (responce.status === 200) {
          axios
            .get(
              CONSTANT.server + `bookLab/view/isToday/${responce.data[0]._id}`
            )
            .then((responce2) => {
              if (responce2.status === 200) {
                if (responce2.data) {
                  setBookings([...responce2.data]);
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

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchBooking();
    }
  }, [data]);

  const updateBooking = async (id) => {
    await axios
      .put(CONSTANT.server + `bookLab/update/complete/${id}`)
      .then((responce2) => {
        if (responce2.status === 200) {
          if (responce2.data) {
            fetchBooking();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="__Staff">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 mt-2 text-center">
          Welcome {data.personal.username}!
        </h1>
        <div className="mt-2 mb-2">
          {book.length > 0
            ? book.map((a, b) => {
                return (
                  <div className="card mt-2 mb-2 px-2 py-2 pt-3">
                    <p>You have a lab booking today at {a.time}</p>
                    <p>Event Name : {a.ename}</p>
                    <p>
                      Event By : {a.name} ({a.email})
                    </p>
                    <span
                      role={"button"}
                      className="text-primary"
                      onClick={(e) => {
                        updateBooking(a._id);
                      }}
                    >
                      Completed
                    </span>
                  </div>
                );
              })
            : ""}
        </div>
        <h3 className="mb-4 mt-2 text-center">Scan QR Code</h3>
        <div className="w-50 mt-3 custom-button text-center">
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "12px 15px",
            }}
            onClick={() => {
              setScanOpen((scanOpen) => {
                return !scanOpen;
              });
            }}
          >
            {scanOpen ? "Close" : "Open"} Scanner
          </button>
          {scanOpen ? (
            <QrReader
              delay={300}
              style={{ width: "100%" }}
              onResult={(result, error) => {
                if (!!result) {
                  setQR(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              className="scanner"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Staff;
