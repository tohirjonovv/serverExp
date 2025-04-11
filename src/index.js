const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());


const allowedClassnames = ["N-19", "N-20", "N-21"];
const allowedCoursenames = ["IT", "SMM", "QA"];

let students = [];
let idCounter = 1;


app.post("/students", (req, res) => {
  const { name, surname, classname, coursename } = req.body;

  if (!allowedClassnames.includes(classname)) {
    return res.status(400).json({ error: "Noto'g'ri classname." });
  }
  if (!allowedCoursenames.includes(coursename)) {
    return res.status(400).json({ error: "Noto'g'ri coursename." });
  }

  const newStudent = {
    id: idCounter++,
    name,
    surname,
    classname,
    coursename,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});


app.get("/students", (req, res) => {
  const { classname, coursename } = req.query;

  let result = [...students];

  if (classname) {
    result = result.filter((s) => s.classname === classname);
  }
  if (coursename) {
    result = result.filter((s) => s.coursename === coursename);
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  res.json(result);
});


app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student topilmadi." });
  }

  res.json(student);
});


app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: "Student topilmadi." });
  }

  const { name, surname, classname, coursename } = req.body;

  if (classname && !allowedClassnames.includes(classname)) {
    return res.status(400).json({ error: "Noto'g'ri classname." });
  }
  if (coursename && !allowedCoursenames.includes(coursename)) {
    return res.status(400).json({ error: "Noto'g'ri coursename." });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    name: name ?? students[studentIndex].name,
    surname: surname ?? students[studentIndex].surname,
    classname: classname ?? students[studentIndex].classname,
    coursename: coursename ?? students[studentIndex].coursename,
  };

  res.json(students[studentIndex]);
});


app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student topilmadi." });
  }

  const deleted = students.splice(index, 1);
  res.json(deleted[0]);
});


app.listen(port, () => {
  console.log("Server listening on 3000 port");
});