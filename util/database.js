import sqlite from 'sqlite3';
const db = new sqlite.Database('./data/timetable.sqlite');

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
    }));
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS timetable");
    await dbRun("CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT, hour INTEGER, subject TEXT)");

    const entries = [
        ['Hétfő', 1, 'Emelt Matek'], ['Hétfő', 2, 'Emelt Matek'], ['Hétfő', 3, 'Angol'],
        ['Hétfő', 4, 'IKT II.'], ['Hétfő', 5, 'Irodalom'], ['Hétfő', 6, 'Web Programozás'],
        ['Kedd', 1, 'Állampolgári'], ['Kedd', 2, 'Testnevelés'], ['Kedd', 3, 'PHP'],
        ['Kedd', 4, 'Irodalom'], ['Kedd', 5, 'Történelem'], ['Kedd', 6, 'Matematika'],
        ['Kedd', 7, 'Szakmai Angol'], ['Kedd', 8, 'Szakmai Angol'],
        ['Szerda', 0, 'Asztali Alkalmazások Fejlesztése'], ['Szerda', 1, 'Asztali Alkalmazások Fejlesztése'], ['Szerda', 2, 'Asztali Alkalmazások Fejlesztése'],
        ['Szerda', 3, 'Történelem'], ['Szerda', 4, 'Osztályfőnöki'], ['Szerda', 5, 'Irodalom'],
        ['Szerda', 6, 'Matematika'], ['Szerda', 7, 'Angol'],
        ['Csütörtök', 1, 'Asztali Alkalmazások Fejlesztése'], ['Csütörtök', 2, 'IKT II.'], ['Csütörtök', 3, 'Testnevelés'],
        ['Csütörtök', 4, 'Testnevelés'], ['Csütörtök', 5, 'Történelem'], ['Csütörtök', 6, 'Matematika'],
        ['Péntek', 1, 'Nyelvtan'], ['Péntek', 2, 'Web Programozás'], ['Péntek', 3, 'Szakmai Angol'],
        ['Péntek', 4, 'Matematika'], ['Péntek', 5, 'Angol'], ['Péntek', 6, 'Történelem'],
    ];

    for (const [day, hour, subject] of entries) {
        await dbRun("INSERT INTO timetable (day, hour, subject) VALUES (?, ?, ?)", [day, hour, subject]);
    }
}