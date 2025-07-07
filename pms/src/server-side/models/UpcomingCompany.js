import mongoose from "mongoose";

const upcomingCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  eligibilityCriteria: [{ type: String }], // Array of strings (e.g., ["CS", "IT"])
  about: { type: String }, // Description of the company
  createdAt: { type: Date, default: Date.now },
});

const UpcomingCompanyModel = mongoose.model(
  "UpcomingCompany",
  upcomingCompanySchema
);
export { UpcomingCompanyModel as UpcomingCompany };
