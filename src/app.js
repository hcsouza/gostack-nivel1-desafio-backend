const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
      id: uuid(),
      title, 
      url,
      techs,
      likes: 0,
  }
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", repositoryExistsMiddleware, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;
  const foundIndex  = getRepositoryIndex(id);

  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[foundIndex].likes,
  }

  repositories[foundIndex] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete("/repositories/:id", repositoryExistsMiddleware, (request, response) => {
  const { id } = request.params;
  const foundIndex = getRepositoryIndex(id);

  repositories.splice(foundIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExistsMiddleware, (request, response) => {
  const { id } = request.params;
  const foundIndex = getRepositoryIndex(id);

  repositories[foundIndex].likes++; 
  return response.json(repositories[foundIndex]);
});

function getRepositoryIndex(id) {
  return repositories.findIndex( searchedRepository => 
    searchedRepository.id === id
  );
}

function repositoryExistsMiddleware(request, response, next) {
  const foundIndex = getRepositoryIndex(request.params.id); 

  if(foundIndex < 0) {
    return response.status(400).json({error: "Repository not found!"});
  }
  next();
}

module.exports = app;
