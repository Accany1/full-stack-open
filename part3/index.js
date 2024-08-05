require('dotenv').config()

const express = require('express')
const app = express()

const Number = require('./model/phoneNumber')

const morgan = require('morgan')

const cors = require('cors')


morgan.token('result', (req,res) => {
    return (
        JSON.stringify(req.body)
    )
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :result'))
app.use(express.static('dist'))

app.use(express.json())
app.use(cors())


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

app.get('/api/persons/:id', (request, response, next) => {
    Number.findById(request.params.id)
        .then(number => {
        if (number) {
            response.json(number)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
    
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

app.delete('/api/persons/:id', (request, response, next) => {
    Number.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

    const personUpdate = {
        name:body.name,
        number:body.number,
    }

    Number.find({name:body.name})
        .then(result => {
        if (result.length === 0 ) {
            person.save().then(savedPerson => {
                response.json(savedPerson)
            })
        } else {
            console.log(String(result[0].id))
            Number.findByIdAndUpdate(result[0].id, personUpdate, {new: true})
                .then(updatedNum => {
                response.json(updatedNum)
                })
                .catch(error => next(error)) 
        }
        })
        .catch(error => next(error)) 
})

// Wrong url message
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  // Wrong/nonexistant id error
const errorHandler = (error, request, response, next) => {
console.error(error.message)

if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
} 

next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)