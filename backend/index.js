"use strict";

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

let categories = ["funnyJoke", "lameJoke"];

let funnyJoke = [
    {
        joke: "Dlaczego komputer poszedł do lekarza?",
        response: "Bo złapał wirusa!",
    },

    {
        joke: "Dlaczego komputer nie może być głodny?",
        response: "Bo ma pełen dysk!",
    },

    {
        joke: "Co mówi jeden bit do drugiego?",
        response: "„Trzymaj się, zaraz się przestawiamy!”",
    },
];

let lameJoke = [
    {
        joke: "Dlaczego programiści preferują noc?",
        response: "Bo w nocy jest mniej bugów do łapania!",
    },
    {
        joke: "Jak nazywa się bardzo szybki programista?",
        response: "Błyskawiczny kompilator!",
    },
];

app.get("/jokebook/categories", (req, res) => {
    res.json(categories);
});

app.get("/jokebook/joke/:category", (req, res) => {
    const category = req.params.category;

    if (!categories.includes(category)) return res.status(404).json({ error: `no jokes for category ${category}` });

    if (category === "funnyJoke") {
        const randomIndex = Math.floor(Math.random() * funnyJoke.length);
        return res.json(funnyJoke[randomIndex]);
    } else if (category === "lameJoke") {
        const randomIndex = Math.floor(Math.random() * lameJoke.length);
        return res.json(lameJoke[randomIndex]);
    }
    return res.status(500).json({ error: "internal server error" });
});

app.get("/jokebook/all/:category", (req, res) => {
    const category = req.params.category;

    if (!categories.includes(category)) {
        return res.status(404).json({ error: `no jokes for category ${category}` });
    }

    if (category === "funnyJoke") {
        return res.json(funnyJoke);
    } else if (category === "lameJoke") {
        return res.json(lameJoke);
    }

    return res.status(500).json({ error: "internal server error" });
});

app.post("/jokebook/joke/:category", express.json(), (req, res) => {
    const category = req.params.category;

    if (!categories.includes(category)) {
        return res.status(404).json({ error: `no jokes for category ${category}` });
    }

    const { joke, response } = req.body;

    if (category === "funnyJoke") {
        funnyJoke.push({ joke, response });
    } else if (category === "lameJoke") {
        lameJoke.push({ joke, response });
    }

    return res.status(201).json({ message: "joke added successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
