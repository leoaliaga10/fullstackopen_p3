import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [textFind, setTextFind] = useState("");
  const [textMessage, setTextMessage] = useState(null);
  const [className, setClasName] = useState("success");
  //........... persons of server

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  //...........................
  const getNameById = (id) => persons.find((p) => p.id === id)?.name || null;

  const handleDeleteOf = async (id) => {
    if (window.confirm("Do you really want to delete?")) {
      try {
        await personsService.f_delete(id);
        setPersons(persons.filter((item) => item.id !== id));
      } catch (error) {
        setTextMessage(
          `Information of ${getNameById(
            id
          )} has already been removed from server`
        );
        setClasName("error");
        setTimeout(() => {
          setTextMessage(null);
        }, 15000);
      }
    }
  };

  const addName = (event) => {
    event.preventDefault();

    const getMaxId = () => {
      if (persons.length === 0) return null;
      return persons.reduce((max, p) => Math.max(max, Number(p.id)), 0);
    };

    const nameObject = {
      name: newName,
      number: newPhone,
      //id: `${getMaxId() + 1}`,
      // id: getMaxId() + 1,
    };

    const getIdByName = (name) =>
      persons.find((p) => p.name === name)?.id || null;

    const my_id = getIdByName(newName);
    //console.log(getIdByName(newName));
    //.................. find
    let pivot = false;
    persons.forEach(function (elemento, indice) {
      const repetead = elemento.name === newName ? true : false;
      repetead ? (pivot = true) : "";
    });
    pivot
      ? window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
        ? personsService.update(my_id, nameObject).then((returnedPerson) => {
            setPersons(
              persons.map((persona) =>
                persona.id !== my_id ? persona : returnedPerson
              )
            );
            setTextMessage(`Update ${newName}`);
            setTimeout(() => {
              setTextMessage(null);
            }, 3000);
          })
        : " "
      : personsService.create(nameObject).then((returnedName) => {
          setPersons(persons.concat(returnedName));
          setTextMessage(`Added ${newName}`);
          setTimeout(() => {
            setTextMessage(null);
          }, 3000);

          setNewName("");
        }); //setPersons(persons.concat(nameObject));
    //...................
    // setPersons(persons.concat(nameObject));
    setNewName("");
    setNewPhone("");
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };
  //...................... filtre
  function filtrarPorNombre(text) {
    const textoEnMinusculas = text.toLowerCase();
    return persons.filter((person) =>
      person.name.toLowerCase().includes(textoEnMinusculas)
    );
  }
  const resultadoFiltro = filtrarPorNombre(textFind);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={textMessage} className={className} />
      <Filter textFind={textFind} setTextFind={setTextFind} />
      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <ul>
        {resultadoFiltro.map((persona) => (
          <Persons
            key={persona.id}
            names={persona.name}
            phones={persona.number}
            handleDelete={() => handleDeleteOf(persona.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
