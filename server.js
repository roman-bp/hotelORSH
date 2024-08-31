const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Подключение к базе данных
const db = new sqlite3.Database('./hotel.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
    }
});

// Middleware для обработки JSON-запросов и CORS
app.use(express.json());
app.use(cors()); // Включаем CORS

// Создание таблиц
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_number TEXT NOT NULL,
            room_type TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT NOT NULL,
            size TEXT,
            beds INTEGER,
            amenities TEXT,
            maintenance TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER,
            guest_name TEXT,
            check_in_date TEXT,
            check_out_date TEXT,
            contact_info TEXT,
            total_price REAL,
            FOREIGN KEY(room_id) REFERENCES rooms(room_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS guests (
            guest_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT
        )
    `);

    console.log('Таблицы созданы или уже существуют.');
});

// Маршрут для получения списка всех комнат
app.get('/rooms', (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Успешно',
            data: rows
        });
    });
});

// Маршрут для добавления новой комнаты
app.post('/rooms', (req, res) => {
    const { room_number, room_type, price, status, size, beds, amenities, maintenance } = req.body;
    const sql = `
        INSERT INTO rooms (room_number, room_type, price, status, size, beds, amenities, maintenance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [room_number, room_type, price, status, size, beds, amenities, maintenance];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Новая комната добавлена',
            data: { room_id: this.lastID },
        });
    });
});

// Маршрут для обновления статуса комнаты
app.put('/rooms/:id', (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE rooms SET status = ? WHERE room_id = ?';
    const params = [status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Статус комнаты обновлен',
            changes: this.changes
        });
    });
});

// Маршрут для удаления комнаты
app.delete('/rooms/:id', (req, res) => {
    const sql = 'DELETE FROM rooms WHERE room_id = ?';
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Комната удалена',
            changes: this.changes
        });
    });
});

// Маршрут для получения списка всех бронирований
app.get('/bookings', (req, res) => {
    const sql = 'SELECT * FROM bookings';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Успешно',
            data: rows
        });
    });
});

// Маршрут для создания нового бронирования
app.post('/bookings', (req, res) => {
    const { room_id, guest_name, check_in_date, check_out_date, contact_info, total_price } = req.body;
    const sql = `
        INSERT INTO bookings (room_id, guest_name, check_in_date, check_out_date, contact_info, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [room_id, guest_name, check_in_date, check_out_date, contact_info, total_price];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Обновляем статус комнаты
        const updateRoomSql = 'UPDATE rooms SET status = ? WHERE room_id = ?';
        db.run(updateRoomSql, ['заброньована', room_id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Бронирование создано, статус комнаты обновлен',
                booking_id: this.lastID
            });
        });
    });
});

// Маршрут для отмены бронирования
app.delete('/bookings/:id', (req, res) => {
    const sql = 'DELETE FROM bookings WHERE booking_id = ?';
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Бронирование отменено',
            changes: this.changes
        });
    });
});

// Маршрут для добавления нового гостя
app.post('/guests', (req, res) => {
    const { name, email, phone, address } = req.body;
    const sql = `
        INSERT INTO guests (name, email, phone, address)
        VALUES (?, ?, ?, ?)
    `;
    const params = [name, email, phone, address];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Новый гость добавлен',
            guest_id: this.lastID
        });
    });
});

// Маршрут для получения списка всех гостей
app.get('/guests', (req, res) => {
    const sql = 'SELECT * FROM guests';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Успешно',
            data: rows
        });
    });
});

// Маршрут для обновления информации о госте
app.put('/guests/:id', (req, res) => {
    const { name, email, phone, address } = req.body;
    const sql = `
        UPDATE guests
        SET name = ?, email = ?, phone = ?, address = ?
        WHERE guest_id = ?
    `;
    const params = [name, email, phone, address, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Информация о госте обновлена',
            changes: this.changes
        });
    });
});

// Маршрут для удаления гостя
app.delete('/guests/:id', (req, res) => {
    const sql = 'DELETE FROM guests WHERE guest_id = ?';
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Гость удален',
            changes: this.changes
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
