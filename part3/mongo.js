const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yuxuan3dart:${password}@cluster0.nmzgmwb.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String
})

const phoneNumber = mongoose.model('Number', phoneNumberSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  phoneNumber.find({}).then(result => {
    result.forEach(number => {
      console.log(`${number.name} ${number.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const inputNumber = new phoneNumber({
    name: process.argv[3],
    number: process.argv[4],
  })

  inputNumber.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}