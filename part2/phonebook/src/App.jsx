import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import numberService from './services/numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorStyle, setErrorStyle] = useState()

  const hook = () => {
    numberService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }

  useEffect(hook,[])

  const greenErrorStyle = {
    color: 'green',
    background: 'lightgray',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: '5',
    padding: '10',
    marginBottom: '10'}

  const redErrorStyle = {
    color: 'red',
    background: 'lightgray',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: '5',
    padding: '10',
    marginBottom: '10'}
  

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

      setErrorMessage(`Added ${newName}`)
      console.log(errorMessage)
      setErrorStyle(greenErrorStyle)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      
    }
  }

  const deleteNumber = (id) => {
    if (window.confirm(`Delete ${(persons.find( n => n.id === id)).name} ?`)) {
      numberService
        .delNum(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
        .catch(error => {
          setErrorMessage(`Information of ${(persons.find( n => n.id === id)).name} has already been removed from server`)
          setErrorStyle(redErrorStyle)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
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
      <Notification errorMessage={errorMessage} style={errorStyle}/>
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