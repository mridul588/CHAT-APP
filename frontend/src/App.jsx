
import { Route , Routes , BrowserRouter} from 'react-router-dom'


import { Homepage } from './pages/Homepage/Homepage'
import { Chatpage } from './pages/Chatpage/Chatpage'

import './App.css'
import Started from './pages/Started/Started'

function App() {

  return (
    <>
    <div className='App'>
    <BrowserRouter>
      <Routes>
          <Route path="/started" element={<Started/>}/>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatpage />} />
     </Routes>
     </BrowserRouter>
     </div>
     </>
  )
}

export default App
