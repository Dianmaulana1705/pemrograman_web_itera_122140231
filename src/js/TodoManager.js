import { Task } from "./Task.js";

/**
 * Class untuk mengelola daftar tugas
 */
export class TodoManager {
  #tasks = [];
  #filter = "all";

  constructor() {
    this.loadTasks().then(() => this.renderTasks());
  }

  /**
   * Menambah tugas baru
   * @param {Object} options - Opsi tugas
   * @param {string} options.description - Deskripsi tugas
   */
  addTask = ({ description = "" } = {}) => {
    const taskInput = document.getElementById("taskInput");
    description = taskInput.value.trim() || description;
    if (!description) return;

    const id = Date.now();
    const newTask = new Task(id, description);
    this.#tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    taskInput.value = "";
    this.showNotification("Tugas ditambahkan!");
  };

  /**
   * Mengedit tugas yang ada
   * @param {number} id - ID tugas
   * @param {string} newDescription - Deskripsi baru
   */
  editTask = (id, newDescription) => {
    const task = this.#tasks.find((t) => t.id === id);
    if (task && newDescription.trim()) {
      task.description = newDescription;
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Tugas diperbarui!");
    }
  };

  /**
   * Menghapus tugas
   * @param {number} id - ID tugas
   */
  deleteTask = (id) => {
    this.#tasks = this.#tasks.filter((t) => t.id !== id);
    this.saveTasks();
    this.renderTasks();
    this.showNotification("Tugas dihapus!");
  };

  /**
   * Mengubah status selesai tugas
   * @param {number} id - ID tugas
   */
  toggleTask = (id) => {
    const task = this.#tasks.find((t) => t.id === id);
    if (task) {
      task.toggleComplete();
      this.saveTasks();
      this.renderTasks();
      this.showNotification(task.completed ? "Tugas selesai!" : "Tugas dibatalkan!");
    }
  };

  /**
   * Menghapus semua tugas
   */
  clearTasks = () => {
    if (confirm("Hapus semua tugas?")) {
      this.#tasks = [];
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Semua tugas dihapus!");
    }
  };

  /**
   * Memfilter tugas berdasarkan status
   * @param {string} filter - Tipe filter (all, completed, pending)
   */
  filterTasks = (filter) => {
    this.#filter = filter;
    this.renderTasks();
  };

  /**
   * Menghitung jumlah tugas selesai menggunakan reduce
   * @returns {number} Jumlah tugas selesai
   */
  getCompletedCount = () =>
    this.#tasks.reduce((count, task) => count + (task.completed ? 1 : 0), 0);

  /**
   * Menyimpan tugas ke localStorage
   * @returns {Promise<void>}
   */
  saveTasks = () =>
    new Promise((resolve, reject) => {
      try {
        localStorage.setItem("tasks", JSON.stringify(this.#tasks));
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  /**
   * Memuat tugas dari localStorage
   * @returns {Promise<void>}
   */
  loadTasks = async () => {
    try {
      const data = localStorage.getItem("tasks");
      if (data) {
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) throw new Error("Data tugas tidak valid");
        this.#tasks = parsed.map(
          ({ id, description, completed }) =>
            new Task(id, description, completed)
        );
      }
    } catch (error) {
      console.error("Gagal memuat tugas:", error);
      this.#tasks = [];
    }
  };

  /**
   * Menampilkan notifikasi
   * @param {string} message - Pesan notifikasi
   */
  showNotification = (message) => {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 2000);
  };

  /**
   * Merender tugas ke DOM
   */
  renderTasks = () => {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    const filteredTasks = this.#tasks.filter((task) => {
      if (this.#filter === "completed") return task.completed;
      if (this.#filter === "pending") return !task.completed;
      return true;
    });
    const taskHtmls = filteredTasks.map((task) => `
      <div class="todo-item ${task.completed ? "completed" : ""}">
        <span>${task.description}</span>
        <div>
          <button onclick="todoManager.toggleTask(${task.id})">
            ${task.completed ? "Batal" : "Selesai"}
          </button>
          <button onclick="todoManager.startEdit(${task.id}, '${
      task.description
    }')">Edit</button>
          <button onclick="todoManager.deleteTask(${task.id})">Hapus</button>
        </div>
      </div>
    `);
    todoList.innerHTML = taskHtmls.join("");
    todoList.innerHTML += `<p>Total selesai: ${this.getCompletedCount()} tugas</p>`;
  };

  /**
   * Memulai pengeditan tugas dengan input inline
   * @param {number} id - ID tugas
   * @param {string} description - Deskripsi saat ini
   */
  startEdit = (id, description) => {
    const todoList = document.getElementById("todoList");
    const taskElement = [...todoList.children].find((el) =>
      el.querySelector(`button[onclick*="${id}"]`)
    );
    taskElement.innerHTML = `
      <input type="text" class="edit-input" value="${description}">
      <div>
        <button onclick="todoManager.editTask(${id}, this.previousElementSibling.value)">Simpan</button>
        <button onclick="todoManager.renderTasks()">Batal</button>
      </div>
    `;
  };
}