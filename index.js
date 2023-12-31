const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());

const PORT = 3001;

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(":method :url :body"));

// app.use(
//   morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       JSON.stringify(res.body),
//     ].join(" ");
//   })
// );

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
  {
    id: 5,
    name: "Michael Green",
    number: "39-23-4566122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  } else if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  console.log(persons.includes(body.name));

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (10000 - 0 + 1)) + 0,
  };

  persons = persons.concat(person);

  response.json(person).status(200);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const currentTime = Date.now();
  const personsLength = persons.length;

  console.log("current time: ", currentTime);
  console.log("persons length: ", personsLength);

  response.send(
    `<p>Phonebook has info for ${personsLength} people</p><p>${new Date(
      currentTime
    )}</p>`
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
