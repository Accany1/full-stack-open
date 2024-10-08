import axios from "axios"
import { useState, useEffect } from "react"

const OPENWEATHERKEY = 'a2c005ab67b5259a2078f104b950551b'



const ShowCountry = ({country}) => {
    const name = country.name.common
    const capital = country.capital[0]
    const area = country.area
    const languages = Object.values(country.languages)
    const image = country.flags.png
    const lat = country.latlng[0]
    const long = country.latlng[1]
    const [weather, setWeather] = useState([])
    
    useEffect(() => {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${OPENWEATHERKEY}&units=metric`)
          .then(response => {
            setWeather(response.data)
        })
    },[country])

    

    const LanguageList = ({language}) => {
        return (
            <li>{language}</li>
        )
    }

    const Weather = ({weather}) => {
        if (weather.length !== 0) {
            return(
                <div>
                    <div>temperature {weather.main.temp} Celcius</div>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                    <div>wind {weather.wind.speed} m/s</div>
                </div>
            )
        } else {
            return(
            <>
            </>
            )
        }
    }

    console.log(weather)

    return(
        <div>
            <h1>{name}</h1>
            <div>capital {capital}</div>
            <div>area {area}</div>
            <h3>languages:</h3>
            {languages.map(language => <LanguageList language={language} key={language}/> )}
            <img src={image} />
            <h1>Weather in {name}</h1>
            <Weather weather={weather}/>
        </div>
    )
}

export default ShowCountry