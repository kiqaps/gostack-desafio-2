const express = require("express")
const cors = require("cors")
const { uuid } = require("uuidv4")

// const { uuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  if (!title || !url || !techs) {
    return response.status(422).json({ error: 'Request missing information' })
  }

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(newRepository)
  return response.status(201).json(newRepository)
})

app.put("/repositories/:id", (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  const { title, url, techs } = request.body
  if (title) repositories[repositoryIndex].title = title
  if (url) repositories[repositoryIndex].url = url
  if (techs) repositories[repositoryIndex].techs = techs
  return response.status(200).json(repositories[repositoryIndex])
})

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1
  return response.status(200).json(repositories[repositoryIndex])
})

module.exports = app
