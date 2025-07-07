import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import "../Admin-CSS/AddUpcomingCompany.css"; // Import the new CSS file

function AddUpcomingCompany() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    eligibilityCriteria: [],
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Changed ${name} to ${value}`); // Debugging
  };

  const handleCriteriaChange = (e) => {
    const criteria = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, eligibilityCriteria: criteria }));
    console.log(`Changed eligibilityCriteria to ${criteria.join(", ")}`); // Debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Debugging
    try {
      await axios.post(
        "http://localhost:3001/auth/addUpcomingCompany",
        formData
      );
      navigate("/upcomingcompanies");
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Error adding company");
    }
  };

  return (
    <>
      <AdminHome />
      <div className="container add-company-container">
        <h2 className="add-company-title">Add New Company</h2>
        <form onSubmit={handleSubmit} className="add-company-form">
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Eligibility Criteria (comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria.join(", ")}
              onChange={handleCriteriaChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">About Company</label>
            <textarea
              className="form-control"
              name="about"
              value={formData.about}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Company
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AddUpcomingCompany;
