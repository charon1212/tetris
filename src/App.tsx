import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <button
          onClick={() => {
            console.log();
            window.myAPI.callSample({ name: 'test' });
          }}
        >
          Sample
        </button>
      </header>
    </div>
  );
}

export default App;
