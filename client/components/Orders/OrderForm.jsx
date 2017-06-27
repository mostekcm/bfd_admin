import React, { PropTypes, Component } from 'react';

import { Field, FieldArray } from 'redux-form';

import { OrderFormLineItems, OrderFormDisplayItems } from './';

import createForm from '../../utils/createForm';

import {
  ComboField,
  InputText
} from '../Dashboard';

export default createForm('order', class OrderForm extends Component {
  static propTypes = {
    lineItems: PropTypes.array,
    displayItems: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    initialValues: PropTypes.object
  }

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
      },
      {
        text: 'Eric Wiltgen',
        value: 'Eric Wiltgen'
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
        text: 'House Account',
        value: 'House Account'
      },
      {
        text: 'On the Road',
        value: 'On the Road'
      },
      {
        text: 'January Expo',
        value: 'January Expo'
      },
      {
        text: 'March Expo',
        value: 'March Expo'
      },
      {
        text: 'April Expo',
        value: 'April Expo'
      },
      {
        text: 'June Expo',
        value: 'June Expo'
      },
      {
        text: 'August Expo',
        value: 'August Expo'
      },
      {
        text: 'October Expo',
        value: 'October Expo'
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
          {this.renderTextField('notesToCustomer', 'Notes to Store', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('internalNotes', 'Internal Notes', validationErrors)}
        </div>
        <div className="row">
          <h3>Products</h3>
          <div className="col-xs-12">
            <FieldArray name='lineItems' component={OrderFormLineItems}
                        props={ { loading: this.props.loading, lineItems: this.props.lineItems } }/>
          </div>
        </div>
        <div className="row">
          <h3>Displays</h3>
          <div className="col-xs-12">
            <FieldArray name='displayItems' component={OrderFormDisplayItems}
                        props={ { loading: this.props.loading, displayItems: this.props.displayItems } }/>
          </div>
        </div>
      </form>
    );
  }
});
