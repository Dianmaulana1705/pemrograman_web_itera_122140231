/**
 * Class untuk merepresentasikan tugas dalam to-do list
 */
export class Task {
    /**
     * @param {number} id - ID unik tugas
     * @param {string} description - Deskripsi tugas
     * @param {boolean} completed - Status selesai tugas
     */
    constructor(id, description, completed = false) {
      this.id = id;
      this.description = description;
      this.completed = completed;
    }
  
    /**
     * Mengubah status selesai tugas
     * @returns {void}
     */
    toggleComplete = () => {
      this.completed = !this.completed;
    };
  }
  
  /**
   * Class turunan untuk tugas dengan prioritas
   * @extends Task
   */
  export class PriorityTask extends Task {
    /**
     * @param {number} id - ID unik tugas
     * @param {string} description - Deskripsi tugas
     * @param {string} priority - Prioritas tugas (low, medium, high)
     * @param {boolean} completed - Status selesai tugas
     */
    constructor(id, description, priority = "low", completed = false) {
      super(id, description, completed);
      this.priority = priority;
    }
  
    /**
     * Mengembalikan metadata tugas
     * @returns {Object} Objek metadata
     */
    getMetadata = () => ({
      taskId: this.id,
      priority: this.priority,
      status: this.completed ? "Selesai" : "Belum selesai"
    });
  }