const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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
  response.json(contacts);
});

// Get by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

// Delete by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
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

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(contact);

  response.json(contact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
