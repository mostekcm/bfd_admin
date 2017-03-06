import React, { PropTypes, Component } from 'react';

import { OrderFormTable } from './';

import createForm from '../../utils/createForm';

export default createForm('order', class OrderForm extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    getDictValue: PropTypes.func,
  }

  static formFields = [
    'lineItems[].sku.product.name',
    'lineItems[].sku.size',
    'lineItems[].sku.variety',
    'lineItems[].description',
    'lineItems[].size',
    'lineItems[].cpu',
    'lineItems[].quantity',
    'lineItems[].testers'
  ];

  render() {

    return (
      <form className="create-order form-horizontal" style={{ marginTop: '30px' }}>
        <OrderFormTable fields={this.props.fields} loading={this.props.loading} />
      </form>
    );
  }
});
