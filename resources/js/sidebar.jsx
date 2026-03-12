import React from "react"
import ReactDOM from "react-dom/client"
import Sidebar from "./components/Sidebar"
import "../css/app.css"

const el = document.getElementById("sidebar")
if (el) {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <Sidebar />
    </React.StrictMode>
  )
}