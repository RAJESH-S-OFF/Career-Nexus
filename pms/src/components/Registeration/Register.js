import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registeration-CSS/RegistrationPage.css";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRpass] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [sapId, setSapId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [tenthSchool, setTenthSchool] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [twelfthCollege, setTwelfthCollege] = useState("");
  const [graduationCollege, setGraduationCollege] = useState("");
  const [sixthSemesterCGPA, setSixthSemesterCGPA] = useState("");
  const [graduationCGPA, setGraduationCGPA] = useState("");
  const [stream, setStream] = useState("");
  const [errors, setErrors] = useState({}); // State to manage errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    let formErrors = {};
    let isValid = true;

    // Password Match Check
    if (password !== repass) {
      formErrors.repass = "Passwords do not match";
      isValid = false;
    }

    // Password Format Check
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      formErrors.password =
        "Password should contain at least one uppercase, one lowercase, one special character, and one number, with a minimum length of 8 characters.";
      isValid = false;
    }

    // Required Fields Check
    const requiredFields = {
      name: "Name",
      email: "Email",
      password: "Password",
      repass: "Re-enter Password",
      contactNumber: "Contact Number",
      sapId: "Sap ID",
      rollNo: "Roll No",
      gender: "Gender",
      dob: "Date of Birth",
      tenthPercentage: "10th Percentage",
      tenthSchool: "School Name",
      twelfthPercentage: "12th Percentage",
      twelfthCollege: "12th College Name",
      graduationCollege: "Graduation College Name",
      stream: "Stream",
    };

    for (const field in requiredFields) {
      if (!eval(field)) {
        formErrors[field] = `${requiredFields[field]} is required`;
        isValid = false;
      }
    }
    if (stream === "MCA" && !graduationCGPA) {
        formErrors.graduationCGPA = "Graduation CGPA is required for MCA";
        isValid = false;
    }
      if (stream !== "MCA" && !sixthSemesterCGPA) {
          formErrors.sixthSemesterCGPA = "6th Semester CGPA is required for non-MCA";
          isValid = false;
      }

    // Update the errors state
    setErrors(formErrors);

    if (!isValid) {
      return;
    }

    const userData = {
      name,
      email,
      password,
      contactNumber,
      sapId,
      rollNo,
      gender,
      dob,
      tenthPercentage,
      tenthSchool,
      twelfthPercentage,
      twelfthCollege,
      graduationCollege,
      graduationCGPA: stream === "MCA" ? graduationCGPA : null,
      sixthSemesterCGPA: stream !== "MCA" ? sixthSemesterCGPA : null,
      stream,
      isAdmin: false, // Set a default or actual value
    };

    try {
      const result = await axios.post(
        "http://localhost:3001/auth/register",
        userData
      );
      console.log(result);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({
        server: "An error occurred during registration. Please try again later.",
      });
    }
  };

  const handleStreamChange = (e) => {
    setStream(e.target.value);
    setGraduationCGPA("");
    setSixthSemesterCGPA("");
  };

  return (
    <div className="registration-container">
      <h1>Registration Page</h1>
        {errors.server && <div className="alert alert-danger">{errors.server}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Enter your Name"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="repass">Re-enter Password</label>
          <input
            type="password"
            id="repass"
            className={`form-control ${errors.repass ? "is-invalid" : ""}`}
            placeholder="Re-enter your Password"
            onChange={(e) => setRpass(e.target.value)}
          />
          {errors.repass && (
            <div className="invalid-feedback">{errors.repass}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tenthPercentage">10th Percentage</label>
          <input
            type="number"
            id="tenthPercentage"
            className={`form-control ${
              errors.tenthPercentage ? "is-invalid" : ""
            }`}
            placeholder="Enter your 10th Percentage"
            step="0.01"
            onChange={(e) => setTenthPercentage(e.target.value)}
          />
          {errors.tenthPercentage && (
            <div className="invalid-feedback">{errors.tenthPercentage}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tenthSchool">School Name</label>
          <input
            type="text"
            id="tenthSchool"
            className={`form-control ${errors.tenthSchool ? "is-invalid" : ""}`}
            placeholder="Enter your 10th Standard School Name"
            onChange={(e) => setTenthSchool(e.target.value)}
          />
          {errors.tenthSchool && (
            <div className="invalid-feedback">{errors.tenthSchool}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="twelfthPercentage">12th Percentage</label>
          <input
            type="number"
            id="twelfthPercentage"
            className={`form-control ${
              errors.twelfthPercentage ? "is-invalid" : ""
            }`}
            placeholder="Enter your 12th Percentage"
            step="0.01"
            onChange={(e) => setTwelfthPercentage(e.target.value)}
          />
          {errors.twelfthPercentage && (
            <div className="invalid-feedback">{errors.twelfthPercentage}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="twelfthCollege">12th Standard College Name</label>
          <input
            type="text"
            id="twelfthCollege"
            className={`form-control ${
              errors.twelfthCollege ? "is-invalid" : ""
            }`}
            placeholder="Enter your 12th Standard College Name"
            onChange={(e) => setTwelfthCollege(e.target.value)}
          />
          {errors.twelfthCollege && (
            <div className="invalid-feedback">{errors.twelfthCollege}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="stream">Stream</label>
          <select
            id="stream"
            className={`form-control ${errors.stream ? "is-invalid" : ""}`}
            onChange={handleStreamChange}
            value={stream}
          >
            <option value="">Select Stream</option>
            <option value="MCA">MCA</option>
            <option value="Btech-IT">Btech-IT</option>
            <option value="Btech-CS">Btech-CS</option>
            <option value="Btech-Cybersecurity">Btech-Cybersecurity</option>
            <option value="Btech-Data Science">Btech-Data Science</option>
            <option value="Btech-Mechatronics">Btech-Mechatronics</option>
            <option value="Btech-EXTC">Btech-Extc</option>
            <option value="BTech-Integrated">BTech-Integrated</option>
          </select>
          {errors.stream && <div className="invalid-feedback">{errors.stream}</div>}
        </div>
        {stream === "MCA" ? (
          <div className="form-group">
            <label htmlFor="graduationCGPA">Graduation CGPA</label>
            <input
              type="number"
              id="graduationCGPA"
              className={`form-control ${
                errors.graduationCGPA ? "is-invalid" : ""
              }`}
              placeholder="Enter your Graduation CGPA"
              step="0.01"
              onChange={(e) => setGraduationCGPA(e.target.value)}
              value={graduationCGPA}
            />
            {errors.graduationCGPA && (
              <div className="invalid-feedback">{errors.graduationCGPA}</div>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="sixthSemesterCGPA">6th Semester CGPA</label>
            <input
              type="number"
              id="sixthSemesterCGPA"
              className={`form-control ${
                errors.sixthSemesterCGPA ? "is-invalid" : ""
              }`}
              placeholder="Enter your 6th Semester CGPA"
              step="0.01"
              onChange={(e) => setSixthSemesterCGPA(e.target.value)}
              value={sixthSemesterCGPA}
            />
            {errors.sixthSemesterCGPA && (
              <div className="invalid-feedback">{errors.sixthSemesterCGPA}</div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="graduationCollege">Graduation College Name</label>
          <input
            type="text"
            id="graduationCollege"
            className={`form-control ${
              errors.graduationCollege ? "is-invalid" : ""
            }`}
            placeholder="Enter your Graduation College Name"
            onChange={(e) => setGraduationCollege(e.target.value)}
          />
          {errors.graduationCollege && (
            <div className="invalid-feedback">{errors.graduationCollege}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            className={`form-control ${
              errors.contactNumber ? "is-invalid" : ""
            }`}
            placeholder="Enter your Contact Number"
            onChange={(e) => setContactNumber(e.target.value)}
          />
          {errors.contactNumber && (
            <div className="invalid-feedback">{errors.contactNumber}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="sapId">Sap ID</label>
          <input
            type="text"
            id="sapId"
            className={`form-control ${errors.sapId ? "is-invalid" : ""}`}
            placeholder="Enter your Sap ID"
            onChange={(e) => setSapId(e.target.value)}
          />
          {errors.sapId && (
            <div className="invalid-feedback">{errors.sapId}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="rollNo">Roll No</label>
          <input
            type="text"
            id="rollNo"
            className={`form-control ${errors.rollNo ? "is-invalid" : ""}`}
            placeholder="Enter your Roll No"
            onChange={(e) => setRollNo(e.target.value)}
          />
          {errors.rollNo && (
            <div className="invalid-feedback">{errors.rollNo}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            className={`form-control ${errors.gender ? "is-invalid" : ""}`}
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
            onChange={(e) => setDob(e.target.value)}
          />
          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
        </div>

        <input type="submit" value="Submit" className="btn btn-primary" />
      </form>
    </div>
  );
}

export default Registration;