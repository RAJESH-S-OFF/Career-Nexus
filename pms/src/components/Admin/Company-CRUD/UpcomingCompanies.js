import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import upcomingImg from "../Assets/company.png";
import "../Admin-CSS/UpcomingCompanies.css";

function UpcomingCompanies() {
  const navigate = useNavigate();

  // State to hold upcoming companies data
  const [upcomingCompanies, setUpcomingCompanies] = React.useState([]);

  // Verify admin access
  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });
  }, [navigate]);

  // Fetch upcoming companies data
  useEffect(() => {
    const fetchUpcomingCompanies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/upcomingCompanies"
        );
        setUpcomingCompanies(response.data);
        console.log("Upcoming Companies:", response.data); // For debugging
      } catch (err) {
        console.error("Error fetching upcoming companies:", err);
      }
    };
    fetchUpcomingCompanies();
  }, []);

  // Handle Delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/auth/upcomingCompanies/${id}`);
      setUpcomingCompanies(
        upcomingCompanies.filter((company) => company._id !== id)
      );
      alert("Company deleted successfully");
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Error deleting company");
    }
  };

  return (
    <>
      <AdminHome />
      <h2 className="header-title">Upcoming Companies</h2>
      <div className="container-fluid h-100">
        <div className="row h-100 justify-content-center align-items-start">
          {/* Image column */}
          <div
            className="col-lg-4 d-flex justify-content-center align-items-center"
            style={{ height: "fit-content" }}
          >
            <img
              src={upcomingImg}
              alt="Upcoming Companies"
              className="img-fluid"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>

          {/* Table column */}
          <div className="col-lg-8 d-flex justify-content-center align-items-center custom-border">
            <div className="bg-white rounded p-4">
              <div className="mb-3">
                <Link
                  to="/add-upcoming-company"
                  className="btn btn-success btn-sm mb-3"
                >
                  Add +
                </Link>
              </div>
              <table className="table table-bordered table-hover">
                <thead className="bg-purple text-white">
                  <tr>
                    <th>Company Name</th>
                    <th>Eligibility Criteria</th>
                    <th>About Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingCompanies.map((company) => (
                    <tr key={company._id}>
                      <td>{company.companyName}</td>
                      <td>
                        {company.eligibilityCriteria
                          ? company.eligibilityCriteria.join(", ")
                          : "N/A"}
                      </td>
                      <td>{company.about || "No description available"}</td>
                      <td>
                        <Link
                          to={`/update-upcoming-company/${company._id}`}
                          className="btn btn-sm btn-success me-2"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(company._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpcomingCompanies;
