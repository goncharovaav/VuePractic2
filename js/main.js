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
    </div>
    `,
    data() {
        return {
            title: '',
            tasks: ['', '', '']
        }
    },
    methods: {
        addNote() {
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