const Persons = ({filterToShow}) => {   
    const NumPrint = ({name, number}) => {
        return (
        <div>
            {name} {number}
        </div>)
    }

    return (
        <div>
            {filterToShow.map(person => <NumPrint name={person.name} number={person.number} key={person.name}/>)}
        </div>
    )
}

export default Persons