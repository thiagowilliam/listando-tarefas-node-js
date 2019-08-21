const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: ["Nova Tarefa"]
  },

  {
    id: "2",
    title: "Projeto Qualquer",
    tasks: ["Lista de tarefas"]
  },

  {
    id: "3",
    title: "Desafio Node.js",
    tasks: ["Lista de tarefas"]
  }
];

let numberOfRequests = 0;

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", (req, res) => {
  const { id } = req.params;

  return res.json(projects[id]);
});

//Adicionando um novo Projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Adicionando uma nova tarefa
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(tasks);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3333);
