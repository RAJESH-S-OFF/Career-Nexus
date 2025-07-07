import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Admin-CSS/AdminDashboard.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AdminHome from "../AdminHome.js";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filters, setFilters] = useState({
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    placementStatus: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/getUsers")
      .then((response) => {
        setUsers(response.data.data);
        setOriginalUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Sync scrollbar
  useEffect(() => {
    const tableWrapper = document.querySelector(".table-wrapper");
    const stickyScrollbar = document.querySelector(".sticky-scrollbar");

    if (tableWrapper && stickyScrollbar) {
      const syncScroll = () => {
        stickyScrollbar.scrollLeft = tableWrapper.scrollLeft;
      };

      const syncScrollReverse = () => {
        tableWrapper.scrollLeft = stickyScrollbar.scrollLeft;
      };

      tableWrapper.addEventListener("scroll", syncScroll);
      stickyScrollbar.addEventListener("scroll", syncScrollReverse);

      return () => {
        tableWrapper.removeEventListener("scroll", syncScroll);
        stickyScrollbar.removeEventListener("scroll", syncScrollReverse);
      };
    }
  }, [users]);

  // Pagination logic
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Download functionality
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  // Apply filters
  const applyFilters = () => {
    let filteredUsers = originalUsers.filter((user) => {
      return (
        (!filters.tenthPercentage ||
          user.tenthPercentage >= parseFloat(filters.tenthPercentage)) &&
        (!filters.twelfthPercentage ||
          user.twelfthPercentage >= parseFloat(filters.twelfthPercentage)) &&
        (!filters.graduationCGPA ||
          user.graduationCGPA >= parseFloat(filters.graduationCGPA)) &&
        (!selectedProgram || user.stream === selectedProgram) &&
        (!filters.placementStatus ||
          user.placementStatus === filters.placementStatus)
      );
    });
    setSelectedProgram("");
    setUsers(filteredUsers);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      tenthPercentage: "",
      twelfthPercentage: "",
      graduationCGPA: "",
      placementStatus: "",
    });
    setUsers(originalUsers);
    setCurrentPage(1);
  };

  return (
    <>
      <AdminHome />
      <div className="dashboard-container">
        <div className="header-section">
          <h1 className="dashboard-title">User Reports</h1>
        </div>
        <div className="filter-section">
          <div className="filter-container">
            <div className="filter-group">
              <label htmlFor="tenthPercentage" className="filter-label">
                Filter by 10th Percentage:
              </label>
              <input
                type="number"
                id="tenthPercentage"
                name="tenthPercentage"
                value={filters.tenthPercentage}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="twelfthPercentage" className="filter-label">
                Filter by 12th Percentage:
              </label>
              <input
                type="number"
                id="twelfthPercentage"
                name="twelfthPercentage"
                value={filters.twelfthPercentage}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="graduationCGPA" className="filter-label">
                Filter by Graduation CGPA:
              </label>
              <input
                type="number"
                id="graduationCGPA"
                name="graduationCGPA"
                value={filters.graduationCGPA}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="stream" className="filter-label">
                Filter by Program:
              </label>
              <select
                id="stream"
                name="stream"
                value={selectedProgram}
                onChange={handleProgramChange}
                className="filter-input"
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
            </div>
            <div className="filter-group">
              <label htmlFor="placementStatus" className="filter-label">
                Filter by Placement Status:
              </label>
              <select
                id="placementStatus"
                name="placementStatus"
                value={filters.placementStatus}
                onChange={handleChange}
                className="filter-input"
              >
                <option value="">Select Status</option>
                <option value="Placed">Placed</option>
                <option value="Unplaced">Unplaced</option>
              </select>
            </div>
            <div className="button-container">
              <button
                onClick={applyFilters}
                className="filter-button button-spacing"
              >
                Apply Filters
              </button>
              <button onClick={resetFilters} className="filter-button">
                Reset Filters
              </button>
              <button onClick={handleDownload} className="download-button">
                Download
              </button>
            </div>
          </div>
        </div>
        <div className="table-section">
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>SAP ID</th>
                  <th>Roll No</th>
                  <th>Date of Birth</th>
                  <th>10th Percentage</th>
                  <th>10th School</th>
                  <th>12th Percentage</th>
                  <th>12th College</th>
                  <th>Graduation College</th>
                  <th>Graduation CGPA</th>
                  <th>Stream</th>
                  <th>6th Semester CGPA</th>
                  <th>Placement Status</th>
                  <th>Company Placed</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.sapId}</td>
                    <td>{user.rollNo}</td>
                    <td>{user.dob}</td>
                    <td>{user.tenthPercentage}</td>
                    <td>{user.tenthSchool}</td>
                    <td>{user.twelfthPercentage}</td>
                    <td>{user.twelfthCollege}</td>
                    <td>{user.graduationCollege}</td>
                    <td>{user.graduationCGPA}</td>
                    <td>{user.stream}</td>
                    <td>{user.sixthSemesterCGPA}</td>
                    <td>{user.placementStatus}</td>
                    <td>{user.companyPlaced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sticky-scrollbar">
            <div
              style={{
                width:
                  document.querySelector(".user-table")?.scrollWidth || "100%",
              }}
            ></div>
          </div>
          <div className="pagination-section">
            <div className="rows-info">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  // Since rowsPerPage is constant, this is just for display
                }}
              >
                <option value={10}>10 rows</option>
              </select>
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
