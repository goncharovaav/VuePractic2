Vue.component('notes', {
    template: `
    <div class="notes">
        <h1 class="title">Заметки</h1>
        <form class="add-form" @submit.prevent="addNote">
            <h3>Добавить заметку</h3>
            <input type="text" v-model="title" placeholder="Название заметки" class="add-form-input">
            
            <div class="deadline-section">
                <label>Дедлайн (необязательно):</label>
                <input type="datetime-local" v-model="noteDeadline" class="deadline-input">
            </div>
            
            <div class="tasks">
                <h3>Задачи:</h3>
                <div v-for="(task, index) in tasks" :key="index" class="tasks-element">
                    <input v-model="tasks[index]" placeholder="Задача" class="add-form-input">
                    <button type="button" @click="removeTask(index)" :disabled="tasks.length <= 3" class="remove-button">
                        {{ tasks.length <= 3 ? 'Минимум' : 'Удалить' }}
                    </button>
                </div>
                <div class="task-button">
                     <button type="button" @click="addTask" :disabled="tasks.length >= 5" class="add-task-button">
                        {{ tasks.length >= 5 ? 'Максимум задач' : 'Добавить задачу' }}
                     </button>
                </div>
                <p v-if="tasks.length >= 5" class="max-tasks-message">Достигнут максимум задач</p>
                <p v-if="tasks.length <= 3" class="min-tasks-message">Минимум задач</p>
            </div>
            <button type="submit" :disabled="newNotes.length >= 3" class="add-note-button">
                {{ newNotes.length >= 3 ? 'Первый столбец заполнен' : 'Добавить заметку' }}
            </button>
            <p v-if="newNotes.length >= 3" class="error-message">В первом столбце уже 3 заметки. Дождитесь их перемещения.</p>
        </form>
        
        <div class="columns">
            <div class="column" :class="{ 'column-disabled': disableFirstColumn }">
                <h2 class="column-title">Новые</h2>
                <div v-for="note in newNotes" :key="note.id" class="note-tasks">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-if="note.deadline" class="note-deadline">
                        Дедлайн: {{ formatDeadline(note.deadline) }}
                    </div>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input 
                                type="checkbox" 
                                v-model="task.completed" 
                                @change="handleTaskCompletion(note)" 
                                :disabled="disableFirstColumn"
                                class="task-checkbox"
                            >
                            <span :class="{ 'task-completed': task.completed }">{{task.text}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Незавершенные</h2>
                <div v-for="note in progressNotes" :key="note.id" class="note-tasks">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-if="note.deadline" class="note-deadline">
                        Дедлайн: {{ formatDeadline(note.deadline) }}
                    </div>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input type="checkbox" v-model="task.completed" @change="handleTaskCompletion(note)" class="task-checkbox">
                            <span :class="{ 'task-completed': task.completed }">{{task.text}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Выполнено</h2>
                <div v-for="note in completedNotes" :key="note.id" 
                     class="note-tasks" 
                     :class="{ 'note-overdue': note.isOverdue }">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-if="note.deadline" class="note-deadline">
                        Дедлайн: {{ formatDeadline(note.deadline) }}
                        <span v-if="note.isOverdue" class="overdue-label">ПРОСРОЧЕНО</span>
                    </div>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input type="checkbox" v-model="task.completed" disabled class="task-checkbox">
                            <span class="task-completed">{{task.text}}</span>
                        </li>
                    </ul>
                    <p v-if="note.completedDate" class="completion-date">
                        Завершено: {{note.completedDate}}
                    </p>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            title: '',
            noteDeadline: '',
            tasks: ['', '', ''],
            notes: [],
            disableFirstColumn: false,
        }
    },
    computed: {
        newNotes() {
            return this.notes.filter(n => n.status === 'new').slice(0, 3);
        },
        progressNotes() {
            return this.notes.filter(n => n.status === 'progress').slice(0, 5);
        },
        completedNotes() {
            return this.notes.filter(n => n.status === 'completed');
        }
    },
    methods: {
        addNote() {
            if (!this.title) {
                alert('Введите название заметки!');
                return;
            }

            for (let i = 0; i < this.tasks.length; i++) {
                if (!this.tasks[i]) {
                    alert('Заполните все задачи!');
                    return;
                }
            }

            if (this.tasks.length < 3) {
                alert('Минимум 3 задачи!');
                return;
            }

            if (this.tasks.length > 5) {
                alert('Максимум 5 задач!');
                return;
            }

            if (this.newNotes.length >= 3) {
                alert('Первый столбец заполнен!');
                return;
            }

            let newNote = {
                id: Date.now(),
                title: this.title,
                deadline: this.noteDeadline || null,
                tasks: [],
                status: 'new',
                completedDate: null,
                isOverdue: false
            };

            for (let i = 0; i < this.tasks.length; i++) {
                newNote.tasks.push({
                    text: this.tasks[i],
                    completed: false
                });
            }

            this.notes.push(newNote);

            this.title = '';
            this.noteDeadline = '';
            this.tasks = ['', '', ''];

            this.checkNotes();
            this.saveData();
        },
        addTask() {
            if (this.tasks.length < 5) {
                this.tasks.push('');
            } else {
                alert('Максимум 5 задач!');
            }
        },
        removeTask(index) {
            if (this.tasks.length > 3) {
                this.tasks.splice(index, 1);
            } else {
                alert('Минимум 3 задачи!');
            }
        },
        handleTaskCompletion(note) {
            this.checkProgress(note);
        },
        checkProgress(note) {
            let done = 0;
            for (let i = 0; i < note.tasks.length; i++) {
                if (note.tasks[i].completed) {
                    done++;
                }
            }

            let total = note.tasks.length;
            let percent = done / total;

            let inProgressCount = 0;
            for (let i = 0; i < this.notes.length; i++) {
                if (this.notes[i].status === 'progress') {
                    inProgressCount++;
                }
            }

            if (note.status === 'new' && percent >= 0.5) {
                if (inProgressCount < 5) {
                    note.status = 'progress';
                    this.disableFirstColumn = false;
                } else {
                    this.disableFirstColumn = true;
                    alert('Второй столбец заполнен!');
                }
            }

            if (percent === 1) {
                note.status = 'completed';
                note.completedDate = new Date().toLocaleString();

                if (note.deadline) {
                    const deadlineDate = new Date(note.deadline);
                    const completionDate = new Date();
                    note.isOverdue = completionDate > deadlineDate;
                }

                this.disableFirstColumn = false;
            }

            this.checkNotes();
            this.saveData();
        },
        checkNotes() {
            let inProgressCount = 0;
            for (let i = 0; i < this.notes.length; i++) {
                if (this.notes[i].status === 'progress') {
                    inProgressCount++;
                }
            }

            let freePlaces = 5 - inProgressCount;

            for (let i = 0; i < this.notes.length; i++) {
                let note = this.notes[i];

                if (freePlaces > 0 && note.status === 'new') {
                    let done = 0;
                    for (let j = 0; j < note.tasks.length; j++) {
                        if (note.tasks[j].completed) {
                            done++;
                        }
                    }

                    let percent = done / note.tasks.length;

                    if (percent >= 0.5) {
                        note.status = 'progress';
                        freePlaces--;
                    }
                }
            }

            if (freePlaces > 0) {
                this.disableFirstColumn = false;
            }

            this.saveData();
        },
        saveData() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        formatDeadline(deadline) {
            if (!deadline) return '';
            const date = new Date(deadline);
            return date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        focusDeadline() {
            this.$nextTick(() => {
                const input = document.querySelector('.deadline-input');
                if (input) {
                    input.focus();
                }
            });
        }
    },
    mounted() {
        let saved = localStorage.getItem('notes');
        if (saved) {
            this.notes = JSON.parse(saved);
            this.notes.forEach(note => {
                if (note.status === 'completed' && note.deadline && note.isOverdue === undefined) {
                    const deadlineDate = new Date(note.deadline);
                    const completionDate = new Date(note.completedDate || Date.now());
                    note.isOverdue = completionDate > deadlineDate;
                }
            });
        }
        this.checkNotes();
    }
})

let app = new Vue({
    el: '#app',
})