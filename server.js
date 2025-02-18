const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Registrer en bruger
app.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Alle felter er påkrævede." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hashedPassword, role],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: "Fejl ved oprettelse af bruger." });
                }
                res.status(201).json({ message: "Bruger registreret!" });
            }
        );
    } catch {
        res.status(500).json({ message: "Serverfejl." });
    }
});

// Login en bruger
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Alle felter er påkrævede." });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).json({ message: "Databasefejl." });
        if (!user) return res.status(401).json({ message: "Brugeren findes ikke." });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: "Forkert adgangskode." });

        res.json({ message: "Login succesfuldt!", username: user.username, role: user.role });
    });
});

// Start server
app.listen(PORT, () => console.log(`Server kører på http://localhost:${PORT}`));

app.use(express.static("public"));
