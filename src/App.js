import React from 'react';

import './App.css';
import RumbleTalk from './lib/RumbleTalk';


const hash = 'ykUIwC4J';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.rumbleTalkRef = React.createRef();
  }
  

  handleInputChange = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  login = () => {
    const { username, password } = this.state;
    this.rumbleTalkRef.current.login({
      hash,
      username,
      password,
      callback: (res) => {
        console.log('login callback', res);
        this.setState({username: '', password: ''});
      }
    });
  };

  logout = () => {
    this.rumbleTalkRef.current.logout({
      hash,
      username: this.state.username,
    });
  };

  logoutCB = () => {
    this.rumbleTalkRef.current.logoutCB({
      hash,
      username: this.state.username,
      callback: (reason) => console.log('logout callback', reason),
    });
  };

  openPrivateChat = () => {
    this.rumbleTalkRef.current.openPrivateChat({
      hash,
      username: this.state.username,
    });
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className='main'>
        <RumbleTalk
          floating
          hash={hash}
          width={700}
          height={500}
          counter='14:23'
          ref={this.rumbleTalkRef}
        />
        <div className='form'>
          <input
            type='text'
            placeholder='username'
            value={username}
            onChange={(e) => this.handleInputChange(e, 'username')}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => this.handleInputChange(e, 'password')}
          />
          <div className='buttons'>
            <button onClick={this.login}>Login</button>
            <button onClick={this.logout}>Logout</button>
            <button onClick={this.logoutCB}>LogoutCB</button>
            <button onClick={this.openPrivateChat}>Open Private Chat</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
