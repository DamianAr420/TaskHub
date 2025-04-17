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
            const { name, description } = req.body;
            const userId = req.user?.id;
    
            if (!name) {
                return res.status(400).json({ error: "Nazwa projektu jest wymagana" });
            }
    
            const now = new Date();

            const project = new Project({
                name,
                description,
                columns: [],
                members: [userId],
                createdBy: userId,
                createdAt: new Date(now.setHours(0, 0, 0, 0)),
                updatedAt: new Date()
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
            })
            .populate('members', 'login')
            .populate('createdBy', 'login firstName lastName');
            res.status(200).json({ projects });
        } catch (err) {
            console.error("Błąd pobierania projektów:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async getProject(req, res) {
        const { projectId } = req.params;

        try {
            const project = await Project.findById(projectId)
            .populate('createdBy', 'login firstName lastName')
            .populate('members', 'login firstName lastName');

            if (!project) {
            return res.status(404).json({ message: 'Projekt nie istnieje.' });
            }

            if (!project.members.some(member => member._id.equals(req.user.id))) {
              return res.status(403).json({ message: 'Brak dostępu do tego projektu.' });
            }

            res.status(200).json({ project });
        } catch (err) {
            console.error('❌ Błąd przy pobieraniu projektu:', err);
            res.status(500).json({ message: 'Wewnętrzny błąd serwera.' });
        }
    }

    async refreshToken(req, res) {
        try {
            const user = req.user;
        
            const newToken = jwt.sign(
              { id: user.id, login: user.login },
              process.env.JWT_SECRET,
              { expiresIn: '15m' }
            );
        
            res.status(200).json({ token: newToken });
          } catch (err) {
            console.error("Błąd odświeżania tokena:", err);
            res.status(500).json({ error: 'Nie udało się odświeżyć tokena' });
          }
    }

    async createGroup(req, res) {
        const { projectId } = req.params;
        const { name, userId } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nazwa grupy jest wymagana' });
        }

        try {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Projekt nie istnieje' });
            }

            const newGroup = {
                name,
                createdBy: userId,
                createdAt: new Date().setHours(0, 0, 0, 0),
                updatedAt: new Date(),
                columns: [],
                settings: [],
                logs: [{
                    action: 'Utworzenie grupy',
                    by: userId,
                    date: new Date()
                }]
            };

            project.groups.push(newGroup);
            project.updatedAt = new Date();

            await project.save();

            res.status(201).json({ message: 'Grupa dodana', group: newGroup });
        } catch (error) {
                console.error('Błąd dodawania grupy:', error);
                res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
        }
    }

    async createColumn(req, res) {
        try {
          const { projectId, groupId } = req.params;
          const { name } = req.body;
          const userId = req.user.id;
    
          if (!name) {
            return res.status(400).json({ error: "Nazwa kolumny jest wymagana" });
          }
    
          const project = await Project.findById(projectId);
          if (!project) {
            return res.status(404).json({ error: "Projekt nie znaleziony" });
          }
    
          const group = project.groups.id(groupId);
          if (!group) {
            return res.status(404).json({ error: "Grupa nie istnieje" });
          }
    
          const newColumn = {
            name,
            tasks: [],
          };
          group.columns.push(newColumn);
    
          group.updatedAt = new Date();
          project.updatedAt = new Date();
    
          await project.save();
    
          const created = group.columns[group.columns.length - 1];
          res.status(201).json({ message: "Kolumna dodana", column: created });
        } catch (err) {
          console.error("Błąd tworzenia kolumny:", err);
          res.status(500).json({ error: "Błąd serwera" });
        }
      }

      async createTask(req, res) {
        try {
          const { projectId, groupId, columnId } = req.params;
          const { title, description, assignedTo } = req.body;
    
          if (!title) {
            return res.status(400).json({ error: "Tytuł zadania jest wymagany" });
          }
    
          const project = await Project.findById(projectId);
          if (!project) {
            return res.status(404).json({ error: "Projekt nie znaleziony" });
          }
    
          const group = project.groups.id(groupId);
          if (!group) {
            return res.status(404).json({ error: "Grupa nie istnieje" });
          }
    
          const column = group.columns.id(columnId);
          if (!column) {
            return res.status(404).json({ error: "Kolumna nie istnieje" });
          }
    
          const newTask = {
            title,
            description: description || "",
            assignedTo: assignedTo || null,
            createdAt: new Date()
          };
    
          column.tasks.push(newTask);
    
          group.updatedAt = new Date();
          project.updatedAt = new Date();
    
          await project.save();
    
          const created = column.tasks[column.tasks.length - 1];
          res.status(201).json({ message: "Zadanie dodane", task: created });
        } catch (err) {
          console.error("Błąd tworzenia zadania:", err);
          res.status(500).json({ error: "Błąd serwera" });
        }
      }

}

module.exports = new Actions();
