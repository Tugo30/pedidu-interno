import React from "react"
import ReactDOM from "react-dom/client"
import Dashboard from "./pages/Dashboard/Dashboard"
import "../css/app.css"

const el = document.getElementById("dashboard-app")
if (el) ReactDOM.createRoot(el).render(<React.StrictMode><Dashboard /></React.StrictMode>)