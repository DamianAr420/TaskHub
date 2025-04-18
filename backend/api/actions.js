// backend/api/actions.js
const User    = require('../db/models/user');
const Project = require('../db/models/project');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

class Actions {
  // Rejestracja
  async registration(req, res) {
    try {
      const { login, password, sex } = req.body;
      if (!login || !password || !sex) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
      }
      if (await User.findOne({ login })) {
        return res.status(400).json({ error: 'Użytkownik już istnieje' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ login, password: hashedPassword, sex });
      await newUser.save();
      res.status(201).json({ message: 'Użytkownik utworzony', user: newUser });
    } catch (err) {
      console.error('Błąd przy tworzeniu użytkownika:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Logowanie
  async login(req, res) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return res.status(400).json({ error: 'Login i hasło są wymagane' });
      }
      const user = await User.findOne({ login });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Nieprawidłowy login lub hasło' });
      }
      const token = jwt.sign(
        { id: user._id, login: user.login },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.status(200).json({ message: 'Zalogowano pomyślnie', token });
    } catch (err) {
      console.error('Błąd przy logowaniu:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Odświeżanie tokena
  async refreshToken(req, res) {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, login: user.login },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.status(200).json({ token });
    } catch (err) {
      console.error('Błąd odświeżania tokena:', err);
      res.status(500).json({ error: 'Nie udało się odświeżyć tokena' });
    }
  }

  // Edycja profilu
  async editProfile(req, res) {
    try {
      const userId = req.user.id;
      const { firstName, lastName, email, bio } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { firstName, lastName, email, bio } },
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
      res.status(200).json({ message: 'Profil zaktualizowany', user: updatedUser });
    } catch (err) {
      console.error('Błąd przy edycji profilu:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Pobranie profilu
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      if (!user)
        return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
      res.status(200).json({ user });
    } catch (err) {
      console.error('Błąd przy pobieraniu profilu:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Tworzenie projektu
  async createProject(req, res) {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;
      if (!name) {
        return res.status(400).json({ error: 'Nazwa projektu jest wymagana' });
      }
      const now = new Date();
      const project = new Project({
        name,
        description,
        groups: [],
        members: [userId],
        createdBy: userId,
        createdAt: new Date(now.setHours(0, 0, 0, 0)),
        updatedAt: new Date(),
      });
      await project.save();
      res.status(201).json({ message: 'Projekt utworzony', project });
    } catch (err) {
      console.error('Błąd tworzenia projektu:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Pobieranie projektów
  async getUserProjects(req, res) {
    try {
      const userId = req.user.id;
      const projects = await Project.find({
        $or: [{ createdBy: userId }, { members: userId }],
      })
        .populate('members', 'login')
        .populate('createdBy', 'login firstName lastName');
      res.status(200).json({ projects });
    } catch (err) {
      console.error('Błąd pobierania projektów:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Pobieranie projektu
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId)
        .populate('createdBy', 'login firstName lastName')
        .populate('members', 'login firstName lastName');
      if (!project)
        return res.status(404).json({ message: 'Projekt nie istnieje.' });
      if (!project.members.some((m) => m._id.equals(req.user.id))) {
        return res.status(403).json({ message: 'Brak dostępu.' });
      }
      res.status(200).json({ project });
    } catch (err) {
      console.error('Błąd przy pobieraniu projektu:', err);
      res.status(500).json({ message: 'Błąd serwera.' });
    }
  }

  // Tworzenie grupy
  async createGroup(req, res) {
    try {
      const { projectId } = req.params;
      const { name } = req.body;
      const userId = req.user.id;
      if (!name)
        return res.status(400).json({ error: 'Nazwa grupy jest wymagana' });
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ error: 'Brak projektu' });

      const newGroup = {
        name,
        createdBy: userId,
        createdAt: new Date().setHours(0,0,0,0),
        updatedAt: new Date(),
        columns: [],
        settings: [],
        logs: [{ action: 'Utworzenie grupy', by: userId, date: new Date() }],
      };
      project.groups.push(newGroup);
      project.updatedAt = new Date();
      await project.save();
      res.status(201).json({ message: 'Grupa dodana', group: newGroup });
    } catch (err) {
      console.error('Błąd dodawania grupy:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Tworzenie kolumny
  async createColumn(req, res) {
    try {
      const { projectId, groupId } = req.params;
      const { name } = req.body;
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ error: 'Brak projektu' });
      const group = project.groups.id(groupId);
      if (!group) return res.status(404).json({ error: 'Brak grupy' });

      group.columns.push({ name, tasks: [] });
      group.updatedAt = new Date();
      project.updatedAt = new Date();
      await project.save();

      const created = group.columns[group.columns.length - 1];
      res.status(201).json({ message: 'Kolumna dodana', column: created });
    } catch (err) {
      console.error('Błąd tworzenia kolumny:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Tworzenie zadania
  async createTask(req, res) {
    try {
      const { projectId, groupId, columnId } = req.params;
      const { title, description, assignedTo } = req.body;
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ error: 'Brak projektu' });
      const group = project.groups.id(groupId);
      if (!group) return res.status(404).json({ error: 'Brak grupy' });
      const column = group.columns.id(columnId);
      if (!column) return res.status(404).json({ error: 'Brak kolumny' });

      column.tasks.push({ title, description, assignedTo, createdAt: new Date() });
      group.updatedAt = new Date();
      project.updatedAt = new Date();
      await project.save();

      const created = column.tasks[column.tasks.length - 1];
      res.status(201).json({ message: 'Zadanie dodane', task: created });
    } catch (err) {
      console.error('Błąd tworzenia zadania:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Usuwanie grupy
  async deleteGroup(req, res) {
    try {
      const { projectId, groupId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projekt nie istnieje' });
      }

      project.groups = project.groups.filter(g => g._id.toString() !== groupId);
      project.updatedAt = new Date();
      await project.save();

      res.status(200).json({ message: 'Grupa usunięta', groupId });
    } catch (err) {
      console.error('Błąd usuwania grupy:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Usuwanie kolumny
  async deleteColumn(req, res) {
    try {
      const { projectId, groupId, columnId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projekt nie istnieje' });
      }

      const group = project.groups.id(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Grupa nie istnieje' });
      }

      group.columns = group.columns.filter(c => c._id.toString() !== columnId);
      group.updatedAt = new Date();
      project.updatedAt = new Date();
      await project.save();

      res.status(200).json({ message: 'Kolumna usunięta', columnId });
    } catch (err) {
      console.error('Błąd usuwania kolumny:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  // Usuwanie zadania
  async deleteTask(req, res) {
    try {
      const { projectId, groupId, columnId, taskId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projekt nie istnieje' });
      }

      const group = project.groups.id(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Grupa nie istnieje' });
      }

      const column = group.columns.id(columnId);
      if (!column) {
        return res.status(404).json({ error: 'Kolumna nie istnieje' });
      }

      column.tasks = column.tasks.filter(t => t._id.toString() !== taskId);
      group.updatedAt = new Date();
      project.updatedAt = new Date();
      await project.save();

      res.status(200).json({ message: 'Zadanie usunięte', taskId });
    } catch (err) {
      console.error('Błąd usuwania zadania:', err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }
}

module.exports = new Actions();
