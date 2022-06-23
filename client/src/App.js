import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./views/Login";
import Layout from "./views/Layout";
import AddUser from "./views/AddUser";
import ViewUsers from "./views/ViewUsers";
import AddLab from "./views/AddLab";
import AddCategory from "./views/AddCategory";
import ViewLabs from "./views/ViewLabs";
import ViewCategories from "./views/ViewCategories";
import StaffAttendance from "./views/StaffAttendance";
import ViewStaffAttendance from "./views/ViewStaffAttendance";
import AddTimetable from "./views/AddTimetable";
import ViewTimetable from "./views/ViewTimetable";
import AddLeaveRequest from "./views/AddLeaveRequest";
import TeacherAttendance from "./views/TeacherAttendance";
import ViewTeacherAttendance from "./views/ViewTeacherAttendance";
import ReviewTeacherAttendance from "./views/ReviewTeacherAttendance";
import ViewLeaveRequests from "./views/ViewLeaveRequests";
import ReviewLeaveRequests from "./views/ReviewLeaveRequests";
import DailyEquipmentReport from "./views/DailyEquipmentReport";
import ViewDailyEquipmentReport from "./views/ViewDailyEquipmentReport";
import BookLab from "./views/BookLab";
import ViewBookLab from "./views/ViewBookLab";
import ReviewBookLab from "./views/ReviewBookLab";
import DailyStaffAttendanceReport from "./views/reports/DailyStaffAttendanceReport";
import DailyTeacherAttendanceReport from "./views/reports/DailyTeacherAttendanceReport";
import DailyLeaveRequestReport from "./views/reports/DailyLeaveRequestReport";
import DailyLabBookingsReport from "./views/reports/DailyLabBookingsReport";
import DailyEquipmentCheckReport from "./views/reports/DailyEquipmentCheckReport";
import MonthlyStaffAttendanceReport from "./views/reports/MonthlyStaffAttendanceReport";
import MonthlyTeacherAttendanceReport from "./views/reports/MonthlyTeacherAttendanceReport";
import MonthlyLeaveRequestReport from "./views/reports/MonthlyLeaveRequestReport";
import MonthlyLabBookingsReport from "./views/reports/MonthlyLabBookingsReport";
import MonthlyEquipmentCheckReport from "./views/reports/MonthlyEquipmentCheckReport";
import WeeklyAttendanceReport from "./views/reports/WeeklyAttendanceReport";
import FeedbackPage from "./views/FeedbackPage";
import MyLab from "./views/MyLab";
import ViewCamera from "./views/ViewCamera";

function App(props) {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/addUser"
            element={
              <Layout>
                <AddUser />
              </Layout>
            }
          />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route
            path="/viewUsers"
            element={
              <Layout>
                <ViewUsers />
              </Layout>
            }
          />
          <Route
            path="/addCategory"
            element={
              <Layout>
                <AddCategory />
              </Layout>
            }
          />
          <Route
            path="/viewCategories"
            element={
              <Layout>
                <ViewCategories />
              </Layout>
            }
          />
          <Route
            path="/addLab"
            element={
              <Layout>
                <AddLab />
              </Layout>
            }
          />
          <Route
            path="/viewLabs"
            element={
              <Layout>
                <ViewLabs />
              </Layout>
            }
          />

          <Route
            path="/staffAttendance"
            element={
              <Layout>
                <StaffAttendance />
              </Layout>
            }
          />

          <Route
            path="viewStaffAttendance"
            element={
              <Layout>
                <ViewStaffAttendance />
              </Layout>
            }
          />

          <Route
            path="/addTimetable"
            element={
              <Layout>
                <AddTimetable type="add" />
              </Layout>
            }
          />

          <Route
            path="/editTimetable/*"
            element={
              <Layout>
                <AddTimetable type="edit" />
              </Layout>
            }
          />

          <Route
            path="/viewTimetables"
            element={
              <Layout>
                <ViewTimetable />
              </Layout>
            }
          />

          <Route
            path="/addLeaveRequest"
            element={
              <Layout>
                <AddLeaveRequest />
              </Layout>
            }
          />
          <Route
            path="/viewLeaveRequests"
            element={
              <Layout>
                <ViewLeaveRequests />
              </Layout>
            }
          />

          <Route
            path="/myLab"
            element={
              <Layout>
                <MyLab />
              </Layout>
            }
          />

          <Route
            path="/viewCamera"
            element={
              <Layout>
                <ViewCamera />
              </Layout>
            }
          />

          <Route
            path="/reviewLeaveRequests/*"
            element={
              <Layout>
                <ReviewLeaveRequests />
              </Layout>
            }
          />

          <Route
            path="/addEquipmentReport"
            element={
              <Layout>
                <DailyEquipmentReport />
              </Layout>
            }
          />

          <Route
            path="/viewEquipmentReport"
            element={
              <Layout>
                <ViewDailyEquipmentReport />
              </Layout>
            }
          />

          <Route path="/bookLab" element={<BookLab />} />

          <Route
            path="/viewBookLab"
            element={
              <Layout>
                <ViewBookLab />
              </Layout>
            }
          />
          <Route
            path="/reviewBookLab"
            element={
              <Layout>
                <ReviewBookLab />
              </Layout>
            }
          />

          <Route
            path="/teacherAttendance"
            element={
              <Layout>
                <TeacherAttendance />
              </Layout>
            }
          />

          <Route
            path="/viewTeacherAttendance"
            element={
              <Layout>
                <ViewTeacherAttendance />
              </Layout>
            }
          />

          <Route
            path="/reviewTeacherAttendance"
            element={
              <Layout>
                <ReviewTeacherAttendance />
              </Layout>
            }
          />

          {/* Reports */}
          <Route
            path="/report/daily/attendance/staff"
            element={
              <Layout>
                <DailyStaffAttendanceReport />
              </Layout>
            }
          />

          <Route
            path="/report/daily/attendance/teacher"
            element={
              <Layout>
                <DailyTeacherAttendanceReport />
              </Layout>
            }
          />

          <Route
            path="/report/daily/leaves"
            element={
              <Layout>
                <DailyLeaveRequestReport />
              </Layout>
            }
          />

          <Route
            path="/report/daily/labBookings"
            element={
              <Layout>
                <DailyLabBookingsReport />
              </Layout>
            }
          />

          <Route
            path="/report/daily/equipment/software"
            element={
              <Layout>
                <DailyEquipmentCheckReport type="software" />
              </Layout>
            }
          />

          <Route
            path="/report/daily/equipment/hardware"
            element={
              <Layout>
                <DailyEquipmentCheckReport type="hardware" />
              </Layout>
            }
          />
          <Route
            path="/report/daily/equipment/networking"
            element={
              <Layout>
                <DailyEquipmentCheckReport type="networking" />
              </Layout>
            }
          />
          <Route
            path="/report/daily/equipment/others"
            element={
              <Layout>
                <DailyEquipmentCheckReport type="others" />
              </Layout>
            }
          />
          <Route
            path="/report/monthly/attendance/staff"
            element={
              <Layout>
                <MonthlyStaffAttendanceReport />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/attendance/teacher"
            element={
              <Layout>
                <MonthlyTeacherAttendanceReport />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/leaves"
            element={
              <Layout>
                <MonthlyLeaveRequestReport />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/labBookings"
            element={
              <Layout>
                <MonthlyLabBookingsReport />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/equipment/software"
            element={
              <Layout>
                <MonthlyEquipmentCheckReport type="software" />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/equipment/hardware"
            element={
              <Layout>
                <MonthlyEquipmentCheckReport type="hardware" />
              </Layout>
            }
          />

          <Route
            path="/report/monthly/equipment/networking"
            element={
              <Layout>
                <MonthlyEquipmentCheckReport type="networking" />
              </Layout>
            }
          />
          <Route
            path="/report/monthly/equipment/others"
            element={
              <Layout>
                <MonthlyEquipmentCheckReport type="others" />
              </Layout>
            }
          />

          <Route
            path="/report/weekly/attendance"
            element={
              <Layout>
                <WeeklyAttendanceReport />
              </Layout>
            }
          />

          <Route path="*" element={<Layout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
