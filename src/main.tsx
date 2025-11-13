import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App"
import { Toaster } from "sonner"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
       <Toaster richColors theme="dark" position="bottom-right" closeButton />
    </BrowserRouter>
  </React.StrictMode>
)
