import express from "express";
import morgan from "morgan";
import cors from "cors";
import People from "./models/people.js";

const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

let persons = [];

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

app.get("/api/persons", (request, response) => {
  People.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  People.find({}).then((persons) => {
    const now = new Date();
    response.send(
      `<p>Phonebook has info ${persons.length} for people</p><br/>${now}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  //  const person = People.findById(id);

  People.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error)); // manejar errores como id mal formateado
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  People.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error)); // Maneja errores como IDs malformados
});

const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000);
  return maxId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("body", body);

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

  const person = new People({
    name: body.name,
    number: body.number,
    id: generateId(),
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
