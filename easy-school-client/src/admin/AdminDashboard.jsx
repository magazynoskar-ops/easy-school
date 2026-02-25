import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';

const emptyForm = { username: '', email: '', role: 'user' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers();
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna pobrac listy uzytkownikow');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.updateAdminUser(id, form);
      setUsers((prev) => prev.map((user) => (user._id === id ? res.data : user)));
      cancelEdit();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna zapisac zmian');
    }
  };

  const removeUser = async (id) => {
    try {
      await api.deleteAdminUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna usunac uzytkownika');
    }
  };

  return (
    <main className="page stack-md">
      <h1 className="title">Panel administracyjny</h1>
      <p className="muted">Zarzadzanie kontami uzytkownikow</p>
      <button type="button" className="btn" onClick={() => navigate('/admin/sets')}>
        Zarzadzaj zestawami
      </button>
      {error && <div className="alert-error">{error}</div>}

      {loading && <div className="surface form-card">Ladowanie...</div>}

      {!loading && (
        <section className="sets-grid">
          {users.map((user) => (
            <article className="set-tile stack-sm" key={user._id}>
              {editingId === user._id ? (
                <>
                  <input
                    className="field"
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Username"
                  />
                  <input
                    className="field"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                  />
                  <select
                    className="field"
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <div className="stack-sm">
                    <button type="button" className="btn btn-block" onClick={() => saveEdit(user._id)}>
                      Zapisz
                    </button>
                    <button type="button" className="btn btn-block" onClick={cancelEdit}>
                      Anuluj
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                  <span className="pill">{user.role}</span>
                  <div className="stack-sm">
                    <button type="button" className="btn btn-block" onClick={() => startEdit(user)}>
                      Edytuj
                    </button>
                    <button type="button" className="btn btn-block" onClick={() => removeUser(user._id)}>
                      Usun
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default AdminDashboard;
