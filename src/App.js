import logo from './logo.svg';
import './POS.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import POS5 from './POS5';
import Finishing from './Finishing'


const App = () => {
 return (
  <BrowserRouter>
  <Finishing/>
  <Routes>
    <Route path='/POS5/:firebaseId' element={<POS5/>}/>
  </Routes>

  
  </BrowserRouter>
 );
};

export default App;
