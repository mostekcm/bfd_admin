import React, { PropTypes, Component } from 'react';

import { Field, FieldArray } from 'redux-form';

import { OrderFormTable } from './';

import createForm from '../../utils/createForm';

import {
  ComboField,
  InputText
} from '../Dashboard';

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

  renderSalesRep(validationErrors) {
    const name = 'salesRep.name';

    const options = [
      {
        text: 'Max Bentley',
        value: 'Max Bentley'
      },
      {
        text: 'Jes Mostek',
        value: 'Jes Mostek'
      }
    ];

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <ComboField options={options} name={name} label='Sales Rep' validationErrors={validationErrors} />
        </div>
      </div>
    );
  }

  renderShow(validationErrors) {
    const showOptions = [
      {
        text: 'January Expo',
        value: 'January Expo'
      },
      {
        text: 'March Expo',
        value: 'March Expo'
      }
    ];

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <ComboField options={showOptions} name='show.name' label='Show' validationErrors={validationErrors} />
        </div>
      </div>
    );
  }

  renderTextField(name, label, validationErrors) {
    const props = {
      fieldName: name,
      label: label,
      validationErrors: validationErrors
    };

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field name={name} component={InputText} props={props}/>
        </div>
      </div>
    );
  }

  render() {
    const validationErrors = {};

    return (
      <form className="create-order form-horizontal" style={{ marginTop: '30px' }}>
        <div className="row">
          {this.renderShow(validationErrors)}
        </div>
        <div className="row">
          {this.renderSalesRep(validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('store.name', 'Store Name', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('store.shippingAddress', 'Store Shipping Address', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('store.billingAddress', 'Store Billing Address', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('store.contact', 'Store Contact', validationErrors)}
          {this.renderTextField('store.phone', 'Store Phone', validationErrors)}
          {this.renderTextField('store.email', 'Store Email', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('notes', 'Notes', validationErrors)}
        </div>
        <div className="row">
          <div className="col-xs-12">
            <FieldArray name='lineItems' component={OrderFormTable}
                        props={ { loading: this.props.loading, lineItems: this.props.lineItems } }/>
          </div>
        </div>
      </form>
    );
  }
});
