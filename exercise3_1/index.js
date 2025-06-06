const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };

app.use(express.json());
// app.use(requestLogger);

//Custom token for the request body
morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return ""; // No show the body for others methods GET, DELETE...
  }
});

// Usa el middleware morgan con un formato personalizado
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//app.use(morgan("tiny")); // Use the middleware morgan with configuration 'tiny'

//exercise 3.1
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//exercise 3.2
app.get("/info", (request, response) => {
  const now = new Date();
  response.send(
    `<p>Phonebook has info ${
      persons.length
    } for people</p><br/>${now.toString()}`
  );
});

//exercise 3.3
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//exercise 3.4
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id != id);
  response.status(204).end();
});

//exercise 3.5
const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000);
  return maxId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  const found = persons.find((element) => element.name === body.name);
  if (found) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
