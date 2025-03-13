import './App.css';
import '../src/pages/Login' 
import Login from '../src/pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DataProject from './pages/DataProject';
import DataChecklist from './pages/DataChecklist';
import DataUser from './pages/DataUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/dataproject" Component={DataProject} />
        <Route path="/datachecklist" Component={DataChecklist} />
        <Route path="/datauser" Component={DataUser} />
      </Routes>
    </Router>
  );
}

export default App;
