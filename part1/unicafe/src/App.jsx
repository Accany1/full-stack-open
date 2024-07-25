import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticsLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
)

const Statistics = (props) => (
  <table>
    <tbody>
      <StatisticsLine text='good' value={props.good} />
      <StatisticsLine text='neutral' value={props.neutral} />
      <StatisticsLine text='bad' value={props.bad} />
      <StatisticsLine text='all' value={props.good+props.neutral+props.bad} />
      <StatisticsLine text='average' value={(props.good+props.neutral+props.bad)/3} />
      <StatisticsLine text='positive' value={(props.good/(props.neutral+props.bad+props.good))*100 + ' %'} />
      </tbody>
  </table>
)

const History = (props) => {
  if (props.allClicks === 0) {
    return(
      <div>No feedback given</div>
    )
  }
  return(
    <div>
      <Statistics good={props.good} neutral={props.neutral} bad={props.bad} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

  const setValueGood = (newValue) => {
    console.log('good' , newValue)
    setGood(newValue)
    setAll(1)
  }

  const setValueNeutral = (newValue) => {
    console.log('neutral' , newValue)
    setNeutral(newValue)
    setAll(1)
  }

  const setValueBad = (newValue) => {
    console.log('bad' , newValue)
    setBad(newValue)
    setAll(1)
  }
  

  return (
    <div>
      <h2>Give feedback</h2>
      <Button handleClick={() => setValueGood(good + 1)} text='good' />
      <Button handleClick={() => setValueNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setValueBad(bad + 1)} text='bad' />
      <h1>Statistics</h1>
      <History allClicks={allClicks} good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App