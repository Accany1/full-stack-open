const Notification = ({errorMessage, style}) => {
    if (errorMessage === null) {
        return null
      }
    
      return (
        <div className='error' style={style}>
          {errorMessage}
        </div>
      )
}

export default Notification