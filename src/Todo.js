import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [todos, setTodos] = useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    //Edit
    const [editId, setEditId] = useState(-1)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const apiurl = "https://todo-backend-3u5l.onrender.com"

    const handleSubmit = () => {
        setError("")
        //Check inputs
        if (title.trim() !== '' && description.trim() !== '')
        {
            fetch(apiurl + '/todos', {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res) => {
                if (res.ok)
                {
                    //Add item to list
                    setTodos([...todos, { title, description }]);
                    setTitle("")
                    setDescription("")
                    setMessage("Item Added Successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                }
                else
                {
                    setError("Unable to create Todo Item")
                    }
            }).catch(() => {
                setError("Unable to create Todo Item")
            })
            
        }
    }

    // Get all todos
    const getItems = () => {
        fetch(apiurl+'/todos').then((res) => res.json()).then((res) => setTodos(res))
    }

    useEffect(() => {
        getItems()
    }, [])

    const handleEdit = (item) => {
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("");
        //Check inputs
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
          fetch(apiurl+"/todos/"+editId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({title: editTitle, description: editDescription }),
          })
            .then((res) => {
              if (res.ok) {
                  //Update item to list
                  const updatedTodos = todos.map((item) => {
                      // eslint-disable-next-line eqeqeq
                      if (item._id == editId) {
                          item.title = editTitle;
                          item.description = editDescription;
                      }
                      return item
                  })
                setTodos(updatedTodos);
                setEditTitle("");
                setEditDescription("");
                setMessage("Item Updated Successfully");
                setTimeout(() => {
                  setMessage("");
                }, 3000);
                setEditId(-1)
              } else {
                setError("Unable to update Todo Item");
              }
            })
            .catch(() => {
              setError("Unable to Update Todo Item");
            });
        }
    }
    
    const handleEditCancel = () => {
        setEditId(-1)
    }

    const handleDelete = (id) =>
    {
        if (window.confirm("Are you sure want to delete?"))
        {
            fetch(apiurl + '/todos/' + id, {
                method: "DELETE"
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos)
            })
        }
    }

  return (
    <>
      <div className="row p-3 bg-success text-white">
        <h1>Todo Project with MERN stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="bg-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            className="form-control"
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            className="form-control"
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item) => {
              return (
                <li className="list-group-item d-flex justify-content-between align-items-center bg-info my-2">
                  <div className="d-flex flex-column me-2">
                    {/*eslint-disable-next-line eqeqeq*/}
                    {editId == -1 || editId !== item._id ? (
                      <>
                        <span className="fw-bold">{item.title}</span>
                        <span className="fw-bold">{item.description}</span>
                      </>
                    ) : (
                      <>
                        <div className="form-group d-flex gap-2">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Title"
                            onChange={(e) => setEditTitle(e.target.value)}
                            value={editTitle}
                          />
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setEditDescription(e.target.value)}
                            value={editDescription}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                          {/*eslint-disable-next-line eqeqeq*/}
                    {editId == -1 || editId !== item._id ? (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    )}
                          {/* eslint-disable-next-line eqeqeq*/}
                    {editId == -1 || editId !== item._id ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
