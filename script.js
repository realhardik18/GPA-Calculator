const gradePoints = { 'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 };
const subjectTable = document.getElementById('subject-table');
const gpaResult = document.getElementById('gpa-result');
const totalCreditsCard = document.getElementById('total-credits-card');
let courses = [];

// Fetch courses from courses.json (simulate loading JSON file)
fetch('courses.json')
    .then(response => response.json())
    .then(data => {
        courses = data;
    })
    .catch(error => console.error("Error loading courses.json:", error));

// Add a new subject row
document.getElementById('add-subject').addEventListener('click', () => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><div class="input-container"><input type="text" class="form-control course-input" placeholder="Subject Name" autocomplete="off"></div></td>
        <td>
            <select class="form-select">
                <option selected disabled>Grade</option>
                <option value="S">S</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
            </select>
        </td>
        <td><input type="number" class="form-control" placeholder="Credit Points" min="0.1" step="0.1"></td>
        <td><button class="btn btn-danger remove-subject">Remove</button></td>
    `;
    subjectTable.appendChild(row);

    // Autocomplete for course name
    const input = row.querySelector('.course-input');
    input.addEventListener('input', function() {
        closeAutocomplete();
        if (!this.value) return;
        const autocompleteDiv = document.createElement('div');
        autocompleteDiv.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(autocompleteDiv);

        courses.forEach(course => {
            if (course.courseName.toLowerCase().includes(this.value.toLowerCase())) {
                const item = document.createElement('div');
                item.classList.add('autocomplete-item');
                item.innerHTML = `${course.courseName} [${course.courseCode}]`;
                item.addEventListener('click', () => {
                    input.value = `${course.courseName} [${course.courseCode}]`;
                    row.querySelector('input[type="number"]').value = course.creditPoints;
                    closeAutocomplete();
                    updateGPA();
                });
                autocompleteDiv.appendChild(item);
            }
        });
    });

    row.querySelector('.remove-subject').addEventListener('click', () => {
        row.remove();
        updateGPA();
    });

    row.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updateGPA);
    });
});

function closeAutocomplete() {
    const items = document.querySelectorAll('.autocomplete-items');
    items.forEach(item => item.remove());
}

// Update GPA and Total Credits
function updateGPA() {
    const rows = subjectTable.querySelectorAll('tr');
    let totalGradePoints = 0;
    let totalCreditPoints = 0;

    rows.forEach(row => {
        const grade = row.querySelector('select').value;
        const creditPoints = parseFloat(row.querySelector('input[type="number"]').value);

        if (grade && gradePoints[grade] !== undefined && !isNaN(creditPoints)) {
            totalGradePoints += gradePoints[grade] * creditPoints;
            totalCreditPoints += creditPoints;
        }
    });

    // Update values in the GPA card
    gpaResult.textContent = totalCreditPoints > 0 ? (totalGradePoints / totalCreditPoints).toFixed(2) : '-';
    totalCreditsCard.textContent = totalCreditPoints.toFixed(2);
}
