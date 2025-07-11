document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM elements
    const form = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');

    let todos = [];
    let currentFilter = 'all';

    // 2. Load todos from localStorage
    if (localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'));
        renderTodos();
    }

    // 3. Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!todoInput.value.trim() || !dateInput.value) {
            alert('Please fill both task and date!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: todoInput.value.trim(),
            date: dateInput.value,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        form.reset();
    });

    // 4. Render todos based on filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            if (todo.completed) li.classList.add('completed');
            
            li.innerHTML = `
                <span>${todo.text} (Due: ${todo.date})</span>
                <div>
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // 5. Checkbox event
            li.querySelector('input').addEventListener('change', () => {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            });

            // 6. Delete button event
            li.querySelector('.delete-btn').addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    }

    // 7. Save to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // 8. Filter buttons
    filterAll.addEventListener('click', () => {
        currentFilter = 'all';
        renderTodos();
    });

    filterActive.addEventListener('click', () => {
        currentFilter = 'active';
        renderTodos();
    });

    filterCompleted.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTodos();
    });
});