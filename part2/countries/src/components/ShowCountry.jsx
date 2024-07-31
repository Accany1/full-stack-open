const ShowCountry = ({country}) => {
    if (country === null) {
        return null
    }

    const name = country.name.common
    const capital = country.capital[0]
    const area = country.area
    const languages = Object.values(country.languages)
    const image = country.flags.png

    const LanguageList = ({language}) => {
        console.log(language)
        return (
            <li>{language}</li>
        )
    }

    return(
        <div>
            <h1>{name}</h1>
            <div>capital {capital}</div>
            <div>area {area}</div>
            <h3>languages:</h3>
            {languages.map(language => <LanguageList language={language} key={language}/> )}
            <img src={image} />
        </div>
    )
}

export default ShowCountry