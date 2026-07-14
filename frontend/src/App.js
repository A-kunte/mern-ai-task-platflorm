import React, { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operationType, setOperationType] = useState('Uppercase');
  const [taskError, setTaskError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => { fetchTasks(); }, [token]);

  useEffect(() => {
    if (!token || tasks.length === 0) return;
    const hasPendingTasks = tasks.some(task => task.status === 'pending' || task.status === 'running');
    if (hasPendingTasks) {
      const interval = setInterval(() => { fetchTasks(); }, 2500);
      return () => clearInterval(interval);
    }
  }, [tasks, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.message || 'Login failed');
      }
    } catch (err) {
      setAuthError('Server connection failed');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, inputText, operationType })
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([data, ...tasks]);
        setTitle('');
        setInputText('');
      } else {
        setTaskError(data.message || 'Failed to create task');
      }
    } catch (err) {
      setTaskError('Server connection failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ textAlign: 'center' }}>🤖 AI Platform Login</h2>
          {authError && <p style={styles.error}>{authError}</p>}
          <form onSubmit={handleLogin} style={styles.form}>
            <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <button type="submit" style={styles.button}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h2>🔮 AI Task Pipeline Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Log Out</button>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Submit New AI Request</h3>
          {taskError && <p style={styles.error}>{taskError}</p>}
          <form onSubmit={handleCreateTask} style={styles.form}>
            <input type="text" placeholder="Task Title" required value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
            
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Operation Type</label>
            <select value={operationType} onChange={(e) => setOperationType(e.target.value)} style={styles.input}>
              <option value="Uppercase">Uppercase</option>
              <option value="Lowercase">Lowercase</option>
              <option value="Reverse">Reverse String</option>
              <option value="Word Count">Word Count</option>
            </select>

            <textarea placeholder="Type your text content here..." rows="4" required value={inputText} onChange={(e) => setInputText(e.target.value)} style={{ ...styles.input, resize: 'none' }} />
            <button type="submit" style={styles.button}>Dispatch Task to Queue</button>
          </form>
        </div>

        <div style={styles.tasksSection}>
          <h3>Your Processing Queue</h3>
          {tasks.length === 0 ? (
            <p style={{ color: '#666' }}>No tasks found. Submit a prompt above!</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <h4>{task.title} <span style={{ fontWeight: 'normal', color: '#777', fontSize: '14px' }}>({task.operationType})</span></h4>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: task.status === 'success' ? '#d4edda' : task.status === 'running' ? '#cce5ff' : '#fff3cd',
                    color: task.status === 'success' ? '#155724' : task.status === 'running' ? '#004085' : '#856404'
                  }}>
                    {task.status ? task.status.toUpperCase() : 'PENDING'}
                  </span>
                </div>
                <p style={styles.desc}><strong>Input:</strong> {task.inputText}</p>
                {task.status === 'success' && (
                  <div style={styles.resultBlock}>
                    <strong>🧠 Processed Result:</strong>
                    <p style={{ margin: '5px 0 0 0', fontFamily: 'monospace', fontSize: '15px' }}>{task.result}</p>
                    {task.logs && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                        <strong>Execution Logs:</strong> {task.logs}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f7fb', fontFamily: 'sans-serif' },
  dashboardContainer: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  card: { padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e1e4e8', backgroundColor: '#fff', height: 'fit-content' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', fontFamily: 'inherit' },
  button: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', borderRadius: '5px', border: '1px solid #dc3545', backgroundColor: 'transparent', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' },
  tasksSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  taskCard: { padding: '20px', borderRadius: '8px', border: '1px solid #e1e4e8', backgroundColor: '#fafbfc' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: '1px solid transparent' },
  desc: { color: '#555', fontSize: '14px', margin: '0 0 15px 0' },
  resultBlock: { padding: '12px', backgroundColor: '#e8f4fd', borderLeft: '4px solid #007bff', borderRadius: '4px', fontSize: '14px' },
  error: { color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', margin: '0 0 15px 0', fontSize: '14px' }
};

export default App;