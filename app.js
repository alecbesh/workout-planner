// Replace with your API Gateway Invoke URL
const API_BASE_URL = "https://qteiuereih.execute-api.us-east-2.amazonaws.com/dev";

// Object to store workouts grouped by day
const workoutsByDay = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

// Form submission handler
document.getElementById("workoutForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Capture user inputs
    const workoutName = document.getElementById("workoutName").value;
    const exerciseType = document.getElementById("exerciseType").value;
    const repsOrDuration = document.getElementById("repsOrDuration").value;
    const workoutDay = document.getElementById("workoutDay").value;

    // Create workout object
    const workout = {
        name: workoutName,
        type: exerciseType,
        duration: repsOrDuration,
        day: workoutDay
    };

    // Send workout to the API via POST request
    try {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workout)
        });

        if (response.ok) {
            console.log("Workout added successfully");
            await fetchWorkouts(); // Refresh workouts after adding
        } else {
            const errorText = await response.text();
            console.error("Failed to add workout:", errorText);
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during POST request:", error);
        alert("Failed to add workout. Please try again.");
    }

    // Clear the form
    document.getElementById("workoutForm").reset();
});

// Fetch workouts from the API and render them
async function fetchWorkouts() {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts`);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched workouts:", data);

            // Clear and rebuild workoutsByDay
            Object.keys(workoutsByDay).forEach(day => (workoutsByDay[day] = []));
            data.forEach(workout => {
                if (workoutsByDay[workout.day]) {
                    workoutsByDay[workout.day].push(workout);
                }
            });

            renderWorkouts();
        } else {
            const errorText = await response.text();
            console.error("Failed to fetch workouts:", errorText);
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during GET request:", error);
        alert("Failed to load workouts. Please try again.");
    }
}

// Render workouts grouped by day
function renderWorkouts() {
    const workoutItems = document.getElementById("workoutItems");
    workoutItems.innerHTML = ""; // Clear the current list

    // Loop through each day and render workouts
    for (const [day, workouts] of Object.entries(workoutsByDay)) {
        if (workouts.length > 0) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("workout-day");
            dayElement.innerHTML = `<h3>${day}</h3>`;
            
            workouts.forEach((workout) => {
                const workoutElement = document.createElement("div");
                workoutElement.classList.add("workout-item");
                workoutElement.innerHTML = `
                    <div>
                        <h4>${workout.name}</h4>
                        <p><strong>Type:</strong> ${workout.type}</p>
                        <p><strong>Reps/Duration:</strong> ${workout.duration}</p>
                    </div>
                `;
                dayElement.appendChild(workoutElement);
            });

            workoutItems.appendChild(dayElement);
        }
    }
}

// Initial fetch of workouts on page load
document.addEventListener("DOMContentLoaded", fetchWorkouts);
