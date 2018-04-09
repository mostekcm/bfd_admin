import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import formatCurrency from 'format-currency';

export default class OrderStoreInfo extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  renderAddress(address, header) {
    address = address || 'No Address';
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

    return (
      <div className="address">
        { header ?
          <div className="address">
            {header}<br />
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
      </div>
    );
  }

  getContactName(store) {
    return store.contacts ? _.map(store.contacts, 'name').filter(attr => attr && attr.length > 0).join(' or ') :
      store.contact || 'No Contact';
  }

  getPhone(store) {
    return store.contacts ? _.map(store.contacts, 'phone').filter(attr => attr && attr.length > 0).join(' or ') : store.phone || 'No Phone';
  }

  getEmail(store) {
    return store.contacts ? _.map(store.contacts, 'email').filter(attr => attr && attr.length > 0).join(' or ') : store.email || 'No Email';
  }

  render() {
    const { store } = this.props;

    return (
      <div>
          { store ? <div className="address">
            {store.name}<br />
            Attn: {this.getContactName(store)}<br />
            {this.renderAddress(store.shippingAddress)}
            { store.billingAddress ? this.renderAddress(store.billingAddress, 'bill to: ') : '' }
            {this.getPhone(store)}<br />
            {this.getEmail(store)}
          </div> : <div></div> }
      </div>
    );
  }
};
