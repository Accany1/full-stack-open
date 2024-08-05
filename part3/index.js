require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Number = require('./model/phoneNumber')

morgan.token('result', (req,res) => {
    return (
        JSON.stringify(req.body)
    )
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :result'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Number.find({}).then(number => {
        response.json(number)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Number.findById(request.params.id).then(number => {
        response.json(number)
    })
    // const id = request.params.id
    // const person = persons.find(person => person.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

app.get('/info', (request, response) => {
    return (
        response.send(
            `Phonebook has info for ${persons.length} people
            <br/>
            ${new Date()}`
        )
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
          error:'content missing'
        }) 
    }

    const person = new Number({
        name:body.name,
        number:body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)