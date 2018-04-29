import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Address extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    header: PropTypes.string
  };

  render() {
    const address = this.props.address || 'No Address';
    let parts = address.split(',');
    let postalCode = undefined;
    let state = undefined;
    let city = undefined;
    if (parts.length >= 2) {
      const lastLine = parts.pop().trim();
      city = parts.pop().trim();
      const stateZipParts = lastLine.split(' ');
      state = stateZipParts.shift();
      postalCode = stateZipParts.join('');
    }

    return     <div className="address">
      { this.props.header ?
        <div className="address">
          {this.props.header}<br />
        </div> : '' }
      {
        state ? <div className="address">
          { parts.map(part => {
            return <div className="address">{part}<br /></div>;
          })
          }
          {city}, {state} &nbsp;{postalCode}<br />
        </div> : <div className="address">{address}<br /></div>
      }<br />
    </div>;
  }
};
