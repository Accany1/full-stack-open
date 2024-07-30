const Persons = ({filterToShow, deleteNumber}) => {   
    const NumPrint = ({name, number, id}) => {
        return (
        <div>
            {name} {number} <button onClick={() => deleteNumber(id)}>delete</button>
        </div>)
    }

    return (
        <div>
            {filterToShow.map(person => <NumPrint name={person.name} number={person.number} key={person.name} id={person.id}/>)}
        </div>
    )
}

export default Persons