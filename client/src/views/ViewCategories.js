import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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

function ViewCategories(props) {
    const [filter, setFilter] = useState("");
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
            .get(CONSTANT.server + `categories/view`)
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

    const deleteMe = async (id) => {
        await axios
            .post(CONSTANT.server + `categories/delete/${id}`)
            .then((responce) => {
                if (responce.status === 200) {
                    let res = responce.data;
                    if (res.message) {
                        setMessage(res.message, "danger");
                    } else {
                        fetchDates();
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchDates();
    }, []);

    return (
        <div className="__Committee">
            <div className="row d-flex flex-column justify-content-center align-items-center">
                <div className="row d-flex flex-row justify-content-center align-items-center">
                    <h1 className="mb-4 text-center">View Categories</h1>
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

                    <div className="mb-3">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                Filter
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                }}
                            >
                                <FormControlLabel value="" control={<Radio />} label="All" />
                                {["Hardware", "Software", "Networking", "Other"].map((one, i) => {
                                    return (
                                        <FormControlLabel
                                            value={one.toLowerCase()}
                                            control={<Radio />}
                                            label={one}
                                            key={one}
                                        />
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Type</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dates.length > 0
                                    ? dates
                                        .filter((date, i) => {
                                            return (
                                                date.type.includes(search) ||
                                                date.name.includes(search)
                                            );
                                        })
                                        .filter((date, i) => {
                                            if (filter === "") {
                                                return true;
                                            } else {
                                                return date.type === filter;
                                            }
                                        })
                                        .map((date, i) => {
                                            return (
                                                <tr>
                                                    <td>{date.type[0].toUpperCase()}{date.type.slice(1)}</td>
                                                    <td>{date.name[0].toUpperCase()}{date.name.slice(1)}</td>
                                                    <td>
                                                        <span className="d-flex justify-content-center align-items-center">
                                                            <span
                                                                role="button"
                                                                className="text-danger"
                                                                onClick={(e) => {
                                                                    deleteMe(date._id);
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    : "No Categories"}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCategories;
