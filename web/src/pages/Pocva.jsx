import { useEffect } from 'react';
import axios from 'axios';
function Pocva() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPochva = async () => {
      try {
        const rest = await axios.get('http://localhost:100000/api/v1/pocvi');
        setData(rest.data);
      } catch (err) {
        console.log(err.message);
        setError('Greska pri vcituvanjeto na server');
      }
    };
  }, []);

  return (
    <div>
      <h2>Site pocvi</h2>
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
