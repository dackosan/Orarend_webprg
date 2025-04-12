const API = 'http://localhost:3000/timetable';
const days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
const maxHours = 8;

async function fetchData() {
    const res = await fetch(API);
    const data = await res.json();

    const table = document.querySelector('#timetable tbody');
    table.innerHTML = '';

    for (let hour = 0; hour <= maxHours; hour++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${hour}.</td>`;

        for (const day of days) {
            const match = data.find(e => e.day === day && e.hour === hour);
            row.innerHTML += `<td>
                <input value="${match ? match.subject : ''}" 
                data-id="${match ? match.id : ''}" 
                data-day="${day}" 
                data-hour="${hour}"
                />
                </td>`;
        }

        table.appendChild(row);
    }
}

document.addEventListener('input', async e => {
    if (e.target.tagName === 'INPUT') {
        const subject = e.target.value;
        const id = e.target.dataset.id;
        const day = e.target.dataset.day;
        const hour = +e.target.dataset.hour;

        if (id) {
            // módosítás
            await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, hour, subject })
            });
        } else if (subject.trim() !== '') {
            // új bejegyzés
            const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, hour, subject })
            });
            const newEntry = await res.json();
            e.target.dataset.id = newEntry.id;
        }
    }
});

function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}
  
function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}
  
function openDeleteModal() {
    document.getElementById("deleteModal").style.display = "block";
}
  
function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}
  
  // Extra: kattintás a modalon kívül bezárja
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        closeAddModal();
        closeDeleteModal();
    }
}

fetchData();