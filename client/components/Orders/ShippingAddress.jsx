import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Address from './Address';

export default class ShippingAddress extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  getContactName(store) {
    return store.contacts ? _.map(store.contacts, 'name').filter(attr => attr && attr.length > 0).join(' or ') :
      store.contact || 'No Contact';
  }

  render() {
    const { store } = this.props;
    if (!store) return null;
    return <div className="address">
      {store.name}<br />
      Attn: {this.getContactName(store)}<br />
      <Address address={store.shippingAddress} />
    </div>
  }
};
