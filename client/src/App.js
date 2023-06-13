import './App.css';
import Header from './Header';
import Layout from './Layout';
import Post from './Post';
import {Routes, Route} from "react-router-dom";
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Route>
      </Routes>
    </UserContextProvider>
    

    // DONE TILL 40th MINUTE
    

  );
}

export default App;
