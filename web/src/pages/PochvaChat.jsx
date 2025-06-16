import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from './PochvaChat.module.css';
import { useState } from 'react';

function getUserName() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.name || decoded.email || decoded.username || null;
  } catch {
    return null;
  }
}

function PochvaChat() {
  const [messages, setMessages] = useState([]); // [{role: 'user'|'ai', content: string}]
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const userName = getUserName();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // [ { role: 'user', content: 'Nadica' }]

    // [ { role: 'user', content: 'Nadica' },  { role: 'ai', content: 'nadica e odlicen student' },{ role: 'user', content: 'Srna' }, ]

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:10000/api/v1/pochva/chat',
        { prompt: input },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // [ { role: 'user', content: 'Nadica' },  { role: 'ai', content: 'nadica e odlicen student' }]

      //  [ { role: 'user', content: 'Nadica' },  { role: 'ai', content: 'nadica e odlicen student' },{ role: 'user', content: 'Srna' }, ]

      setMessages((prev) => [...prev, { role: 'ai', content: res.data.answer || 'Нема одговор.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Грешка при комуникација со серверот' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2>Прашај нешто ако ти треба</h2>
      {userName && (
        <div className={styles.header}>
          Најавен корисник: <b>{userName}</b>
        </div>
      )}
      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? `${styles.message} ${styles.messageUser}` : styles.message}>
            <span
              className={
                msg.role === 'user' ? `${styles.bubble} ${styles.bubbleUser}` : `${styles.bubble} ${styles.bubbleAi}`
              }
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className={styles.loading}>Се вчитува...</div>}
      </div>

      <form onSubmit={handleSend} className={styles.form}>
        <input
          className={styles.input}
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Постави прашање за почвите...'
          disabled={loading}
        />
        <button type='submit' disabled={loading || !input.trim()}>
          Испрати
        </button>
      </form>
    </div>
  );
}

export default PochvaChat;
// baranje
// odgovor
