import { StrictMode } from 'react' /* catches basic bugs*/
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' /*main app component*/

createRoot(document.getElementById('root')).render( /* doc.getelemet is where it's going to inject the app and createroot....render is rendering it inside that div*/
  <StrictMode>
    <App />
  </StrictMode>, /*helps catch bug*/
)
