import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "../src/pages/Login";
import Login from "../src/pages/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DataProject from "./pages/DataProject";
import DataUser from "./pages/DataUser";
import Order from "./pages/Order";
import Riwayat from "./pages/Riwayat";
import Finansial from "./pages/Finansial";

function App() {
  const getUserRole = sessionStorage.getItem("userRole");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const ProtectedRoute = ({ children }) => {
    console.log(children);

    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  const renderApp = () => {
    console.log(getUserRole);
    console.log(isLoggedIn);

    if (getUserRole === "admin" && isLoggedIn) {
      return (
        <>
          <Route
            path="/"
            Component={Login}
            element={<Navigate to="/dataproject" replace />}
          />
          <Route path="/dataproject" Component={DataProject} />
          <Route path="/datauser" Component={DataUser} />
          <Route path="/order" Component={Order} />
          <Route path="/riwayat" Component={Riwayat} />
          <Route path="/finance" Component={Finansial} />
        </>
      );
    } else if (getUserRole === "user" && isLoggedIn) {
      return (
        <>
          <Route path="/dataproject" Component={DataProject} />
          <Route
            path="/datauser"
            Component={DataProject}
            element={() => {
              toast.error("Anda bukan admin");
              return <Navigate to="/dataproject" />;
            }}
          />
          <Route path="/order" Component={Order} />
        </>
      );
    } else {
      return (
        <>
          <Route path="/" Component={Login} element={<Navigate to="/" />} />
          <Route
            path="/dataproject"
            // Component={Login}
            element={
              <ProtectedRoute>
                <DataProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/datauser"
            // Component={Login}
            element={
              <ProtectedRoute>
                <DataUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            // Component={Login}
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riwayat"
            // Component={Login}
            element={
              <ProtectedRoute>
                <Riwayat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance"
            // Component={Login}
            element={
              <ProtectedRoute>
                <Riwayat />
              </ProtectedRoute>
            }
          />
        </>
      );
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dataproject" replace /> : <Login />
          }
        />
        {renderApp()}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        theme="colored"
      />
    </Router>
  );
}

export default App;
