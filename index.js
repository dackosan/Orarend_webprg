const API = 'http://localhost:3000/timetable';
const days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

async function fetchData() {
    const res = await fetch(API);
    const data = await res.json();

    const table = document.querySelector('#timetable tbody');
    table.innerHTML = '';

    const maxHour = Math.max(...data.map(e => e.hour), 0); 

    for (let hour = 0; hour <= maxHour; hour++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${hour}.</td>`;

        for (const day of days) {
            const match = data.find(e => e.day === day && e.hour === hour);
            row.innerHTML += `<td>
                <input value="${match ? match.subject : ''}" 
                data-id="${match ? match.id : ''}" 
                data-day="${day}" 
                data-hour="${hour}" />
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
            await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, hour, subject })
            });
        } else if (subject.trim() !== '') {
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

async function addLesson() {
    const day = document.getElementById('add-day').value;
    const hour = parseInt(document.getElementById('add-hour').value);
    const subject = document.getElementById('add-subject').value.trim();

    if (!day || isNaN(hour) || hour < 0 || !subject) {
      alert("Hibás adat! Kérlek, tölts ki mindent helyesen.");
      return;
    }

    const existing = await (await fetch(API)).json();
    const alreadyExists = existing.find(e => e.day === day && e.hour === hour);

    if (alreadyExists) {
      alert(`Ezen a napon (${day}) a(z) ${hour}. órában már van tantárgy (${alreadyExists.subject})!`);
      return;
    }

    const dayData = existing.filter(e => e.day === day);
    const maxHour = Math.max(...dayData.map(item => item.hour), 0);

    if (hour > maxHour) {
      for (let i = maxHour + 1; i < hour; i++) {
        await fetch(API, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ day, hour: i, subject: '' })
        });
      }
    }

    await fetch(API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ day, hour, subject })
    });

    closeAddModal();
    await fetchData();
}
  

async function deleteLesson() {
    const day = document.getElementById('delete-day').value;
    const hour = parseInt(document.getElementById('delete-hour').value);
  
    if (!day || isNaN(hour) || hour < 0) {
      alert("Hibás adat! Válassz napot és adj meg helyes óraszámot.");
      return;
    }
  
    const existing = await (await fetch(API)).json();
    const lesson = existing.find(e => e.day === day && e.hour === hour);
  
    if (!lesson) {
      alert(`A ${day} napon a(z) ${hour}. órában nincs tantárgy.`);
      return;
    }
  
    await fetch(`${API}/${lesson.id}`, { method: 'DELETE' });
    closeDeleteModal();
    await fetchData();
}

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

window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        closeAddModal();
        closeDeleteModal();
    }
}

fetchData();