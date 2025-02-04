require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

let contacts = require("./phonebook.json");

// Middleware init
app.use(express.json());

// Logging init
morgan.token("body", (request) => JSON.stringify(request.body, null, 2));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(cors());

app.use(express.static("dist"));

// Routes

// Home
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//Info
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${contacts.length} people</p> 
    <br/> 
    <p>${new Date()}</p>`
  );
});

// Get all
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Get by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(400).send({ error: "Invalid or malformed ID" });
    });
});

// Delete by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(400).send({ error: "Invalid or malformed ID" });
    });
});

// ID gen
const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((c) => Number(c.id))) : 0;

  return String(maxId + 1);
};

// Create
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  const isDuplicate = contacts.find((contact) => contact.name === body.name);
  if (isDuplicate) {
    return response.status(400).json({
      error: `${isDuplicate.name} already exists in the phonebook. Names must be unique.`,
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Update
app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  Person.findOne({ name }).then((existingPerson) => {
    if (existingPerson) {
      return Person.findByIdAndUpdate(existingPerson._id, { number }).then(
        (updatedPerson) => response.json(updatedPerson)
      );
    }
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
