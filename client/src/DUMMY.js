
export const dummydata = () => {
  let usersModel = {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
  }
  let timetableModel = {
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "labs",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  }

  let teacherAttendanceModel = {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "timetables",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    confirmation: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  }

  let staffAttendanceModel = {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  }

  let leaveRequestModel = {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    confirmation1: {
      type: Boolean,
      default: false,
    },
    confirmation2: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  }

  let labsModel = {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cameraIp: {
      type: String,
    },
    controller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  }

  let dailyEquipmentReportModel = {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    problemDomain: {
      type: JSON,
      required: true,
    },
    problemWithHardware: {
      type: String,
      required: true,
    },
    problemWithSoftware: {
      type: String,
      required: true,
    },
    problemWithNetworking: {
      type: String,
      required: true,
    },
    problemWithOtherEquipment: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  }

  let bookLabModel = {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "labs",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    confirmation: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  }
  return "";
}