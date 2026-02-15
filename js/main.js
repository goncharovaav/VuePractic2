Vue.component('notes', {
    template: `
    <div class="notes">
        <h1 class="title">Заметки</h1>
        <form class="add-form" @submit.prevent="addNote">
            <h3>Добавить заметку</h3>
            <input type="text" v-model="title" placeholder="Название заметки" class="add-form-input">
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
            <button type="submit" class="add-note-button">Добавить заметку</button>
        </form>
        
        <div class="columns">
            <div class="column">
                <h2 class="column-title">Новые</h2>
                <div v-for="note in newNotes" :key="note.id" class="note-tasks">
                    <h3 class="note-title">{{note.title}}</h3>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input type="checkbox" v-model="task.completed" @change="checkProgress(note)" class="task-checkbox">
                            <span :class="{ 'task-completed': task.completed }">{{task.text}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Незавершенные</h2>
                <div v-for="note in progressNotes" :key="note.id" class="note-tasks">
                    <h3 class="note-title">{{note.title}}</h3>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input type="checkbox" v-model="task.completed" @change="checkProgress(note)" class="task-checkbox">
                            <span :class="{ 'task-completed': task.completed }">{{task.text}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Выполнено</h2>
                <div v-for="note in completedNotes" :key="note.id" class="note-tasks">
                    <h3 class="note-title">{{note.title}}</h3>
                    <ul class="note-list">
                        <li v-for="(task, index) in note.tasks" :key="index" class="note-task">
                            <input type="checkbox" v-model="task.completed" disabled class="task-checkbox">
                            <span class="task-completed">{{task.text}}</span>
                        </li>
                    </ul>
                    <p v-if="note.completedDate" class="completion-date">{{note.completedDate}}</p>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            title: '',
            tasks: ['', '', ''],
            notes: []
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

            let newNote = {
                id: Date.now(),
                title: this.title,
                tasks: [],
                status: 'new',
                completedDate: null
            };

            for (let i = 0; i < this.tasks.length; i++) {
                newNote.tasks.push({
                    text: this.tasks[i],
                    completed: false
                });
            }

            this.notes.push(newNote);

            this.title = '';
            this.tasks = ['', '', ''];
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
        checkProgress(note) {
            let done = 0;
            for (let i = 0; i < note.tasks.length; i++) {
                if (note.tasks[i].completed) {
                    done++;
                }
            }

            let total = note.tasks.length;
            let percent = done / total;

            if (note.status === 'new' && percent > 0.5) {
                note.status = 'progress';
            }

            if (percent === 1) {
                note.status = 'completed';
                note.completedDate = new Date().toLocaleString();
            }
        }
    }
})

let app = new Vue({
    el: '#app',
})