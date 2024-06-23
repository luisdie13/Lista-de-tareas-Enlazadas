// script.js

// Clase Node que representa un nodo en la lista enlazada
class Node {
    constructor(data) {
      this.data = data; // objeto que contiene el texto de la tarea y su estado de completitud
      this.next = null; // enlace al siguiente nodo
    }
  }
  
  // Clase TaskList que representa la lista enlazada
  class TaskList {
    constructor() {
      this.head = null; // nodo cabeza de la lista
      this.tail = null; // nodo cola de la lista
      this.tasks = []; // array de tareas
    }
  
    // Método para agregar una tarea a la lista
    addTask(task) {
      const newNode = new Node({ text: task, completed: false, id: this.tasks.length });
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        this.tail.next = newNode;
        this.tail = newNode;
      }
      this.tasks.push(newNode.data);
    }
  
    // Método para marcar una tarea como completada
    toggleTaskCompletion(taskId) {
      let node = this.head;
      while (node) {
        if (node.data.id === taskId) {
          node.data.completed = !node.data.completed;
          break;
        }
        node = node.next;
      }
    }
  
    // Método para eliminar una tarea de la lista
    deleteTask(taskId) {
      let prevNode = null;
      let node = this.head;
      while (node) {
        if (node.data.id === taskId) {
          if (prevNode) {
            prevNode.next = node.next;
          } else {
            this.head = node.next;
          }
          if (node === this.tail) {
            this.tail = prevNode;
          }
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          break;
        }
        prevNode = node;
        node = node.next;
      }
    }
  }
  
  // Selección de elementos del DOM
  const taskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const addTaskForm = document.getElementById('add-task-form');
  
  // Instanciar la lista de tareas
  const taskListInstance = new TaskList();
  
  // Agregar evento de clic al botón de agregar tarea
  addTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      taskListInstance.addTask(taskText);
  
      // Actualizar la interfaz de usuario para mostrar la nueva tarea
      const newTaskHTML = `
        <li>
          <input type="checkbox" id="task-${taskListInstance.tasks[taskListInstance.tasks.length - 1].id}">
          <label for="task-${taskListInstance.tasks[taskListInstance.tasks.length - 1].id}">${taskText}</label>
          <button class="delete-task">Eliminar</button>
        </li>
      `;
      taskList.innerHTML += newTaskHTML;
  
      // Limpiar el campo de entrada
      taskInput.value = '';
    }
  });

// Agregar evento de cambio a las casillas de verificación de las tareas
taskList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const taskId = e.target.id.replace('task-', '');
      taskListInstance.toggleTaskCompletion(taskId);
      saveTaskList();
  
      // Actualizar la interfaz de usuario para mostrar el estado de completitud de la tarea
      const taskLabel = e.target.nextElementSibling;
      if (e.target.checked) {
        taskLabel.style.textDecoration = 'line-through';
      } else {
        taskLabel.style.textDecoration = 'none';
      }
    }
  });
  
  // Agregar evento de clic a los botones de eliminar tarea
  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
      const taskId = e.target.parentNode.querySelector('input[type="checkbox"]').id.replace('task-', '');
      taskListInstance.deleteTask(taskId);
      e.target.parentNode.remove();
      saveTaskList();
    }
  });
  
// Función para guardar la lista de tareas en el almacenamiento local
function saveTaskList() {
    const tasks = taskListInstance.tasks.map((task) => ({ text: task.text, completed: task.completed, id: task.id }));
    const taskListJSON = JSON.stringify(tasks);
    localStorage.setItem('taskList', taskListJSON);
  }
  
  // Función para cargar la lista de tareas desde el almacenamiento local
  function loadTaskList() {
    const taskListJSON = localStorage.getItem('taskList');
    if (taskListJSON) {
      const tasks = JSON.parse(taskListJSON);
      tasks.forEach((task) => {
        taskListInstance.addTask(task.text);
        taskListInstance.tasks[taskListInstance.tasks.length - 1].id = task.id;
        if (task.completed) {
          taskListInstance.toggleTaskCompletion(task.id);
        }
      });
      // Actualizar la interfaz de usuario para mostrar la lista cargada
      taskList.innerHTML = '';
      taskListInstance.tasks.forEach((task) => {
        const taskHTML = `
          <li>
            <input type="checkbox" id="task-${task.id}">
            <label for="task-${task.id}">${task.text}</label>
            <button class="delete-task">Eliminar</button>
          </li>
        `;
        taskList.innerHTML += taskHTML;
        if (task.completed) {
          const taskLabel = document.getElementById(`task-${task.id}`).nextElementSibling;
          taskLabel.style.textDecoration = 'line-through';
        }
      });
    }
  }
  
  // Cargar la lista de tareas desde el almacenamiento local cuando se carga la página
  loadTaskList();
  
  // Agregar evento de submit al formulario de agregar tarea
  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = document.getElementById('task-text').value;
    taskListInstance.addTask(taskText);
    saveTaskList();
    document.getElementById('task-text').value = '';
  });