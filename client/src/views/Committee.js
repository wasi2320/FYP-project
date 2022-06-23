import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import UserData from "../components/UserData";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CONSTANT, Loader } from "./../CONSTANT";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
const axios = require("axios");

function Committee(props) {
  const { data, setData } = React.useContext(UserData);
  // User Data

  return (
    <div className="__Committee">
      <div className="row">
          Hello Committee Here
        <div className="col-lg-2 col-sm-12">Ad</div>
      </div>
    </div>
  );
}

export default Committee;
