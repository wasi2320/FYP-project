
export const CONSTANT = {
   server: "http://localhost:4000/",
   client:"http://localhost:3000/",
 };

export const checkLoginFromLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? true
    : false;
};

export const checkLoginFromNonLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? false
    : true;
};

export const checkLoginFromAdmin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "admin"
    ? false
    : true;
};

export const checkLoginFromCommittee = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "committee"
    ? false
    : true;
};

export const checkLoginFromHOD = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "hod"
    ? false
    : true;
};

export const checkLoginFromStaff = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "staff"
    ? false
    : true;
};

export const checkLoginFromTeacher = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "teacher"
    ? false
    : true;
};

export const Loader = (extra = "") => {
  return (
    <div class={`spinner-grow ${extra}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export const setMessage = (text, color) => {
  let error = document.getElementById("error");
  error.innerHTML = text;
  error.classList.add("text-" + color);
  error.style.display = "block";
};

export const resetMessage = () => {
  let error = document.getElementById("error");
  error.innerText = "";
  error.style.display = "none";
  error.classList.remove("text-danger");
  error.classList.remove("text-success");
};

export const isMessage = () => {
  let error = document.getElementById("error");
  if (error.style.display === "none") {
    return false;
  }
  return true;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}