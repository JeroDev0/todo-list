document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskNameInput = document.getElementById('task-name');

    // Función para leer las tareas desde el servidor
    function loadTasks() {
        fetch('backend/tasks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'read' })
        })
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                taskList.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${task.name} - ${task.status} (${task.created_at})
                        <div>
                            <select class="custom-select mr-2" data-id="${task.id}">
                                <option value="1" ${task.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="2" ${task.status === 'Realizada' ? 'selected' : ''}>Realizada</option>
                                <option value="3" ${task.status === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                            </select>
                            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${task.id}">Eliminar</button>
                        </div>
                    </li>
                `;
            });
            addEventListeners();
        });
    }

    // Crear una nueva tarea
    addTaskBtn.addEventListener('click', function () {
        const taskName = taskNameInput.value.trim();
        if (taskName) {
            fetch('backend/tasks.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ action: 'create', name: taskName })
            }).then(() => {
                taskNameInput.value = '';
                loadTasks();
            });
        }
    });

    // Actualizar estado de la tarea
    function updateTaskStatus(taskId, statusId) {
        fetch('backend/tasks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'update', id: taskId, status_id: statusId })
        }).then(() => {
            loadTasks();
        });
    }

    // Eliminar una tarea
    function deleteTask(taskId) {
        fetch('backend/tasks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'delete', id: taskId })
        }).then(() => {
            loadTasks();
        });
    }

    // Añadir event listeners a los botones de las tareas
    function addEventListeners() {
        document.querySelectorAll('.delete-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                const taskId = this.getAttribute('data-id');
                deleteTask(taskId);
            });
        });

        document.querySelectorAll('.custom-select').forEach(select => {
            select.addEventListener('change', function () {
                const taskId = this.getAttribute('data-id');
                const statusId = this.value;
                updateTaskStatus(taskId, statusId);
            });
        });
    }
    
    // Cargar las tareas cuando la página se carga por primera vez
    loadTasks();
});
