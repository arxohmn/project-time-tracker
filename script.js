const projectList = document.getElementById('project-list');
const addProjectButton = document.getElementById('add-project-btn');
const timerSection = document.querySelector('.timer');
const projectTitle = document.getElementById('project-title');
const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const renameButton = document.getElementById('rename-project-btn');
const deleteButton = document.getElementById('delete-project-btn');
const changeColorButton = document.getElementById('change-color-btn');
const backButton = document.getElementById('back-btn');
const colorPicker = document.getElementById('color-picker');
const colorOptionsContainer = document.querySelector('.color-options');

let activeProject = null;
let timerInterval = null;

let projects = {};

// Render project buttons
function renderProjects() {
    projectList.innerHTML = '';
    Object.keys(projects).forEach(projectId => {
        const project = projects[projectId];
        const button = document.createElement('button');
        button.className = 'project-btn';
        button.textContent = project.name;
        button.style.backgroundColor = project.color;
        button.setAttribute('data-project', projectId);
        button.addEventListener('click', () => showTimer(projectId));
        projectList.appendChild(button);
    });
}

// Format seconds into HH:MM:SS
function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// Update timer display
function updateTimeDisplay() {
    timeDisplay.textContent = formatTime(projects[activeProject].time);
}

// Start timer
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            projects[activeProject].time++;
            updateTimeDisplay();
        }, 1000);
        startButton.classList.add('active'); // Turn Start button green
        startButton.textContent = 'Running...'; // Update text
    }
}

// Pause timer
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.classList.remove('active'); // Revert Start button
    startButton.textContent = 'Start'; // Update text
}

// Reset timer
function resetTimer() {
    projects[activeProject].time = 0;
    updateTimeDisplay();
}

// Rename project
function renameProject() {
    const newName = prompt("Enter a new name for this project:", projects[activeProject].name);
    if (newName && newName.trim()) {
        projects[activeProject].name = newName.trim();
        projectTitle.textContent = newName;
        renderProjects(); // Re-render projects to reflect changes
    }
}

// Show color picker
function showColorPicker() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC300', '#8000FF'];
    colorOptionsContainer.innerHTML = '';
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = color;
        colorBox.addEventListener('click', () => {
            projects[activeProject].color = color;
            colorPicker.classList.add('hidden');
            renderProjects();
        });
        colorOptionsContainer.appendChild(colorBox);
    });
    colorPicker.classList.remove('hidden');
}

// Delete project
function deleteProject() {
    const confirmDelete = confirm(`Are you sure you want to delete "${projects[activeProject].name}"?`);
    if (confirmDelete) {
        delete projects[activeProject];
        goBack();
        renderProjects();
    }
}

// Add a new project
function addNewProject() {
    const projectName = prompt('Enter the name of your new project:');
    if (projectName) {
        const projectId = String(Date.now());
        projects[projectId] = { name: projectName, time: 0, color: '#007bff' };
        renderProjects();
    }
}

// Show project timer
function showTimer(projectId) {
    activeProject = projectId;
    projectTitle.textContent = projects[projectId].name;
    updateTimeDisplay();
    document.querySelector('.projects').classList.add('hidden');
    timerSection.classList.remove('hidden');
}

// Go back to project list
function goBack() {
    pauseTimer();
    timerSection.classList.add('hidden');
    document.querySelector('.projects').classList.remove('hidden');
}

// Event listeners
addProjectButton.addEventListener('click', addNewProject);
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
renameButton.addEventListener('click', renameProject);
changeColorButton.addEventListener('click', showColorPicker);
deleteButton.addEventListener('click', deleteProject);
backButton.addEventListener('click', goBack);

// Initial render
renderProjects();
