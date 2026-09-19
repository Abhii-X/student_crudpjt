import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    age: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const getStudents = async () => {
    const response = await fetch(`${API_URL}/students`);
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name: form.name,
      email: form.email,
      course: form.course,
      age: Number(form.age)
    };

    if (editingId === null) {
      await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      setMessage("Student added successfully");
    } else {
      await fetch(`${API_URL}/students/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      setMessage("Student updated successfully");
    }

    setForm({
      name: "",
      email: "",
      course: "",
      age: ""
    });

    setEditingId(null);
    getStudents();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      age: student.age
    });

    setEditingId(student.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE"
    });

    setMessage("Student deleted successfully");
    getStudents();
  };

  const handleCancel = () => {
    setForm({
      name: "",
      email: "",
      course: "",
      age: ""
    });

    setEditingId(null);
    setMessage("");
  };

  return (
    <div className="app">
      <header>
        <h1>Student Manager</h1>
        <p>Manage your students in one place</p>
      </header>

      <main>
        <section className="form-section">
          <h2>{editingId === null ? "Add Student" : "Edit Student"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Student name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <div className="form-buttons">
              <button type="submit">
                {editingId === null ? "Add Student" : "Update Student"}
              </button>

              {editingId !== null && (
                <button type="button" className="cancel" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="students-section">
          <div className="section-title">
            <h2>Students</h2>
            <span>{students.length} students</span>
          </div>

          {students.length === 0 ? (
            <div className="empty">
              <p>No students found.</p>
              <span>Add a student using the form above.</span>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>{student.age}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;