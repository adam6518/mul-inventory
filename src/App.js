import './App.css';
import '../src/pages/Login' 
import Login from '../src/pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DataProject from './pages/DataProject';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/dataproject" Component={DataProject} />
      </Routes>
    </Router>
  );
}

export default App;
