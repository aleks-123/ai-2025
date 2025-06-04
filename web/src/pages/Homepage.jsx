import { jwtDecode } from 'jwt-decode';

function getEmailFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded.email || null;
  } catch {
    return null;
  }
}

function Homepage() {
  const email = getEmailFromToken();
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <h3 style={{ fontWeight: 'bold', color: 'lightblue' }}>Најавен гостин: {email}</h3>
      <h1>Добредојдовте на првата апликацијата за почни во Македонија! </h1>
      <h2>Станетте дел од земјделците во нашата држава</h2>
      <p>
        Оваа апликација ни овозможува да прегледуваме информации за земјоделските работи, и сите потребни информации
        може да ги најдите тука
      </p>
      <p>За домашна да го збогатите менито со почва, земјдолески култури, ѓубрива, механизација</p>
    </div>
  );
}

export default Homepage;
