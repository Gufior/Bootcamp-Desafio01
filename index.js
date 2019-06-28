const express = require("express");
const server = express();

// Problema quando utiliza Express (Precisa 'falar pra ele' ler do corpo da requisição um arquivo json)
server.use(express.json());
server.listen(3000);

let requestCount = 0;
const arrayProjects = [];

// Middleware Global
server.use((req, res, next) => {
  requestCount++;
  console.log(`Número de requisições: ${requestCount}`);
  return next(); // Next é para contiuar executando o código depois do Middleware
});

function checkProjectExists(req, res, next) {
  const project = arrayProjects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(400).json({ error: "Project not exists" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(arrayProjects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  arrayProjects.push(project);
  return res.json(arrayProjects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = arrayProjects.find(p => p.id === id);

  project.tasks.push(title);
  return res.json(arrayProjects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = arrayProjects.find(p => p.id === id);

  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = arrayProjects.findIndex(p => p.id === id);
  arrayProjects.splice(projectIndex, 1);
  //return res.json(arrayProjects);
  return res.send();
});
