
# **Backend - README**  

This repository contains the **backend** implementation for a full-stack project that integrates **Google Sheets as a database** using **Node.js**. It provides **user authentication, data retrieval, and the ability to add records to Google Sheets**.  

---

## **Features**  
- User authentication with **JWT-based signup and login**  
- **Google Sheets integration** for reading and writing data  
- **MongoDB** for user data storage  
- **CORS-enabled API** for secure frontend-backend communication  

---

## **Installation & Setup**  

### **1. Clone the Repository**  
```bash
git clone <your-repo-url>
cd backend
```

### **2. Install Dependencies**  
```bash
npm install
```

### **3. Configure Environment Variables**  
Create a `.env` file in the root directory and add the following variables:  

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>

# Google Sheets API Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=<your_google_service_account_email>
GOOGLE_PRIVATE_KEY="<your_private_key>"
GOOGLE_SHEET_ID=<your_google_sheet_id>

# Frontend URL (for CORS)
CLIENT_ORIGIN=http://localhost:3000
```

### **4. Start the Backend Server**  
```bash
npm run dev
```
The server will run on **`http://localhost:5000`** by default.  

---

## **API Endpoints**  

### **Authentication**
| Method | Endpoint | Description |
|---------|------------|-----------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |

### **Google Sheets Data**
| Method | Endpoint | Description |
|---------|------------|-----------------|
| `GET`  | `/api/sheets` | Retrieve data from Google Sheets |
| `POST` | `/api/sheets` | Append a new row to Google Sheets |

---

## **Tech Stack**
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (for user authentication)  
- **Google Sheets API** for data storage and retrieval  
- **Authentication:** JWT (JSON Web Token)  

---

## **Deployment Instructions**
1. Deploy the backend on **Railway, Render, or Vercel**  
2. Update the `.env` file with production **MongoDB and Google Sheets credentials**  
3. Ensure the **CLIENT_ORIGIN** is set to the deployed frontend URL  

---

For any issues or contributions, feel free to open a pull request or raise an issue. 
