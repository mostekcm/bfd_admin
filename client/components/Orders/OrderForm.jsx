import React, { PropTypes, Component } from 'react';

import { FieldArray } from 'redux-form';

import { OrderFormTable } from './';

import createForm from '../../utils/createForm';

export default createForm('order', class OrderForm extends Component {
  static propTypes = {
    lineItems: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    // fields: PropTypes.object.isRequired,
    initialValues: PropTypes.object
  }

  // static formFields = [
  //   'lineItems[].sku.product.name',
  //   'lineItems[].sku.size',
  //   'lineItems[].sku.variety',
  //   'lineItems[].description',
  //   'lineItems[].size',
  //   'lineItems[].cpu',
  //   'lineItems[].quantity',
  //   'lineItems[].testers'
  // ];
  //
  render() {

    console.log("Carlos, IV: ", this.props.initialValues);
    console.log("Carlos, fields: ", this.props.fields);
    console.log("Carlos, lineItems: ", this.props.lineItems);

    return (
      <form className="create-order form-horizontal" style={{ marginTop: '30px' }}>
        <FieldArray name='lineItems' component={OrderFormTable} props={ {loading: this.props.loading, lineItems: this.props.lineItems } } />
      </form>
    );
  }
});
