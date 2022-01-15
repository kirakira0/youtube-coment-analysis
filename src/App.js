import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const initialValues = {url: ""}
  const [formValues, setFormValues] = useState(initialValues)

  const onSubmit = (e) =>
    alert(e.label)
    // console.log(e)

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to YouTube comment section analysis 
        </p>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <div className='container'>
        <form>
          <h1>URL Form</h1>
          <div className='ui-form'>
            <label>
              URL: <input type="text" url="url" placeholder='Video URL' value={formValues.url} />
            </label>
            <input type="submit" value="Submit" />
          </div>
        </form>

      </div>
      <footer>
        <p>footer</p>
      </footer>
    </div>
  );
}

export default App;
