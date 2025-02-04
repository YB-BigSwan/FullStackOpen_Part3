require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

// Middleware init
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

// Logging init
morgan.token("body", (request) => JSON.stringify(request.body, null, 2));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Routes

// Home
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//Info
app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p> 
    <br/> 
    <p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

// Get all
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// Get by ID
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

// Delete by ID
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Create
app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// Update
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint " });
};
app.use(unknownEndpoint);

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Invalid or malformatted ID" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
