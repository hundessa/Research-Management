import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./User_Management/Login";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Login />} />
      </Routes>
      
      </BrowserRouter>
    </>
  );
}

export default App
