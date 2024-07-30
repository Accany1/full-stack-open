import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import numberService from './services/numbers'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState('')

  const hook = () => {
    numberService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }

  useEffect(hook,[])

  const addAll = (event) => {
    event.preventDefault()

    const allNames = persons.map(person => person.name)
    const allNumbers = persons.map(person => person.number)

    if (allNames.includes(newName) || allNumbers.includes(newNumber)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const id = (persons.find( n => n.name === newName)).id
        
        const newObject = {
          name: newName,
          number: newNumber,
        }
  
        numberService
          .replaceNum(id, newObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== response.id ? person: response)) 
          })
                
      }
    }

    else {
      const newObject = {
        name: newName,
        number: newNumber,
      }

      numberService
        .create(newObject)
        .then(response => {
          setPersons(persons.concat(response))
        })
    }
  }

  const deleteNumber = (id) => {
    if (window.confirm(`Delete ${(persons.find( n => n.id === id)).name} ?`)) {
      numberService
        .delNum(id)
      console.log ('deleted')
      setPersons(persons.filter(person => person.id !== id))
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
        <Persons filterToShow={filterToShow} deleteNumber={deleteNumber} /> 
      </div>
    </div>
  )
}

export default App