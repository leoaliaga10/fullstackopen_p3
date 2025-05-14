import express from "express";
import morgan from "morgan";
import cors from "cors";
import People from "./models/people.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(requestLogger); //request.body es undefined!

//Custom token for the request body
morgan.token("body", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return ""; // No show the body for others methods GET, DELETE...
  }
});

// Usa el middleware morgan con un formato personalizado
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//let persons = [];

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

app.get("/api/persons/:id", (request, response, next) => {
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
  // const found = persons.find((element) => element.name === body.name);
  // if (found) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new People({
    name: body.name,
    number: body.number,
    id: generateId(),
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const id = request.params.id;
  const person = {
    name: body.name,
    number: body.number,
  };

  People.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint);
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
