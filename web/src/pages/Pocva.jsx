import { useEffect, useState } from "react";
import axios from "axios";
function Pocva() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPochva = async () => {
      try {
        const rest = await axios.get("http://localhost:3000/api/v1/pochva");
        setData(rest.data);
      } catch (err) {
        console.log(err.message);
        setError("Greska pri vcituvanjeto na server");
      }
    };

    fetchPochva();
  }, []);

  return (
    <div>
      <h2>Site pocvi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {data.map((p, idx) => (
          <li key={idx}>
            {p.ime} - {p.ph}, lokacija: {p.lokacija}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pocva;
