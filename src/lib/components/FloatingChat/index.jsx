import React from 'react';
import PropTypes from 'prop-types';

import './style.css';
import Iframe from './../Iframe';

const cdn = 'https://d1pfint8izqszg.cloudfront.net';

const FloatingChat = React.forwardRef(
  (
    {
      side,
      isMobile,
      openChat,
      toggleFloatingChat,
      chatBubble,
      image,
      onImageLoad,
      onIframeLoad,
      counter,
      counters,
      userCount,
      floatingChat,
      width,
      height,
      src,
    },
    ref
  ) => {
    return (
      <div
        className={`rumbletalk-floating rumbletalk-floating-${side}`}
        onClick={isMobile ? openChat : toggleFloatingChat}
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
          onLoad={onImageLoad}
        />

        {counter && (
          <div
            className='counter-div'
            style={{ top: `${counters.top}px`, left: `${counters.left}px` }}
          >
            {!isMobile && !userCount && (
              <img alt='loading' src={`${cdn}/images/toolbar/mini_wait.gif`} />
            )}
            {!isMobile && userCount}
          </div>
        )}

        {!isMobile && (
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
              onClick={(e) => toggleFloatingChat(e)}
            />

            <Iframe
              ref={ref}
              style={{ width, height }}
              src={src}
              onLoad={onIframeLoad}
            />
          </div>
        )}
      </div>
    );
  }
);

FloatingChat.propTypes = {
  side: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  openChat: PropTypes.func,
  toggleFloatingChat: PropTypes.func,
  chatBubble: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  image: PropTypes.string,
  onImageLoad: PropTypes.func,
  onIframeLoad: PropTypes.func.isRequired,
  counter: PropTypes.string,
  counters: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  userCount: PropTypes.string,
  floatingChat: PropTypes.shape({
    className: PropTypes.string,
    style: PropTypes.shape({
      overflow: PropTypes.string,
      bottom: PropTypes.string,
    }),
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string.isRequired,
};

export default FloatingChat;
