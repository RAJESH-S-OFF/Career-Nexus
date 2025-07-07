import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";

function UpdateUpcomingCompany() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    companyName: "",
    eligibilityCriteria: [],
    about: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/upcomingCompanies/${id}`
        );
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriteriaChange = (e) => {
    const criteria = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, eligibilityCriteria: criteria }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/auth/upcomingCompanies/${id}`,
        formData
      );
      navigate("/upcomingcompanies");
    } catch (err) {
      console.error("Error updating company:", err);
      alert("Error updating company");
    }
  };

  return (
    <>
      <AdminHome />
      <div className="container mt-5">
        <h2>Update Company</h2>
        <form onSubmit={handleSubmit}>
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
            Update Company
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default UpdateUpcomingCompany;
