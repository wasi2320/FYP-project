import React from "react";

export default function Legend() {
  return (
    <div className="m-2 d-flex flex-row w-100">
      <div className="bg-zero m-2 p-2">Absent</div>
      <div className="bg-one m-2 p-2">Only Check In</div>
      <div className="bg-two m-2 p-2">Check In/Check Out</div>
    </div>
  );
}
