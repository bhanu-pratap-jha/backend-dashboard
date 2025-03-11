import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Google Sheets API Setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

//  GET Request - Fetch Data from Google Sheets
router.get("/", async (req, res) => {
  try {
    console.log(" Fetching data from Google Sheets...");
    console.log(" Using Sheet ID:", process.env.GOOGLE_SHEET_ID);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1:Z1000", // Reads up to 1000 rows from Sheet1
    });

    const rows = response.data.values;
    console.log(" Google Sheets API Response:", rows);

    if (!rows || rows.length === 0) {
      console.log(" No data found in Google Sheet!");
      return res.status(404).json({ message: "No data found in the Google Sheet!" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Oops! Google Sheets API Error:", error);
    res.status(500).json({ message: "Error fetching Google Sheets data", error: error.message });
  }
});

//  POST Request - Add Data to Google Sheets
router.post("/", async (req, res) => {
  try {
    const { values } = req.body;
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({ message: "Invalid request, expected an array of values." });
    }

    console.log("📢 Adding data to Google Sheets:", values);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1", // Append data to Sheet1
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });

    console.log("Yahoo! Data successfully added!");
    res.json({ message: "Yeah! Data added to Google Sheet!", response: response.data });
  } catch (error) {
    console.error("Oops! Google Sheets API Error:", error);
    res.status(500).json({ message: "Error adding data to Google Sheets", error: error.message });
  }
});

export default router;
