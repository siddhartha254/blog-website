import './App.css';
import Header from './Header';
import Layout from './Layout';
import Post from './Post';
import {Routes, Route} from "react-router-dom";
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider } from './UserContext';
import Create from './pages/Create';
import Content from './pages/Content';
import Edit from './pages/Edit';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post/:id" element={<Content />} />
          <Route path="/edit/:id" element={<Edit />} />

        </Route>
      </Routes>
    </UserContextProvider>
    

    
    

  );
}

export default App;
