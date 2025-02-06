import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [todoItems, setTodoItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/todos?page=1&quantity=10', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*'
                    }
                });
                const res = await response.json();
                let todoItems_ = [];
                for (let item of res) {
                    todoItems_.push({
                        id: item["id"],
                        name: item["name"]
                    });
                }

                console.log(todoItems_);
                setTodoItems(todoItems_);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onKeyDownAddTodoItem = (event) => {
        if (event.key === 'Enter') onClickAddTodoItem();
    };

    function onClickAddTodoItem() {
        let newTaskName = document.querySelector('#new-task input').value;
        document.querySelector('#new-task input').value = "";
        if (newTaskName.length === 0) {
            alert("Please enter a task name.")
        } else {
            let payload = {
                name: newTaskName,
                timestamp: Date.now()
            };

            const addData = async () => {
                try {
                    const response = await fetch('http://localhost:3001/api/todo', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    const res = await response.json();
                    todoItems.push({
                        id: res["id"],
                        name: newTaskName
                    });

                    console.log(todoItems);
                    setTodoItems([...todoItems]);
                } catch (error) {
                    console.error('Error adding data:', error);
                }
            };
            addData();
        }
    }

    function onClickDeleteTodoItem(itemId) {
        setTodoItems(todoItems.filter((todoItem) => todoItem.id !== itemId));
        console.log(todoItems);
        const deleteData = async (id) => {
            try {
                const response = await fetch(`http://localhost:3001/api/todo?id=`+id, {
                    method: 'DELETE'
                });
                console.log('Todo item deleted successfully.');
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        };
        deleteData(itemId);
    }

    return (
        <div className="container">
            <div id="new-task">
                <input type="text" placeholder="Add to TODO" onKeyDown={onKeyDownAddTodoItem}/>
                <button onClick={onClickAddTodoItem}>Add</button>
            </div>
            <div id="tasks">
                {todoItems.map(todoItem => (
                    <div className="task">
                        <span id={todoItem["id"]}>
                           {todoItem["name"]}
                        </span>
                        <button className="delete" onClick={() => onClickDeleteTodoItem(todoItem["id"])}>
                            <i className="far fa-trash-alt"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
