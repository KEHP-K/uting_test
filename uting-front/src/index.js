import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "./firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'styled-components';
import { 
  MeetingProvider,
  lightTheme,
} from 'amazon-chime-sdk-component-library-react';

console.log(firebase)
ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <App />
      </MeetingProvider>
      </ThemeProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
