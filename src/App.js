import React from 'react';
import RumbleTalk from './lib/RumbleTalk';

const hash = 'ykUIwC4J';
const username = 'admin';

const loginData = {
  hash,
  username,
  password: 'p@ssw0rd123',
  callback: res => {
    console.log('login response', res);
  }
};

const logoutData = {
  hash,
  username,
};

const logoutCBdata = {
  hash,
  username,
  callback: (reason) => {
    console.log('handleLogoutCB', reason);
  },
};

const App = () => {
  const rumbleTalkRef = React.useRef({});

  return (
    <div>
      <RumbleTalk
        // floating
        hash={hash}
        width={700}
        height={500}
        counter='14:23'
        rumbleTalkRef={rumbleTalkRef}
      />
      <button onClick={() => rumbleTalkRef.current.login(loginData)}>
        Login
      </button>
      <button onClick={() => rumbleTalkRef.current.logout(logoutData)}>
        Logout
      </button>
      <button onClick={() => rumbleTalkRef.current.logoutCB(logoutCBdata)}>
        LogoutCB
      </button>
    </div>
  );
};

export default App;
