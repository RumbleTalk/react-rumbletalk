import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './RumbleTalk.css';

const protocol = 'https://';
const baseWebUrl = 'https://www.rumbletalk.com';
const serviceRelativeUrl = 'client/service.php?hash=';
const cdn = 'https://d1pfint8izqszg.cloudfront.net';
const postMessageEvents = {
  LOGOUT_CB: 'pm.1',
  LOGOUT_CB_RECEIVED: 'pm.2',
  LOGIN: 'pm.3',
  LOGIN_SUCCESS: 'pm.4',
  LOGIN_ALREADY_LOGGED_IN: 'pm.5',
  LOGOUT: 'pm.6',
};

class RumbleTalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counters: {
        top: 14,
        left: 23,
      },
      src: null,
      userCount: null,
      floatingChat: {
        className: 'out',
        style: {
          overflow: 'hidden',
          bottom: 'auto',
        },
      },
      chatBubble: {
        height: 'auto',
        width: 'auto',
      },
    };

    this.server = null;
    this.messageInterval = null;
    this.iframeRef = React.createRef();
    const ua = navigator.userAgent.toUpperCase();
    this.mobile =
      ua.indexOf('MOBILE') !== -1 ||
      ua.indexOf('ANDROID') !== -1 ||
      ua.indexOf('IOS') !== -1;
  }

  loadIframe = async () => {
    const { hash } = this.props;
    const res = await axios.get(`${baseWebUrl}/${serviceRelativeUrl}${hash}`);
    this.server = res.data.address;

    if (!this.mobile) {
      this.setState({
        src: `https://${this.server}/${hash}/#${window.location.href}`,
      });
    }
  };

  /**
   * add the event listeners based on the type and device
   */
  addListeners = () => {
    window.addEventListener('message', this.info, false);

    if (!this.mobile && this.props.floating) {
      window.addEventListener('keyup', this.escClose, false);
    }
  };

  /**
   * hides the chat when the "Esc" key is clicked
   * @param {KeyboardEvent} event - the initiating event
   */
  escClose = (event) => {
    if (event.key === 'Escape') {
      this.toggleFloatingChat(null, true);
    }
  };

  /**
   * handles postMessage requests
   * @param event - the event object
   */
  info = (event) => {
    if (isFinite(event.data)) {
      clearInterval(this.messageInterval);

      if (this.props.counter) {
        this.setState({ userCount: event.data.toString() });
      }
    } else if (typeof event.data === 'object') {
      if (event.data.reload) {
        this.reload();
      }
    }
  };

  /**
   * reloads the iframe (or parent page) in case of a server request
   */
  reload = async () => {
    try {
      const res = await axios.get(
        `${baseWebUrl}/${serviceRelativeUrl}${this.props.hash}}`
      );
      this.server = res.data.address;

      if (this.iframeRef.current instanceof HTMLIFrameElement) {
        this.setState({
          src: `${protocol}${this.server}/${this.hash}/#${window.location.href}`,
        });
      } else {
        this.iframeRef.current.location.href = this.server;
      }
    } catch (ignore) {}
  };

  iframeHasLoaded = () => {
    this.messageInterval = setInterval(this.query, 1000);
  };

  query = () => {
    try {
      let target;
      let origin;

      if (this.iframeRef.current.nativeElement instanceof HTMLIFrameElement) {
        target = this.iframeRef.current.contentWindow;
        origin = protocol + this.server;
      } else {
        target = this.iframeRef.current;
        origin = baseWebUrl;
      }

      target.postMessage('toolbar', origin);
    } catch (ignore) {}
  };

  toggleFloatingChat = (event, esc) => {
    if (event) {
      event.stopPropagation();
    }

    const { floatingChat } = this.state;

    if (floatingChat.className === 'out') {
      if (esc) {
        return;
      }

      floatingChat.className = 'in';
      floatingChat.style = { ...floatingChat, overflow: 'visible' };
    } else {
      floatingChat.className = 'out';
      floatingChat.style = { ...floatingChat, overflow: 'hidden' };
    }

    this.setState({ floatingChat });
  };

  /** attaches the open chat event to the given target */
  openChat = () => {
    const link = `${baseWebUrl}client/chat.php?${this.hash}/#${window.location.href}`;
    const iframe = this.iframeRef.current;
    let iframeInterval;

    if (iframe) {
      iframe.nativeElement.focus();
    } else {
      const tempIframe = window.open(link);
      iframeInterval = setInterval(() => {
        if (tempIframe.closed) {
          clearInterval(iframeInterval);
        }
      }, 100);
    }
  };

  handleImageLoad = (event) => {
    const { floatingChat, chatBubble } = this.state;
    chatBubble.height = event.target.height;
    chatBubble.width = event.target.width;
    floatingChat.style = {
      ...floatingChat.style,
      bottom: `${event.target.height}px`,
    };

    this.setState({ floatingChat, chatBubble });
  };

  login = (data) => {
    const message = {};

    /* handle username value */
    message.username = this.trim(data.username);
    if (!this.validateUsername(message.username)) {
      throw new Error('Error: invalid username in "login" function');
    }

    /* handle, if set, password value */
    if (data.password) {
      if (!this.validatePassword(data.password)) {
        throw new Error('Error: invalid password in "login" function');
      }
      message.password = data.password;
    }

    /* handle, if set, image URL */
    if (data.image) {
      if (!this.validateUrl(data.image)) {
        throw new Error('Error: invalid image in "login" function');
      }
      message.image = data.image;
    }

    message.type = postMessageEvents.LOGIN;
    message.hash = data.hash;
    message.forceLogin = data.forceLogin;

    /* keep sending the data to the chat until the chat responds */
    const intervalHandle = setInterval(() => {
      this.postMessage(message);
    }, 1000);

    window.addEventListener(
      'message',
      function handlePostMessage(event) {
        /* validates the origin to be from a chat */
        if (!this.validateChatOrigin(event.origin)) {
          console.log('Error: invalid origin in "login" function');
        }

        if (typeof event.data !== 'object') {
          console.log(
            `Error: invalid data received in RumbleTalk SDK: ${event.data}`
          );
        }

        /* different chat callback */
        if (event.data.hash !== data.hash) {
          throw new Error('Error: chat hash mismatch');
        }

        /* validate that the message is of a successful login of the specific chat */
        if (
          event.data.type === postMessageEvents.LOGIN_SUCCESS ||
          event.data.type === postMessageEvents.LOGIN_ALREADY_LOGGED_IN
        ) {
          clearInterval(intervalHandle);
          window.removeEventListener('message', handlePostMessage);

          data.callback({
            status: event.data.type,
            message:
              event.data.type === postMessageEvents.LOGIN_SUCCESS
                ? 'success'
                : 'already logged in',
          });
        }
      }.bind(this),
      false
    );
  };

  logout = (data) => {
    const message = {
      type: postMessageEvents.LOGOUT,
      hash: data.hash,
    };

    if (data.userId) {
      message.userId = data.userId;
    }

    if (data.username) {
      message.username = data.username;
    }

    this.postMessage(message);
  };

  logoutCB = (data) => {
    const intervalHandle = setInterval(() => {
      this.postMessage({ type: postMessageEvents.LOGOUT_CB });
    }, 1000);

    window.addEventListener(
      'message',
      (event) => {
        /* validates the origin to be from a chat */
        if (!this.validateChatOrigin(event.origin)) {
          return;
        }

        /* expecting an object */
        if (typeof event.data !== 'object') {
          return;
        }

        /* different chat callback */
        if (event.data.hash !== data.hash) {
          return;
        }

        /* callback registered */
        if (event.data.type === postMessageEvents.LOGOUT_CB_RECEIVED) {
          clearInterval(intervalHandle);
          return;
        }

        /* validate event type */
        if (event.data.type !== postMessageEvents.LOGOUT_CB) {
          return;
        }

        data.callback(event.data.reason);
      },
      false
    );
  };

  postMessage = (data) => {
    try {
      const target =
        this.iframeRef.current instanceof HTMLIFrameElement
          ? this.iframeRef.current.contentWindow
          : this.iframeRef.current;
      target.postMessage(data, `${protocol}${this.server}`);
    } catch (error) {
      console.log(error.name, error.message);
    }
  };

  trim = (str) => str.replace(/^\s+|\s+$/g, '');

  validateUsername = (username) =>
    !/^-?\d+$/.test(username) && username.length < 64;

  validatePassword = (password) => 0 < password.length && password.length < 51;

  validateUrl = (url) =>
    /(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
      url
    );

  /**
   * checks if the given origin is of a chat service
   * @param origin - the URL of the origin
   * returns boolean
   */
  validateChatOrigin = (origin) =>
    /^https:\/\/.+\.rumbletalk\.(net|com)(:4433)?$/.test(origin);

  componentDidMount() {
    const { floating, counter, rumbleTalkRef } = this.props;
    const { counters } = this.state;

    if (floating && counter) {
      const counterArr = counter.split(':');

      if (counterArr.length === 2) {
        const counterTop = Number(counterArr[0]);
        const counterLeft = Number(counterArr[1]);

        if (!isNaN(counterTop)) {
          counters.top = counterTop;
        }

        if (!isNaN(counterLeft)) {
          counters.left = counterLeft;
        }
      }
    }

    this.addListeners();
    rumbleTalkRef.current.login = this.login;
    rumbleTalkRef.current.logout = this.logout;
    rumbleTalkRef.current.logoutCB = this.logoutCB;
    this.setState({ counters }, this.loadIframe);
  }

  render() {
    const { width, height, floating, side, image, counter } = this.props;
    const { src, userCount, counters, floatingChat, chatBubble } = this.state;

    return floating ? (
      <div
        className={`rumbletalk-floating rumbletalk-floating-${side}`}
        onClick={this.mobile ? this.openChat : this.toggleFloatingChat}
        style={{
          width: `${chatBubble.width}px`,
          height: `${chatBubble.height}px`,
        }}
      >
        <img
          alt='Click to join the conversation'
          title='Click to join the conversation'
          src={image}
          className={side}
          onLoad={this.handleImageLoad}
        />

        {counter && (
          <div
            className='counter-div'
            style={{ top: `${counters.top}px`, left: `${counters.left}px` }}
          >
            {!this.mobile && !userCount && (
              <img alt='loading' src={`${cdn}/images/toolbar/mini_wait.gif`} />
            )}
            {!this.mobile && userCount}
          </div>
        )}

        {!this.mobile && (
          <div
            className={`chat-div chat-div-${floatingChat.className} chat-div-${side}`}
            style={floatingChat.style}
          >
            <img
              className='close-button'
              alt='close'
              src={`${cdn}/images/c.png`}
              style={{
                left: side === 'left' ? 'auto' : '-8px',
                right: side === 'right' ? 'auto' : '-8px',
              }}
              onClick={(e) => this.toggleFloatingChat(e)}
            />

            <iframe
              title='iframe'
              frameBorder='0'
              allow='microphone; camera'
              allowtransparency='true'
              ref={this.iframeRef}
              src={src}
              style={{ width: `${width}px`, height: `${height}px` }}
              onLoad={this.iframeHasLoaded}
            />
          </div>
        )}
      </div>
    ) : (
      <div
        className='rumbletalk-embed'
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <iframe
          title='iframe'
          frameBorder='0'
          allow='microphone; camera; fullscreen; autoplay'
          allowtransparency='true'
          ref={this.iframeRef}
          src={src}
          onLoad={this.iframeHasLoaded}
        ></iframe>
      </div>
    );
  }
}

RumbleTalk.propTypes = {
  hash: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  floating: PropTypes.bool,
  side: PropTypes.oneOf(['left', 'right']),
  image: PropTypes.string,
  counter: PropTypes.string,
  rumbleTalkRef: PropTypes.shape({
    current: PropTypes.shape({
      login: PropTypes.func,
      logout: PropTypes.func,
      logoutCB: PropTypes.func,
    }),
  }),
};

RumbleTalk.defaultProps = {
  width: 700,
  height: 500,
  floating: false,
  side: 'right',
  image: 'https://d1pfint8izqszg.cloudfront.net/images/toolbar/toolbar.png',
  rumbleTalkRef: { current: {} },
};

export default RumbleTalk;
