import React from 'react';
import {BrowserRouter, Router, Route, Switch } from "react-router-dom";

// import IntroPage from './component/IntroPage'
import SignUp from './routes/SignUp'
import Intro from './routes/Intro'
import Main from './routes/Main'
import Room from './routes/Room'
import Admin from './routes/Admin'
import DeviceSetup from './pages/DeviceSetup'
import meetingConfig from './meetingConfig';
import { MeetingManager, MeetingProvider, useMeetingManager } from 'amazon-chime-sdk-component-library-react'
import { AppStateProvider } from './providers/AppStateProvider';
import { NavigationProvider } from './providers/NavigationProvider';

function App() {
  const meetingManager = new MeetingManager(meetingConfig);
  return (
    <div>
      <BrowserRouter>
        <AppStateProvider>
          <MeetingProvider meetingManager={meetingManager}>
            <NavigationProvider>
              <Switch>
                <Route exact path="/" component={Intro}></Route>
                <Route path="/signup" component={SignUp}></Route>
                <Route path="/main" component={Main}></Route>
                <Route path='/deviceSetup'>
                  <DeviceSetup />
                </Route>
                <Route path="/room/:id">
                  <Room />
                </Route>
                <Route path="/admin" component={Admin}></Route>
              </Switch>
            </NavigationProvider>
          </MeetingProvider>
        </AppStateProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
