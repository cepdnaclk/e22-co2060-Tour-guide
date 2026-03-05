import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
<<<<<<< HEAD
import "./firebase";
=======

>>>>>>> 076b809bdedb4284a06b3c21efd9d73013fb9aa6

const root= createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
