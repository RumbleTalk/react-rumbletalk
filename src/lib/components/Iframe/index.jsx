import React from 'react';
import PropTypes from 'prop-types';

const Iframe = React.forwardRef(({ style, src, onLoad }, ref) => {
  return (
    <iframe
      title='iframe'
      frameBorder='0'
      allow='microphone; camera; fullscreen; autoplay'
      allowtransparency='true'
      ref={ref}
      style={{
        width: !!style && style.width ? `${style.width}px` : '100%',
        height: !!style && style.height ? `${style.height}px` : '100%',
      }}
      src={src}
      onLoad={onLoad}
    ></iframe>
  );
});

Iframe.propTypes = {
  src: PropTypes.string.isRequired,
  onLoad: PropTypes.func.isRequired,
  style: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default Iframe;
