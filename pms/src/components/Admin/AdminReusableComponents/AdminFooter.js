import React from "react";
import "../Admin-CSS/AdminFooter.css"; // Assuming you have a separate CSS file for the Footer component
import logo from "../Assets/logo.png"; // Ensure the path to the logo is correct
const Footer = () => {
  const contactInfo = {
    principal: "The Principal",
    college: "National Engineering College, (Autonomous)",
    address: "K.R.Nagar, Kovilpatti, Thoothukudi (Dt) - 628503",
    phone: ["04632 - 222 502", "223 502", "Fax: 232749"],
    additionalPhone: ["93859 76774", "93859 76684"],
    emails: ["principal@nec.edu.in"],
    lastUpdated: "20.03.2025",
  };

  return (
    <div className="footer-container">
      <div className="footer-wrapper">
        {/* Quick Links Section */}
        <div className="footer-section-one">
          <h4>QUICK LINKS</h4>
          <ul>
            <li>Undertaking To UGC</li>
            <li>Grievance Redressal Portal</li>
            <li>Ragging Is A Punishable Offence</li>
            <li>Internal Complaint Committee</li>
            <li>SC-ST Committee</li>
            <li>Disciplinary Committee</li>
            <li>Canteen Committee</li>
            <li>Anti Drug Club Committee</li>
            <li>Student Counsellor Committee</li>
          </ul>
        </div>

        {/* Middle Section */}
        <div className="footer-section-two">
          <ul>
            <li>Document Verification System</li>
            <li>Faculty Application Form</li>
            <li>Scholarship Application Form</li>
            <li>ERP Oasys</li>
            <li>Minority Cell And OBC Cell</li>
            <li>Equal Opportunity Cell</li>
            <li>Gender Equity Cell</li>
            <li>POSH</li>
            <li>Feedback</li>
          </ul>
        </div>

        {/* Contact Details Section */}
        <div className="contact-details">
          <div className="contact-header">
            <img
              src={logo}
              alt="National Engineering College Logo"
              className="nec-logo"
            />
            <h4>National Engineering College</h4>
            <p>K.R.Nagar, Kovilpatti - 628 505</p>
          </div>
          <p>{contactInfo.principal}</p>
          <p>{contactInfo.college}</p>
          <p>{contactInfo.address}</p>
          <p>📞 {contactInfo.phone.join(" | ")}</p>
          <p>📞 {contactInfo.additionalPhone.join(" | ")}</p>
          {contactInfo.emails.map((email, idx) => (
            <p key={idx} className="email">
              ✉️ {email}
            </p>
          ))}
        </div>
      </div>

      {/* Last Updated Section */}
      <div className="footer-bottom">
        <p className="last-updated">
          Website Last Updated On {contactInfo.lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default Footer;
