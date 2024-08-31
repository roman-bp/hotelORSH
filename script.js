// Функция для получения списка комнат
function fetchRooms() {
    fetch('http://localhost:3000/rooms')
        .then(response => response.json())
        .then(data => {
            const roomsDiv = document.getElementById('rooms');
            roomsDiv.innerHTML = '';
            data.data.forEach(room => {
                const roomElement = document.createElement('div');
                roomElement.innerHTML = `
                    <h3>Кімната ${room.room_number}</h3>
                    <p>Тип: ${room.room_type}</p>
                    <p>Ціна: $${room.price}/ніч</p>
                    <p>Статус: ${room.status}</p>
                `;
                roomsDiv.appendChild(roomElement);
            });
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// Функция для получения списка бронирований
function fetchBookings() {
    fetch('http://localhost:3000/bookings')
        .then(response => response.json())
        .then(data => {
            const bookingsDiv = document.getElementById('bookings');
            bookingsDiv.innerHTML = '';
            data.data.forEach(booking => {
                const bookingElement = document.createElement('div');
                bookingElement.innerHTML = `
                    <h3>Бронювання #${booking.booking_id}</h3>
                    <p>Кімната: ${booking.room_id}</p>
                    <p>Гість: ${booking.guest_name}</p>
                    <p>Дата заїзду: ${booking.check_in_date}</p>
                    <p>Дата виїзду: ${booking.check_out_date}</p>
                `;
                bookingsDiv.appendChild(bookingElement);
            });
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// Функция для получения списка гостей
function fetchGuests() {
    fetch('http://localhost:3000/guests')
        .then(response => response.json())
        .then(data => {
            const guestsDiv = document.getElementById('guests');
            guestsDiv.innerHTML = '';
            data.data.forEach(guest => {
                const guestElement = document.createElement('div');
                guestElement.innerHTML = `
                    <h3>Гість: ${guest.name}</h3>
                    <p>Email: ${guest.email}</p>
                    <p>Телефон: ${guest.phone}</p>
                    <p>Адреса: ${guest.address}</p>
                `;
                guestsDiv.appendChild(guestElement);
            });
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// Инициализация данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchRooms();
    fetchBookings();
    fetchGuests();
});


// Функция для получения списка комнат
function fetchRooms() {
    fetch('http://localhost:3000/rooms')
        .then(response => response.json())
        .then(data => {
            const roomsDiv = document.getElementById('rooms');
            roomsDiv.innerHTML = '';
            data.data.forEach(room => {
                const roomElement = document.createElement('div');
                roomElement.innerHTML = `
                    <h3>Кімната ${room.room_number}</h3>
                    <p>Тип: ${room.room_type}</p>
                    <p>Ціна: $${room.price}/ніч</p>
                    <p>Статус: ${room.status}</p>
                `;
                roomsDiv.appendChild(roomElement);
            });
        })
        .catch(error => console.error('Ошибка при получении даних:', error));
}

// Функция для получения списка бронирований
function fetchBookings() {
    fetch('http://localhost:3000/bookings')
        .then(response => response.json())
        .then(data => {
            const bookingsDiv = document.getElementById('bookings');
            bookingsDiv.innerHTML = '';
            data.data.forEach(booking => {
                const bookingElement = document.createElement('div');
                bookingElement.innerHTML = `
                    <h3>Бронювання #${booking.booking_id}</h3>
                    <p>Кімната: ${booking.room_id}</p>
                    <p>Гість: ${booking.guest_name}</p>
                    <p>Дата заїзду: ${booking.check_in_date}</p>
                    <p>Дата виїзду: ${booking.check_out_date}</p>
                `;
                bookingsDiv.appendChild(bookingElement);
            });
        })
        .catch(error => console.error('Ошибка при получении даних:', error));
}

// Функция для получения списка гостей
function fetchGuests() {
    fetch('http://localhost:3000/guests')
        .then(response => response.json())
        .then(data => {
            const guestsDiv = document.getElementById('guests');
            guestsDiv.innerHTML = '';
            data.data.forEach(guest => {
                const guestElement = document.createElement('div');
                guestElement.innerHTML = `
                    <h3>Гість: ${guest.name}</h3>
                    <p>Email: ${guest.email}</p>
                    <p>Телефон: ${guest.phone}</p>
                    <p>Адреса: ${guest.address}</p>
                `;
                guestsDiv.appendChild(guestElement);
            });
        })
        .catch(error => console.error('Ошибка при получении даних:', error));
}

// Функция для добавления новой комнаты
function addRoom(event) {
    event.preventDefault();
    const roomData = {
        room_number: document.getElementById('room_number').value,
        room_type: document.getElementById('room_type').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        size: document.getElementById('size').value,
        beds: document.getElementById('beds').value,
        amenities: document.getElementById('amenities').value,
        maintenance: document.getElementById('maintenance').value,
    };

    fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Комната добавлена:', data);
        fetchRooms(); // Обновляем список комнат
    })
    .catch(error => console.error('Ошибка при добавлении комнаты:', error));
}

// Функция для добавления нового бронирования
function addBooking(event) {
    event.preventDefault();
    const bookingData = {
        room_id: document.getElementById('room_id').value,
        guest_name: document.getElementById('guest_name').value,
        check_in_date: document.getElementById('check_in_date').value,
        check_out_date: document.getElementById('check_out_date').value,
        contact_info: document.getElementById('contact_info').value,
        total_price: document.getElementById('total_price').value,
    };

    fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Бронирование добавлено:', data);
        fetchBookings(); // Обновляем список бронирований
    })
    .catch(error => console.error('Ошибка при добавлении бронирования:', error));
}

// Функция для добавления нового гостя
function addGuest(event) {
    event.preventDefault();
    const guestData = {
        name: document.getElementById('guest_name_form').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
    };

    fetch('http://localhost:3000/guests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Гість доданий:', data);
        fetchGuests(); // Обновляем список гостей
    })
    .catch(error => console.error('Ошибка при добавлении гостя:', error));
}

// Инициализация данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchRooms();
    fetchBookings();
    fetchGuests();
});
