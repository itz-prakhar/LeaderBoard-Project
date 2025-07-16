import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUser, setNewUser] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastClaim, setLastClaim] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/users');
    const data = await res.json();
    setUsers(data);
    if (data.length > 0) setSelectedUserId(data[0]._id);
  };

  const fetchLeaderboard = async () => {
    const res = await fetch('http://localhost:5000/leaderboard');
    const data = await res.json();
    setLeaderboard(data);
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) return;
    await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUser }),
    });
    setNewUser('');
    fetchUsers();
    fetchLeaderboard();
  };

  const handleClaim = async () => {
    const res = await fetch('http://localhost:5000/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId }),
    });
    const data = await res.json();
    setLastClaim(data);
    fetchLeaderboard();
  };

  return (
    <div className="container">
      <h1 className="title">🏆 Live Leaderboard</h1>

      <div className="controls">
        <select
          value={selectedUserId}
          onChange={e => setSelectedUserId(e.target.value)}
          className="dropdown"
        >
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>

        <button onClick={handleClaim} className="claim-btn">🎯 Claim Points</button>

        <div className="add-user">
          <input
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            placeholder="Add new user"
          />
          <button onClick={handleAddUser}>➕</button>
        </div>
      </div>

      {lastClaim && (
        <div className="last-claim">{lastClaim.user.name} got <strong>{lastClaim.points}</strong> points!</div>
      )}

      <div className="leaderboard">
        {leaderboard.map((user, index) => (
          <div
            key={user._id}
            className={`card rank-${user.rank}`}
          >
            <div className="rank-badge">
              {user.rank === 1 && '🥇'}
              {user.rank === 2 && '🥈'}
              {user.rank === 3 && '🥉'}
              {user.rank > 3 && `#${user.rank}`}
            </div>
            <div className="card-body">
              <div className="avatar">👤</div>
              <div>
                <div className="username">{user.name}</div>
                <div className="points">🔥 {user.totalPoints} pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
