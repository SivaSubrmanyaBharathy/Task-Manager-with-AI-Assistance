import React from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
// import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        {/* <Route path='/login' element={<Login/>}/> */}
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
