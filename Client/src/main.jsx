import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { Provider } from 'react-redux';
import { appStore } from './app/store';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
        <ToastContainer
          position="top-center"
          limit={1}
          newestOnTop={false}
          autoClose={2000}
        />
        <App />
    </Provider>
  </StrictMode>
)
