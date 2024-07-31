import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaCheck, FaSearch, FaCaretDown, FaCaretUp } from 'react-icons/fa'; // Import icons

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [newTask, setNewTask] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTask, setEditTask] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [filter, setFilter] = useState('todo');
    const [error, setError] = useState('');

    // Fetch tasks from backend
    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching tasks!', error);
            });
    }, []);

    // Add a new task
    const handleAddTask = () => {
        if (newTask.trim() === '' || newDescription.trim() === '') {
            setError('Title and Description cannot be empty');
            return;
        }

        axios.post('http://localhost:5000/tasks', {
            task: newTask,
            description: newDescription,
            completed: false
        })
        .then(response => {
            setTasks([...tasks, response.data]);
            setNewTask('');
            setNewDescription('');
            setError('');
        })
        .catch(error => {
            console.error('There was an error adding the task!', error);
        });
    };

    // Toggle task completion status
    const toggleComplete = (id) => {
        axios.put(`http://localhost:5000/tasks/${id}`, { completed: !tasks.find(task => task._id === id).completed })
            .then(() => {
                setTasks(tasks.map(task =>
                    task._id === id
                        ? { ...task, completed: !task.completed, timestamp: new Date().toISOString() }
                        : task
                ));
            })
            .catch(error => {
                console.error('There was an error updating the task!', error);
            });
    };

    // Handle task deletion
    const handleDeleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter(task => task._id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the task!', error);
            });
    };

    // Handle task editing
    const handleEditClick = (task) => {
        setEditTaskId(task._id);
        setEditTask(task.task);
        setEditDescription(task.description);
        setError('');
    };

    const handleEditTask = () => {
        if (editTask.trim() === '' || editDescription.trim() === '') {
            setError('Title and Description cannot be empty');
            return;
        }

        axios.put(`http://localhost:5000/tasks/${editTaskId}`, {
            task: editTask,
            description: editDescription,
            timestamp: new Date().toISOString()
        })
        .then(() => {
            setTasks(tasks.map(task =>
                task._id === editTaskId
                    ? { ...task, task: editTask, description: editDescription }
                    : task
            ));
            setEditTaskId(null);
            setEditTask('');
            setEditDescription('');
            setError('');
        })
        .catch(error => {
            console.error('There was an error updating the task!', error);
        });
    };

    // Handle search input change
    const handleChange = (e) => setSearch(e.target.value);

    // Filter tasks based on search and filter criteria
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.task.toLowerCase().includes(search.toLowerCase());
        if (filter === 'todo') {
            return matchesSearch && !task.completed;
        } else {
            return matchesSearch && task.completed;
        }
    });

    // Handle task expansion
    const handleExpand = (id) => {
        setExpandedTaskId(expandedTaskId === id ? null : id);
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            {/* <h1 className="text-3xl font-bold mb-6 text-center">My Todos</h1> */}

            {/* Main Container */}
            <div className="p-4 border rounded bg-gray-50 shadow-md">

                {/* Search Bar */}
                <div className="flex items-center mb-4 mt-4">
                    <input
                        type="text"
                        value={search}
                        onChange={handleChange}
                        placeholder="Search tasks..."
                        className="input input-bordered w-full mr-2 px-4 py-4 border-2 rounded-lg outline-none"
                    />
                    <button
                        onClick={() => setSearch(search)}
                        className="btn btn-primary flex-shrink-0 px-4 py-4 border-2 rounded-lg text-xl"
                    >
                        <FaSearch size={24} />
                    </button>
                </div>

                <div className='flex gap-8'>
                    {/* Add Task Form */}
                    <div className="mb-4 w-1/2 ">
                        <label className="block text-gray-700 mb-1 text-left pl-3" htmlFor="newTask">Title *</label>
                        <input
                            id="newTask"
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter task title"
                            className="input input-bordered w-full px-4 py-4 border-2 rounded-lg outline-none"
                        />
                        {error && newTask.trim() === '' && (
                            <p className="text-red-500 text-sm mt-1 text-left">Title cannot be empty</p>
                        )}
                    </div>
                    <div className="mb-4 w-1/2">
                        <label className="block text-gray-700 mb-1 text-left pl-3" htmlFor="newDescription">Description *</label>
                        <input
                            id="newDescription"
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="input input-bordered w-full px-4 py-4 border-2 rounded-lg outline-none"
                        />
                        {error && newDescription.trim() === '' && (
                            <p className="text-red-500 text-sm mt-1 text-left">Description cannot be empty</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleAddTask}
                    className="btn bg-blue-500 w-full px-4 py-4 border-2 rounded-xl text-xl text-white"
                >
                    Add Task
                </button>

                {/* Tabs for Filtering */}
                <div className="mt-6 text-left">
                    <div className="tabs gap-4 flex cursor-pointer">
                        <div>
                            <button
                                className={`tab tab-bordered border-2 rounded-md px-2 py-2 ${filter === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setFilter('todo')}
                            >
                                Todo
                            </button>
                        </div>
                        <div>
                            <button
                                className={`tab tab-bordered border-2 rounded-md px-2 py-2 ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setFilter('completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <ul className="list-none mt-6">
                    {filteredTasks.map(task => (
                        <li
                            key={task._id}
                            className={`mb-4 border p-4 rounded  flex items-start ${task.completed ? 'bg-teal-100' : 'bg-white'}`}
                        >
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <h2 className={`text-xl font-bold text-left ${task.completed ? 'text-gray-900 text-2xl ' : 'text-blue-600'}`}>
                                            {task.task}
                                        </h2>
                                        <p className={`text-gray-700 ${task.completed ? 'text-gray-900 text-xl ' : 'text-gray-600'} overflow-hidden text-ellipsis whitespace-nowrap`}>
                                            {task.description}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(task)}
                                            className="btn btn-info p-2"
                                        >
                                            <FaEdit size={20} className="text-yellow-500"/>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="btn btn-error p-2"
                                        >
                                            <FaTrash size={20} className="text-red-500" />
                                        </button>
                                        <button
                                            onClick={() => toggleComplete(task._id)}
                                            className={`btn p-2 ${task.completed ? 'btn-success' : 'btn-primary'}`}
                                        >
                                            <FaCheck size={20} className="text-green-500" />
                                        </button>
                                        <button
                                            onClick={() => handleExpand(task._id)}
                                            className="btn p-2"
                                        >
                                            {expandedTaskId === task._id ? <FaCaretUp size={30} className='text-gray-900' /> : <FaCaretDown size={30}  className='text-gray-900'/>}
                                        </button>
                                    </div>
                                </div>
                                {expandedTaskId === task._id && (
                                    <div className="mt-2 text-emerald-600 font-bold ">
                                        <p>Last Updated: {new Date(task.timestamp).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Edit Task Modal */}
                {editTaskId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-bold mb-4 text-blue-500">Edit Task</h2>
                            <label className="block font-bold mb-2 text-left text-xl text-indigo-800" htmlFor="editTask">Title</label>
                            <input
                                id="editTask"
                                type="text"
                                value={editTask}
                                onChange={(e) => setEditTask(e.target.value)}
                                placeholder="Task title"
                                className="input input-bordered w-full mb-4 px-2 py-2 rounded-md border-2 outline-none"
                            />
                            <label className="block font-bold mb-2 text-left text-xl text-indigo-800" htmlFor="editDescription">Description</label>
                            <input
                                id="editDescription"
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Task description"
                                className="input input-bordered w-full mb-4 px-2 py-2 rounded-md border-2 outline-none"
                            />
                            {error && (editTask.trim() === '' || editDescription.trim() === '') && (
                                <p className="text-red-500 text-sm mb-4">Title and Description cannot be empty</p>
                            )}
                            <div className="flex justify-end space-x-2 gap-4">
                                <button
                                    onClick={handleEditTask}
                                    className="btn btn-primary bg-blue-500 px-4 py-2 rounded-md text-white font-bold text-md"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditTaskId(null)}
                                    className="btn btn-secondary bg-red-500 px-4 py-2 rounded-md text-white font-bold text-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoList;
