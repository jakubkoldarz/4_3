const categoryButtons = document.getElementById("category-buttons");
const jokeDisplay = document.getElementById("joke-display");
const jokeText = document.getElementById("joke");
const responseText = document.getElementById("response");
const allJokesList = document.getElementById("jokes-list");
const addJokeForm = document.getElementById("add-joke-form");
const categorySelect = document.getElementById("category-select");

const API_URL = "http://localhost:3000/jokebook";

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        displayCategories(categories);
        populateCategorySelect(categories);
    } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
    }
}

function displayCategories(categories) {
    categoryButtons.innerHTML = "";
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category;
        button.addEventListener("click", () => {
            fetchRandomJoke(category);
            fetchAllJokes(category);
        });
        categoryButtons.appendChild(button);
    });
}

function populateCategorySelect(categories) {
    categorySelect.innerHTML = "";
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

async function fetchRandomJoke(category) {
    try {
        const response = await fetch(`${API_URL}/joke/${category}`);
        const joke = await response.json();
        displayJoke(joke);
    } catch (error) {
        console.error(`Błąd podczas pobierania żartu z kategorii ${category}:`, error);
        jokeText.textContent = "Nie udało się załadować żartu.";
        responseText.textContent = "";
    }
}

async function fetchAllJokes(category) {
    try {
        const response = await fetch(`${API_URL}/all/${category}`);
        const jokes = await response.json();
        displayAllJokes(jokes);
    } catch (error) {
        console.error(`Błąd podczas pobierania wszystkich żartów z kategorii ${category}:`, error);
        allJokesList.innerHTML = "<li>Nie udało się załadować listy żartów.</li>";
    }
}

function displayJoke(joke) {
    jokeText.textContent = joke.joke;
    responseText.textContent = joke.response;
}

function displayAllJokes(jokes) {
    allJokesList.innerHTML = "";
    jokes.forEach((joke) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${joke.joke} - ${joke.response}`;
        allJokesList.appendChild(listItem);
    });
}

addJokeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addJokeForm);
    const category = formData.get("category");
    const joke = formData.get("joke");
    const response = formData.get("response");

    try {
        const res = await fetch(`${API_URL}/joke/${category}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ joke, response }),
        });

        if (res.ok) {
            addJokeForm.reset();
            // Odśwież listę wszystkich żartów po dodaniu nowego
            const selectedCategory = categoryButtons.querySelector("button.active")?.textContent;
            if (selectedCategory) {
                fetchAllJokes(selectedCategory);
            }
        } else {
            console.error("Błąd podczas dodawania żartu:", await res.json());
        }
    } catch (error) {
        console.error("Błąd podczas dodawania żartu:", error);
    }
});

// Inicjalizacja
fetchCategories();
