import express from 'express';
import cors from 'cors';
import { dbAll, dbRun, dbGet, initializeDatabase } from './util/database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/timetable', async (req, res) => {
    const data = await dbAll("SELECT * FROM timetable ORDER BY day, hour");
    res.json(data);
});

app.post('/timetable', async (req, res) => {
    const { day, hour, subject } = req.body;
    if (!day || hour == null || !subject) return res.status(400).json({ message: "Missing data!" });

    const result = await dbRun("INSERT INTO timetable (day, hour, subject) VALUES (?, ?, ?)", [day, hour, subject]);
    res.status(201).json({ id: result.lastID, day, hour, subject });
});

app.put('/timetable/:id', async (req, res) => {
    const { day, hour, subject } = req.body;
    const { id } = req.params;

    const existing = await dbGet("SELECT * FROM timetable WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ message: "Class not found!" });

    await dbRun("UPDATE timetable SET day = ?, hour = ?, subject = ? WHERE id = ?", [day, hour, subject, id]);
    res.json({ id: +id, day, hour, subject });
});

app.delete('/timetable/:id', async (req, res) => {
    const { id } = req.params;
    await dbRun("DELETE FROM timetable WHERE id = ?", [id]);
    res.json({ message: "Class deleted!" });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: `Error: ${err.message}` });
});

await initializeDatabase();
app.listen(3000, () => console.log("API running on port 3000"));