const BASE_URL = "http://127.0.0.1:5000";

// Redirect if already logged in
function checkAuth() {
    if(!localStorage.getItem("token")){
        window.location.href = "login.html";
    }
}

// Signup
function signup() {
    fetch(BASE_URL + "/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: signupUsername.value,
            email: signupEmail.value,
            password: signupPassword.value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Signup successful!");
        window.location.href = "login.html";
    });
}

// Login
function login() {
    fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.token){
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed");
        }
    });
}

// Create Task
function createTask() {
    fetch(BASE_URL + "/create_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            title: title.value,
            description: description.value,
            duedate: duedate.value,
            priority: priority.value,
            status: "Pending"
        })
    })
    .then(res => res.json())
    .then(data => getTasks());
}

// Get Tasks
function getTasks() {
    fetch(BASE_URL + "/get_task", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(tasks => {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            taskList.innerHTML += `
                <div class="task-card">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <small>Due: ${task.duedate}</small><br>
                    <small>Priority: ${task.priority}</small><br>
                    <small>Status: ${task.status}</small>
                    <button onclick="deleteTask(${task.task_id})">Delete</button>
                </div>
            `;
        });
    });
}

// Delete Task
function deleteTask(id) {
    fetch(BASE_URL + "/delete_apply/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => getTasks());
}

// Logout
function logout(){
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
