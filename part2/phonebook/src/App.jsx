import { useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState('')

  const addAll = (event) => {
    event.preventDefault()

    const allNames = persons.map(person => person.name)
    const allNumbers = persons.map(person => person.number)

    if (allNames.includes(newName) || allNumbers.includes(newNumber)) {
      alert(`${newName} ${newNumber} is already added to phonebook`)
    }

    else {
      const newObject = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(newObject))
    }
  }
  
  let filterToShow = persons

  if (filtered.length > 0){
    filterToShow = persons.filter(person => person.name.toLowerCase().includes(filtered.toLowerCase()))
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFiltered(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addAll={addAll} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <div>
        <Persons filterToShow={filterToShow} /> 
      </div>
    </div>
  )
}

export default App