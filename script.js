
const jokeBtn = document.getElementById("jokeBtn");
const jokeText = document.getElementById("jokeText");
const jokeDelivery = document.getElementById("jokeDelivery");
const jokeCategory = document.getElementById("jokeCategory");
const statusMessage = document.getElementById("statusMessage");

const themeBtn = document.getElementById("themeBtn");
const moodCards = document.querySelectorAll(".mood-card");

const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const shareBtn = document.getElementById("shareBtn");

const favoritesList = document.getElementById("favoritesList");

// Current joke
let currentJoke = null;
let selectedMood = "happy";

// Mood and JokeAPI category mapping
const moodCategories = {
    happy: "Pun",
    bored: "Misc",
    sad: "Any",
    curious: "Programming"
};

// Safely load saved favourites
function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem("favoriteJokes"));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

let favoriteJokes = loadFavorites();

// Display a joke
function displayJoke(data) {
    if (data.type === "single") {
        currentJoke = data.joke;
        jokeText.textContent = data.joke;
        jokeDelivery.textContent = "";
    } else {
        currentJoke = data.setup + "\n" + data.delivery;
        jokeText.textContent = data.setup;
        jokeDelivery.textContent = data.delivery;
    }
}

// Get joke from API
async function getJoke() {
    jokeBtn.disabled = true;
    jokeBtn.textContent = "Finding a joke... 😂";
    statusMessage.textContent = "";

    const category = moodCategories[selectedMood];

    const url =
        `https://v2.jokeapi.dev/joke/${category}?safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to connect to the joke service.");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error("No joke found. Please try again.");
        }

        displayJoke(data);

        const moodNames = {
            happy: "Happy Mood 😂",
            bored: "Bored Mood 😴",
            sad: "Cheer Up 💗",
            curious: "Curious Mood 🤓"
        };

        jokeCategory.textContent = moodNames[selectedMood];

    } catch (error) {
        jokeText.textContent = "Oops! Something went wrong.";
        jokeDelivery.textContent =
            "Please check your internet connection and try again.";
        statusMessage.textContent = error.message;
        currentJoke = null;
    } finally {
        jokeBtn.disabled = false;
        jokeBtn.textContent = "Tell Me Another Joke 😂";
    }
}

// Mood selection
moodCards.forEach(card => {
    card.addEventListener("click", () => {
        moodCards.forEach(item => item.classList.remove("active"));

        card.classList.add("active");

        selectedMood = card.dataset.mood;

        getJoke();
    });
});

// Generate another joke
jokeBtn.addEventListener("click", getJoke);

// Dark mode
function updateThemeButton() {
    if (document.body.classList.contains("dark-mode")) {
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
}

const savedTheme = localStorage.getItem("jokeBoxTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("jokeBoxTheme", isDark ? "dark" : "light");

    updateThemeButton();
});

// Copy joke
copyBtn.addEventListener("click", async () => {
    if (!currentJoke) {
        alert("Get a joke first!");
        return;
    }

    try {
        await navigator.clipboard.writeText(currentJoke);
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => {
            copyBtn.textContent = "📋 Copy";
        }, 1500);
    } catch {
        alert("Copy is not available. Try using Live Server.");
    }
});
        


// Initial setup

getJoke();
