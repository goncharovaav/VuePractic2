Vue.component('notes', {
    template: `
    <div class="notes">
        <h1 class="title">Заметки</h1>
        <form class="add-form">
            <h3>Добавить заметку</h3>
            <input type="text" v-model="title" required placeholder="Название заметки" class="add-form-input">
            <div class="tasks">
            <h3>Задачи:</h3>
            <div v-for="(task, index) in tasks" :key="index" class="tasks-element">
                <input v-model="tasks[index]" placeholder="Задача" class="add-form-input">
                <button @click="removeTask(index)" class="remove-button">Удалить</button>
            </div>
            <div class="task-button">
                 <button @click="addTask" class="add-task-button">Добавить задачу</button>
            </div>
            </div>
            <button @click="addNote" class="add-note-button">Добавить заметку</button>
        </form>
        
        <div class="columns">
            <div class="column">
                <h2 class="column-title">Новые</h2>
                <div v-for="note in newNotes" :key="note.id" class="note-new">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-for="(task, index) in note.tasks" :key="index" class="note-task">
                    <span>{{task}}</span>
                    </div>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Незавершенные</h2>
                <div v-for="note in progressNotes" :key="note.id" class="note-progress">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-for="(task, index) in note.tasks" :key="index" class="note-task">
                    <span>{{task}}</span>
                    </div>
                </div>
            </div>
            <div class="column">
                <h2 class="column-title">Выполнено</h2>
                <div v-for="note in completedNotes" :key="note.id" class="note-completed">
                    <h3 class="note-title">{{note.title}}</h3>
                    <div v-for="(task, index) in note.tasks" :key="index" class="note-task">
                    <span>{{task}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            title: '',
            tasks: ['', '', ''],
            notes: [],
        }
    },
    computed: {
        newNotes() {
            return this.notes.filter(n => n.status === 'new');
        },
        progressNotes() {
            return this.notes.filter(n => n.status === 'progress');
        },
        completedNotes() {
            return this.notes.filter(n => n.status === 'completed');
        }
    },
    methods: {
        addNote() {
            const note = {
                id: Date.now(),
                title: this.title,
                tasks: this.tasks,
                status: 'new',
            };
            this.notes.push(note);

            this.title = '';
            this.tasks = ['', '', ''];
        },
        addTask() {
            if (this.tasks.length < 5) {
                this.tasks.push('');
            }
        },
        removeTask(index) {
            if (this.tasks.length > 3){
                this.tasks.splice(index, 1);
            }
        }
    }
})
let app = new Vue({
    el: '#app',
})