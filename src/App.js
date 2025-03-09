import './App.css';
import '../src/pages/Login' 
import Login from '../src/pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
      </Routes>
    </Router>
  );
}

export default App;
