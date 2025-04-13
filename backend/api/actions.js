const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Actions {

    async registration(req, res) {
        try {
            const { login, password, sex } = req.body;

            if (!login || !password || !sex) {
                return res.status(400).json({ error: "Wszystkie pola są wymagane" });
            }

            const existingUser = await User.findOne({ login });
            if (existingUser) {
                return res.status(400).json({ error: "Użytkownik już istnieje" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                login,
                password: hashedPassword,
                sex: sex
            });

            await newUser.save();
            res.status(201).json({ message: "Użytkownik utworzony", user: newUser });
        } catch (err) {
            console.error("Błąd przy tworzeniu użytkownika:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ error: "Login i hasło są wymagane" });
            }

            const user = await User.findOne({ login });
            if (!user) {
                return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
            }

            const token = jwt.sign(
                { id: user._id, login: user.login, sex: user.sex },
                process.env.JWT_SECRET,
                { expiresIn: '15min' }
            );

            res.status(200).json({ message: "Zalogowano pomyślnie", token });
        } catch (err) {
            console.error("Błąd przy logowaniu:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }
    
}

module.exports = new Actions();
