import * as React from 'react';
// import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'


import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChatProvider } from './Context/ChatProvider.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <ChatProvider>

    <ChakraProvider>
      <App />
    </ChakraProvider>

  </ChatProvider>
)
