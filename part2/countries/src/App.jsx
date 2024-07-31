import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import ShowCountry from './components/ShowCountry'

const App = () => {
  const [countryInput, setCountryInput] = useState('')
  const [countryList, setCountryList] = useState([])
  const [showList, setShowList] = useState([])
  const [showSingular, setShowSingular] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const mapped_response = response.data.map(r => r.name.common)
        setCountryList(mapped_response)
    })
  }, [])



  const handleInputChange = (event) => {
    setCountryInput(event.target.value)
    const filtered = countryList.filter(name => name.toLowerCase().includes(countryInput.toLowerCase()))

    if (filtered.length === 0) {
      setShowList([])
      setShowSingular(null)
    } else if (filtered.length === 1) {
      setShowList([])
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filtered[0]}`)
        .then(response => setShowSingular(response.data))
    } else if (filtered.length < 10 ) {
      setShowList(filtered)
      setShowSingular(null)
    } else {
      setShowList([
        'Too many matches, specifiy another filter'
      ])
      setShowSingular(null)
    }
  }

  const onSearch = (event) => {
    setCountryInput(event.target.value)
    event.preventDefault()
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryInput}`)
      .then(response => {
        console.log(response)
      })
  }

  const Testing = () => {
    event.preventDefault()
    console.log(showSingular)
  }

  return (
    <>
        <div>
          find countries 
          <form> 
            <input onChange={handleInputChange}/> 
          </form>
            {showList.map(country => <Countries showCountries={country} key={country} />)}
            {/* <button onClick={Testing}> test</button> */}
            <ShowCountry country={showSingular}/>
        </div>
        <div></div>
    </>
  )
}

export default App
