import { Link } from "react-router-dom";

export default function Puttalam() {
  return (
    <div>
      <h1>Puttalam District</h1>

      <ul>
        <li><Link to="/tourism/puttalam/wilpattu">Wilpattu</Link></li>
        <li><Link to="/tourism/puttalam/salt-pans">Salt Pans</Link></li>
        <li><Link to="/tourism/puttalam/kalpitiya-fort">Kalpitiya Fort</Link></li>
      </ul>
    </div>
  );
}
