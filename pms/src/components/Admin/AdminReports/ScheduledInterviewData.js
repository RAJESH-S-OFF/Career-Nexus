import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import "../Admin-CSS/ScheduledInterviewData.css";

function ScheduledInterviewData() {
  const [companyData, setCompanyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/companyApplicants"
        );
        setCompanyData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleApplyFilter = () => {
    const filtered = companyData
      .map((company) => {
        const matchCompany =
          companyInput === "" ||
          company.companyName
            .toLowerCase()
            .includes(companyInput.toLowerCase());

        const filteredApplicants = company.applicants.filter((applicant) => {
          const matchDept =
            departmentInput === "" ||
            applicant.stream
              .toLowerCase()
              .includes(departmentInput.toLowerCase());
          return matchDept;
        });

        return matchCompany
          ? { ...company, applicants: filteredApplicants }
          : { ...company, applicants: [] };
      })
      .filter((company) => company.applicants.length > 0);

    setFilteredData(filtered);
  };

  const handleResetFilter = () => {
    setCompanyInput("");
    setDepartmentInput("");
    setFilteredData(companyData);
  };

  const handleDownloadExcel = () => {
    const exportData = [];

    filteredData.forEach((company) => {
      company.applicants.forEach((applicant) => {
        exportData.push({
          "Company Name": company.companyName,
          "Student Name": applicant.name,
          Email: applicant.email,
          Department: applicant.stream,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

    XLSX.writeFile(workbook, "Filtered_Applicants.xlsx");
  };

  const handleUpdatePlacementStatus = async (userId, companyId, status) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/updatePlacementStatus",
        {
          userId,
          companyId,
          status,
        }
      );

      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error(
        "Error updating placement status:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Error updating placement status");
    }
  };

  return (
    <>
      <AdminHome />
      <h1 className="page-heading" style={{ marginTop: "150px" }}>
        Company-wise Student Applications
      </h1>

      {/* Filters and Buttons */}
      <div className="filters">
        <div className="filter-inputs">
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label>Department:</label>
            <input
              type="text"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
              placeholder="Enter department"
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button onClick={handleApplyFilter}>Apply Filter</button>
          <button onClick={handleResetFilter}>Reset Filter</button>
          <button onClick={handleDownloadExcel}>Download Excel</button>
        </div>
      </div>

      <div className="split">
        <div className="right">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((company, index) => (

                  <React.Fragment key={index}>
                    {company.applicants.map((applicant, appIndex) => (
                      <tr key={appIndex}>
                        <td>{company.companyName}</td>
                        <td>{applicant.name}</td>
                        <td>{applicant.email}</td>
                        <td>{applicant.stream || "N/A"}</td>{" "}
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              width: "130px",
                              marginRight: "10px",
                            }}
                            onClick={() =>
                              handleUpdatePlacementStatus(
                                applicant.userId,
                                company.companyId,
                                "Placed"
                              )
                            }
                          >
                            Interview Cleared
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              width: "130px",
                            }}
                            onClick={() =>
                              handleUpdatePlacementStatus(
                                applicant.userId,
                                company.companyId,
                                "Unplaced"
                              )
                            }
                          >
                            Interview Failed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ScheduledInterviewData;
