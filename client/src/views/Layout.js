import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@mui/material/Avatar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import HardwareIcon from "@mui/icons-material/Hardware";
import MenuIcon from "@material-ui/icons/Menu";
import GridViewIcon from "@mui/icons-material/GridView";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CameraOutdoorIcon from "@mui/icons-material/CameraOutdoor";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "./../css/Layout.css";
import { useNavigate } from "react-router-dom";
import UserData from "./../components/UserData";
import { checkLoginFromNonLogin } from "./../CONSTANT";
//
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import PreviewIcon from "@mui/icons-material/Preview";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TodayIcon from "@mui/icons-material/Today";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ComputerIcon from "@mui/icons-material/Computer";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Admin from "./Admin";
import Committee from "./Committee";
import Staff from "./Staff";
import Teacher from "./Teacher";
const axios = require("axios");
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Layout(props) {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromNonLogin()) {
      navigate("/login");
    }
  }, []);

  // set the defaults
  let __init_session = {
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
  };
  const [data, setData] = useState(__init_session);
  useEffect(() => {
    let sessionData = JSON.parse(localStorage.getItem("loggedin"));
    if (sessionData) {
      setData({
        personal: sessionData.data,
        isLoggedIn: true,
      });
    }
  }, []);
  const value = { data, setData };
  const logout = () => {
    localStorage.removeItem("loggedin");
    setData(__init_session);
    navigate("/login");
  };
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [openAdminUser, setOpenAdminUser] = React.useState(false);

  const handleClickOfAdminUser = () => {
    setOpenAdminUser(!openAdminUser);
  };

  const [openCommitteeUser, setOpenCommitteeUser] = React.useState(false);

  const handleClickOfCommitteeUser = () => {
    setOpenCommitteeUser(!openCommitteeUser);
  };

  const [openCategory, setOpenCategory] = React.useState(false);

  const handleClickOfCategory = () => {
    setOpenCategory(!openCategory);
  };

  const [openTimetableUser, setOpenTimetableUser] = React.useState(false);

  const handleClickOfTimetableUser = () => {
    setOpenTimetableUser(!openTimetableUser);
  };

  const [openLeaveRequestUser, setOpenLeaveRequestUser] = React.useState(false);

  const handleClickOfLeaveRequestUser = () => {
    setOpenLeaveRequestUser(!openLeaveRequestUser);
  };

  const [openStaffAttendanceUser, setOpenStaffAttendanceUser] =
    React.useState(false);

  const handleClickOfStaffAttendanceUser = () => {
    setOpenStaffAttendanceUser(!openStaffAttendanceUser);
  };

  const [openTeacherUser, setOpenTeacherUser] = React.useState(false);

  const handleClickOfTeacherUser = () => {
    setOpenTeacherUser(!openTeacherUser);
  };

  const [openTeacherAttendanceUser, setOpenTeacherAttendanceUser] =
    React.useState(false);

  const handleClickOfTeacherAttendanceUser = () => {
    setOpenTeacherAttendanceUser(!openTeacherAttendanceUser);
  };

  const [openMyLab, setOpenMyLab] = React.useState(false);

  const handleClickOfMyLab = () => {
    setOpenMyLab(!openMyLab);
  };

  const [openDailyEquipmentReport, setOpenDailyEquipmentReport] =
    React.useState(false);

  const handleClickOfDailyEquipmentReport = () => {
    setOpenDailyEquipmentReport(!openDailyEquipmentReport);
  };

  const [openBookLab, setOpenBookLab] = React.useState(false);

  const handleClickOfBookLab = () => {
    setOpenBookLab(!openBookLab);
  };

  const [openMainReport, setOpenMainReport] = React.useState(false);

  const handleClickOfMainReport = () => {
    setOpenMainReport(!openMainReport);
  };

  const [openDaily, setOpenDaily] = React.useState(false);

  const handleClickOfDaily = () => {
    setOpenDaily(!openDaily);
  };

  const [openMonthly, setOpenMonthly] = React.useState(false);

  const handleClickOfMonthly = () => {
    setOpenMonthly(!openMonthly);
  };

  const [openWeekly, setOpenWeekly] = React.useState(false);

  const handleClickOfWeekly = () => {
    setOpenWeekly(!openWeekly);
  };

  const [openAttendanceReport1, setOpenAttendanceReport1] =
    React.useState(false);

  const handleClickOfAttendanceReport1 = () => {
    setOpenAttendanceReport1(!openAttendanceReport1);
  };

  const [openAttendanceReport2, setOpenAttendanceReport2] =
    React.useState(false);

  const handleClickOfAttendanceReport2 = () => {
    setOpenAttendanceReport2(!openAttendanceReport2);
  };
  const [openEquipmentReport1, setOpenEquipmentReport1] = React.useState(false);

  const handleClickOfEquipmentReport1 = () => {
    setOpenEquipmentReport1(!openEquipmentReport1);
  };

  const [openEquipmentReport2, setOpenEquipmentReport2] = React.useState(false);

  const handleClickOfEquipmentReport2 = () => {
    setOpenEquipmentReport2(!openEquipmentReport2);
  };

  const [openViewCamera, setOpenViewCamera] = React.useState(false);

  const handleClickOfViewCamera = () => {
    setOpenViewCamera(!openViewCamera);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} id="navbar__emailDisplay">
        Lab Management System
      </div>
      <Divider />
      <List className="navList">
        {data.personal.role === "admin" ? (
          <>
            <ListItem onClick={handleClickOfAdminUser}>
              <ListItemIcon>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
              {openAdminUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openAdminUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addUser">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewUsers">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Users" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </>
        ) : data.personal.role === "committee" ? (
          <>
            <ListItem onClick={handleClickOfCategory}>
              <ListItemIcon>
                <ComputerIcon />
              </ListItemIcon>
              <ListItemText primary="Categories" />
              {openCategory ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openCategory} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addCategory">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Category" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewCategories">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Categories" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfCommitteeUser}>
              <ListItemIcon>
                <ComputerIcon />
              </ListItemIcon>
              <ListItemText primary="Labs" />
              {openCommitteeUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openCommitteeUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addLab">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Lab" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewLabs">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Labs" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfTeacherAttendanceUser}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="Staff Leave Requests" />
              {openTeacherAttendanceUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openTeacherAttendanceUser}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <Link
                  className="text-dark"
                  to="/reviewLeaveRequests?type=committee"
                >
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <DoneAllIcon />
                    </ListItemIcon>
                    <ListItemText primary="Review" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfBookLab}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Review Lab Booking" />
              {openBookLab ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openBookLab} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/reviewBookLab">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            {/* Reports */}
            <ListItem onClick={handleClickOfMainReport}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
              {openMainReport ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMainReport} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem onClick={handleClickOfDaily} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Daily" />
                  {openDaily ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDaily} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      onClick={handleClickOfAttendanceReport1}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <ComputerIcon />
                      </ListItemIcon>
                      <ListItemText primary="Attendance" />
                      {openAttendanceReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openAttendanceReport1}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/daily/attendance/staff"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Staff" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/attendance/teacher"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Teacher" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/daily/leaves">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <PreviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Leaves" />
                      </ListItem>
                    </Link>
                    <ListItem
                      onClick={handleClickOfEquipmentReport1}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Equipment" />
                      {openEquipmentReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openEquipmentReport1}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/software"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Software" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/hardware"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <HardwareIcon />
                            </ListItemIcon>
                            <ListItemText primary="Hardware" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/networking"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Networking" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/others"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <CellTowerIcon />
                            </ListItemIcon>
                            <ListItemText primary="Others" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/daily/labBookings">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lab Bookings" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
                <ListItem onClick={handleClickOfWeekly} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Weekly" />
                  {openWeekly ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openWeekly} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link className="text-dark" to="/report/weekly/attendance">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Attendance" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
                <ListItem onClick={handleClickOfMonthly} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Monthly" />
                  {openMonthly ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openMonthly} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      onClick={handleClickOfAttendanceReport2}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <ComputerIcon />
                      </ListItemIcon>
                      <ListItemText primary="Attendance" />
                      {openAttendanceReport2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openAttendanceReport2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/monthly/attendance/staff"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Staff" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/monthly/attendance/teacher"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Teacher" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/monthly/leaves">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <PreviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Leaves" />
                      </ListItem>
                    </Link>
                    <ListItem
                      onClick={handleClickOfEquipmentReport2}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Equipment" />
                      {openEquipmentReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openEquipmentReport2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/monthly/equipment/software"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Software" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/monthly/equipment/hardware"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <HardwareIcon />
                            </ListItemIcon>
                            <ListItemText primary="Hardware" />
                          </ListItem>
                        </Link>
                      </List>
                      <Link
                        className="text-dark"
                        to="/report/monthly/equipment/networking"
                      >
                        <ListItem sx={{ pl: 8 }}>
                          <ListItemIcon>
                            <AppShortcutIcon />
                          </ListItemIcon>
                          <ListItemText primary="Networking" />
                        </ListItem>
                      </Link>
                      <Link
                        className="text-dark"
                        to="/report/monthly/equipment/others"
                      >
                        <ListItem sx={{ pl: 8 }}>
                          <ListItemIcon>
                            <CellTowerIcon />
                          </ListItemIcon>
                          <ListItemText primary="Others" />
                        </ListItem>
                      </Link>
                    </Collapse>
                    <Link
                      className="text-dark"
                      to="/report/monthly/labBookings"
                    >
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lab Bookings" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfViewCamera}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="View Camera" />
              {openViewCamera ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openViewCamera} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/viewCamera">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PreviewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </>
        ) : data.personal.role === "staff" ? (
          <>
            <ListItem onClick={handleClickOfMyLab}>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="My Lab" />
              {openMyLab ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMyLab} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/myLab">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CameraOutdoorIcon />
                    </ListItemIcon>
                    <ListItemText primary="Lab Resources" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfStaffAttendanceUser}>
              <ListItemIcon>
                <BookmarkAddedIcon />
              </ListItemIcon>
              <ListItemText primary="Attendance" />
              {openStaffAttendanceUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openStaffAttendanceUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/staffAttendance">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mark Attendance" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewStaffAttendance">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Attendance" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfTimetableUser}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Timetable" />
              {openTimetableUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openTimetableUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addTimetable">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Timetable" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewTimetables">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Timetables" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfTeacherAttendanceUser}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="Teacher Attendance" />
              {openTeacherAttendanceUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openTeacherAttendanceUser}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <Link className="text-dark" to="/reviewTeacherAttendance">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <DoneAllIcon />
                    </ListItemIcon>
                    <ListItemText primary="Review" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfLeaveRequestUser}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Leave Requests" />
              {openLeaveRequestUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openLeaveRequestUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addLeaveRequest">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewLeaveRequests">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfDailyEquipmentReport}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Equipment Report" />
              {openDailyEquipmentReport ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openDailyEquipmentReport}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <Link className="text-dark" to="/addEquipmentReport">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewEquipmentReport">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfBookLab}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Book Lab" />
              {openBookLab ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openBookLab} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/viewBookLab">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfViewCamera}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="View Camera" />
              {openViewCamera ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openViewCamera} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/viewCamera">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PreviewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </>
        ) : data.personal.role === "teacher" ? (
          <>
            <ListItem onClick={handleClickOfTeacherUser}>
              <ListItemIcon>
                <BookmarkAddedIcon />
              </ListItemIcon>
              <ListItemText primary="Attendance" />
              {openTeacherUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openTeacherUser} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/teacherAttendance">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mark Attendance" />
                  </ListItem>
                </Link>
                <Link className="text-dark" to="/viewTeacherAttendance">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GridViewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Attendance" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </>
        ) : data.personal.role === "hod" ? (
          <>
            <ListItem onClick={handleClickOfTeacherAttendanceUser}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="Staff Leave Requests" />
              {openTeacherAttendanceUser ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openTeacherAttendanceUser}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <Link className="text-dark" to="/reviewLeaveRequests?type=hod">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <DoneAllIcon />
                    </ListItemIcon>
                    <ListItemText primary="Review" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfViewCamera}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="View Camera" />
              {openViewCamera ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openViewCamera} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link className="text-dark" to="/viewCamera">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PreviewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <ListItem onClick={handleClickOfMainReport}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
              {openMainReport ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMainReport} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem onClick={handleClickOfDaily} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Daily" />
                  {openDaily ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDaily} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      onClick={handleClickOfAttendanceReport1}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <ComputerIcon />
                      </ListItemIcon>
                      <ListItemText primary="Attendance" />
                      {openAttendanceReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openAttendanceReport1}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/daily/attendance/staff"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Staff" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/attendance/teacher"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Teacher" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/daily/leaves">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <PreviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Leaves" />
                      </ListItem>
                    </Link>
                    <ListItem
                      onClick={handleClickOfEquipmentReport1}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Equipment" />
                      {openEquipmentReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openEquipmentReport1}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/software"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Software" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/hardware"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <HardwareIcon />
                            </ListItemIcon>
                            <ListItemText primary="Hardware" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/networking"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Networking" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/daily/equipment/others"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <CellTowerIcon />
                            </ListItemIcon>
                            <ListItemText primary="Others" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/daily/labBookings">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lab Bookings" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
                <ListItem onClick={handleClickOfWeekly} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Weekly" />
                  {openWeekly ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openWeekly} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link className="text-dark" to="/report/weekly/attendance">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Attendance" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
                <ListItem onClick={handleClickOfMonthly} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Monthly" />
                  {openMonthly ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openMonthly} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      onClick={handleClickOfAttendanceReport2}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <ComputerIcon />
                      </ListItemIcon>
                      <ListItemText primary="Attendance" />
                      {openAttendanceReport2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openAttendanceReport2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/monthly/attendance/staff"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Staff" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/monthly/attendance/teacher"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Teacher" />
                          </ListItem>
                        </Link>
                      </List>
                    </Collapse>
                    <Link className="text-dark" to="/report/monthly/leaves">
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <PreviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Leaves" />
                      </ListItem>
                    </Link>
                    <ListItem
                      onClick={handleClickOfEquipmentReport2}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Equipment" />
                      {openEquipmentReport1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                      in={openEquipmentReport2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <Link
                          className="text-dark"
                          to="/report/monthly/equipment/software"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <AppShortcutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Software" />
                          </ListItem>
                        </Link>
                        <Link
                          className="text-dark"
                          to="/report/monthly/equipment/hardware"
                        >
                          <ListItem sx={{ pl: 8 }}>
                            <ListItemIcon>
                              <HardwareIcon />
                            </ListItemIcon>
                            <ListItemText primary="Hardware" />
                          </ListItem>
                        </Link>
                      </List>
                      <Link
                        className="text-dark"
                        to="/report/monthly/equipment/networking"
                      >
                        <ListItem sx={{ pl: 8 }}>
                          <ListItemIcon>
                            <AppShortcutIcon />
                          </ListItemIcon>
                          <ListItemText primary="Networking" />
                        </ListItem>
                      </Link>
                      <Link
                        className="text-dark"
                        to="/report/monthly/equipment/others"
                      >
                        <ListItem sx={{ pl: 8 }}>
                          <ListItemIcon>
                            <CellTowerIcon />
                          </ListItemIcon>
                          <ListItemText primary="Others" />
                        </ListItem>
                      </Link>
                    </Collapse>
                    <Link
                      className="text-dark"
                      to="/report/monthly/labBookings"
                    >
                      <ListItem sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lab Bookings" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
              </List>
            </Collapse>
          </>
        ) : (
          ""
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <UserData.Provider value={value}>
      <div className="Sidebar__">
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap className="text-capitalize">
                <Link
                  to="/"
                  role="button"
                  className="text-capitalize text-light"
                >
                  {data.personal.role}
                </Link>
              </Typography>

              {data.isLoggedIn ? (
                <span className="profileTabNavbar">
                  <Link to="/profile">
                    <Button color="inherit" onClick={null}>
                      <Avatar
                        src={
                          data.personal.avatar !== ""
                            ? data.personal.avatar
                            : ""
                        }
                      />
                    </Button>
                  </Link>
                  <Button color="inherit" onClick={logout}>
                    Logout
                  </Button>
                </span>
              ) : (
                <Link
                  to="/login"
                  style={{
                    marginRight: "24px",
                  }}
                >
                  <Button color="inherit">Log In</Button>
                </Link>
              )}
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {props.children ? (
              props.children
            ) : data.personal.role === "admin" ? (
              <Admin />
            ) : data.personal.role === "committee" ? (
              <Committee />
            ) : data.personal.role === "staff" ? (
              <Staff />
            ) : data.personal.role === "teacher" ? (
              <Teacher />
            ) : (
              ""
            )}
          </main>
        </div>
      </div>
    </UserData.Provider>
  );
}
export default Layout;
