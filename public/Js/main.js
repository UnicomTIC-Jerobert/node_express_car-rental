// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('carModal');
    const addCarBtn = document.getElementById('addCarBtn');
    const closeBtn = document.querySelector('.close-button');
    const form = document.getElementById('carForm');
    const modalTitle = document.getElementById('modalTitle');
    const carIdInput = document.getElementById('carId');
    const carGrid = document.getElementById('carGrid');

    // Open modal for adding a car
    addCarBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Car';
        carIdInput.value = '';
        form.reset();
        modal.style.display = 'block';
    });

    // Close the modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission (Add/Edit)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = carIdInput.value;
        const url = id ? `/api/cars/${id}` : '/api/cars';
        const method = id ? 'PUT' : 'POST';

        const carData = {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData)
            });

            if (response.ok) {
                await renderCars(); // Re-render the car list
                modal.style.display = 'none';
            } else {
                alert('Failed to save car.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    });

    // Handle Edit and Delete button clicks
    carGrid.addEventListener('click', async (e) => {
        const target = e.target;
        const carCard = target.closest('.car-card');
        if (!carCard) return;

        const carId = carCard.dataset.id;

        if (target.classList.contains('edit-btn')) {
            // Open modal for editing
            modalTitle.textContent = 'Edit Car';
            carIdInput.value = carId;

            // Fetch current car data to populate the form
            try {
                const response = await fetch(`/api/cars/${carId}`);
                const car = await response.json();
                document.getElementById('make').value = car.make;
                document.getElementById('model').value = car.model;
                document.getElementById('year').value = car.year;
                modal.style.display = 'block';
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this car?')) {
                try {
                    const response = await fetch(`/api/cars/${carId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        await renderCars(); // Re-render the car list
                    } else {
                        alert('Failed to delete car.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred.');
                }
            }
        }
    });

    // Function to fetch and re-render the car list
    async function renderCars() {
        try {
            const response = await fetch('/api/cars');
            const cars = await response.json();
            carGrid.innerHTML = '';
            if (cars.length) {
                cars.forEach(car => {
                    const card = document.createElement('div');
                    card.classList.add('car-card');
                    card.dataset.id = car.id;
                    card.innerHTML = `
                        <img src="https://via.placeholder.com/250x150?text=Car" alt="Car Image">
                        <h3>${car.make} ${car.model}</h3>
                        <p>Year: ${car.year}</p>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    `;
                    carGrid.appendChild(card);
                });
            } else {
                carGrid.innerHTML = '<p>No cars available. Click \'Add New Car\' to get started!</p>';
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    }
});