import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowCountry from './components/ShowCountry'



const App = () => {
  const [countryInput, setCountryInput] = useState('')
  const [countryList, setCountryList] = useState([])
  const [showList, setShowList] = useState([])
  const [tooManyCountries, setTooManyCountries] = useState('')
  const [showSingular, setShowSingular] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const mapped_response = response.data.map(r => r.name.common)
        setCountryList(mapped_response)
    })
  }, [])

  const HandleSingularShow = ({showCountries}) => {
    setShowList([])
    axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${showCountries}`)
        .then(response => setShowSingular(response.data))
  }

  const ToggleFlag = (country) => {
    console.log(country)
    setShowList([])
    axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => setShowSingular(response.data))
  }

  const Countries = ({showCountries}) => {
    return(
      <>        {showCountries}      </>
    )
  }



  const handleInputChange = (event) => {
    setCountryInput(event.target.value)
    setTooManyCountries()
    setShowList([])
    setShowSingular(null)
    const filtered = countryList.filter(name => name.toLowerCase().includes(countryInput.toLowerCase()))

    if (filtered.length === 1) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filtered[0]}`)
        .then(response => setShowSingular(response.data))
    } else if (filtered.length < 10 ) {
      setShowList(filtered)
    } else {
      setTooManyCountries('Too many matches, specifiy another filter')
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

  return (
    <>
        <div>
          find countries 
          <form>  
            <input onChange={handleInputChange}/> 
          </form>
            {showList.map(country => <div key={country}><Countries showCountries={country} key={country+' '} /> <button onClick={() => ToggleFlag(country)} key={country}>show</button></div>)}
            {tooManyCountries}
            <ShowCountry country={showSingular}/>
        </div>
        <div></div>
    </>
  )
}

export default App
