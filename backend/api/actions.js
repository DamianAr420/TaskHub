const User = require('../db/models/user');
const Project = require('../db/models/project');
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
                { id: user._id, login: user.login },
                process.env.JWT_SECRET,
                { expiresIn: '15min' }
            );

            res.status(200).json({ message: "Zalogowano pomyślnie", token });
        } catch (err) {
            console.error("Błąd przy logowaniu:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async editProfile(req, res) {
        try {
            const userId = req.user.id;
            const { firstName, lastName, email, bio, sex } = req.body;
    
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: { firstName, lastName, email, bio }
                },
                { new: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ error: "Użytkownik nie znaleziony" });
            }
    
            res.status(200).json({ message: "Profil zaktualizowany", user: updatedUser });
        } catch (err) {
            console.error("Błąd przy edycji profilu:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select('-password');
    
            if (!user) {
                return res.status(404).json({ error: "Użytkownik nie znaleziony" });
            }
    
            res.status(200).json({ user });
        } catch (err) {
            console.error("Błąd przy pobieraniu profilu:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async createProject(req, res) {
        try {
            const { name, description, columns, members } = req.body;
            const userId = req.user?.id;
    
            const formattedColumns = columns.map(name => ({
                name,
                tasks: []
            }));
    
            const project = new Project({
                name,
                description,
                columns: formattedColumns,
                members,
                createdBy: userId
            });
    
            await project.save();
            res.status(201).json({ message: "Projekt utworzony", project });
        } catch (err) {
            console.error("Błąd tworzenia projektu:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }
    
    async addTask(req, res) {
        try {
            const { projectId } = req.params;
            const { columnName, title, description, assignedTo } = req.body;
    
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ error: "Projekt nie znaleziony" });
    
            const column = project.columns.find(col => col.name === columnName);
            if (!column) return res.status(404).json({ error: "Kolumna nie istnieje" });
    
            column.tasks.push({ title, description, assignedTo });
    
            await project.save();
            res.status(200).json({ message: "Task dodany", project });
        } catch (err) {
            console.error("Błąd dodawania taska:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }
    
    async moveTask(req, res) {
        try {
            const { projectId } = req.params;
            const { fromColumn, toColumn, taskId } = req.body;
    
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ error: "Projekt nie znaleziony" });
    
            const source = project.columns.find(c => c.name === fromColumn);
            const target = project.columns.find(c => c.name === toColumn);
            if (!source || !target) return res.status(404).json({ error: "Nie znaleziono kolumn" });
    
            const taskIndex = source.tasks.findIndex(t => t._id.toString() === taskId);
            if (taskIndex === -1) return res.status(404).json({ error: "Nie znaleziono taska" });
    
            const [task] = source.tasks.splice(taskIndex, 1);
            target.tasks.push(task);
    
            await project.save();
            res.status(200).json({ message: "Task przeniesiony", project });
        } catch (err) {
            console.error("Błąd przenoszenia taska:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }    

    async getUserProjects(req, res) {
        try {
            const userId = req.user.id;
            const projects = await Project.find({ 
                $or: [{ createdBy: userId }, { members: userId }]
            }).populate('members', 'login');

            res.status(200).json({ projects });
        } catch (err) {
            console.error("Błąd pobierania projektów:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }
    
}

module.exports = new Actions();
