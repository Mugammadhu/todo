/* eslint-disable react/prop-types */
import { useEffect, useState ,useRef} from "react";
import axios from "axios";
import './app.css'


const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTodo, setUpdatedTodo] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const inputRef=useRef(null)

  useEffect(() => {
    axios
      .get("http://localhost:3000/tasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log("Server connection issue. Please check your internet connection.", err);
      });
  }, []);

  const showNotification = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000); // Auto-hide after 3 seconds
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    axios
      .post("http://localhost:3000/tasks", { todo }, { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTodo("");
        showNotification("Task added successfully!", "success");
      })
      .catch((err) => {
        console.log("Post todo error", err);
        showNotification("Error adding task.", "danger");
      });
  };

  useEffect(() => {
    if (editingTaskId) {
      inputRef.current.focus(); // Focus input when editing starts
    }
  }, [editingTaskId]);
  
  const handleUpdate = (id, todo) => {
    setEditingTaskId(id);
    setUpdatedTodo(todo);
  };

  const handleUpdateTask = (e, id) => {
    e.preventDefault();
    if (!updatedTodo.trim()) return;
    axios
      .put(`http://localhost:3000/tasks/${id}`, { todo: updatedTodo }, { headers: { "Content-Type": "application/json" } })
      .then(() => {
        setTasks((prevTask) => prevTask.map((task) => (task._id === id ? { ...task, todo: updatedTodo } : task)));
        setEditingTaskId(null);
        setUpdatedTodo("");
        showNotification("Task updated successfully!", "success");
      })
      .catch((err) => {
        console.log("Update todo error", err);
        showNotification("Error updating task.", "danger");
      });
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:3000/tasks/${taskToDelete}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      setShowConfirm(false);
      showNotification("Task deleted successfully!", "success");
    }).catch((err) => {
      console.log("Delete todo error", err);
      setShowConfirm(false);
      showNotification("Error deleting task.", "danger");
    });
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  return (
    <main className="container mt-5 d-flex flex-column  align-items-center">
      <h1 className="text-center mb-4">Task List</h1>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      {/* Form to Add Task */}
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3 w-75 w-md-50">
        <input
          type="text"
          id="todo"
          name="todo"
          className="form-control"
          placeholder="Enter a new task..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-25">
          Add Todo
        </button>
      </form>

      {/* List of Tasks */}
      <ul className="list-group w-75 w-md-50 mt-4">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center mb-4 rounded-2">
              {editingTaskId === task._id ? (
                <>
                  <form onSubmit={(e) => handleUpdateTask(e, task._id)} className="d-flex gap-2 w-100">
                    <input
                      type="text"
                      id="update"
                      name="update"
                      className="form-control border-black"
                      ref={inputRef}
                      value={updatedTodo}
                      onChange={(e) => setUpdatedTodo(e.target.value)}
                    />
                    <button type="submit" className="btn btn-success">
                      Update
                    </button>
                    <button onClick={() => setEditingTaskId(null)} className="btn btn-secondary">
                      Cancel
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <span className="w-75">{task.todo}</span>
                  <div className="w-25 d-flex justify-content-end">
                    <button onClick={() => handleUpdate(task._id, task.todo)} className="btn btn-warning btn-sm me-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-labelledby="confirmDeleteModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmDeleteModal">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this task?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
