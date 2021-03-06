import _ from 'lodash';
import React, { Component } from 'react';
import { Checkbox } from 'react-bootstrap';

import PropTypes from 'prop-types';

import { Field, FieldArray } from 'redux-form';
import { OrderFormLineItems, OrderFormDisplayItems } from './';
import OrderFormQuickAddButtons from './OrderFormQuickAddButtons';

import createForm from '../../utils/createForm';
import * as constants from '../../constants';

import {
  ComboField,
  InputDate,
  InputText
} from '../Dashboard';

import './OrderForm.css';

export default createForm('order', class OrderForm extends Component {
  static propTypes = {
    stores: PropTypes.array,
    packages: PropTypes.array,
    lineItems: PropTypes.array,
    displayItems: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    existingStore: PropTypes.string,
    initialValues: PropTypes.object,
    showShow: PropTypes.bool,
    showSalesRep: PropTypes.bool
  };

  constructor() {
    super();
    this.renderStoreFields.bind(this);
  }

  renderShipAsap() {
    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <div className={'form-group'}>
            <label htmlFor="shipAsap">Ship ASAP?</label>
            <Field component={'input'} type={'checkbox'} name={'shipAsap'}
                   props={{ className: 'checkbox' }}/>
          </div>
        </div>
      </div>
    );
  }

  renderTargetShipDate() {
    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field component={InputDate}
                 name={'targetShipDate'}
                 props={
                   {
                     fieldName: 'date', label:
                     'Target Ship Date'
                   }
                 }
          />
        </div>
      </div>
    );
  }

  renderSalesRep(validationErrors, show) {
    if (!show)
      return null;

    const name = 'salesRep.name';

    const options = constants.SALES_REP_LIST;

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <ComboField options={options} name={name} label='Sales Rep' validationErrors={validationErrors}/>
        </div>
      </div>
    );
  }

  renderShow(validationErrors, show) {
    if (!show)
      return null;

    const showOptions = constants.SHOW_LIST;

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <ComboField options={showOptions} name='show.name' label='Show' validationErrors={validationErrors}/>
        </div>
      </div>
    );
  }

  renderStoresField(stores, validationErrors) {
    const storeOptions = _.map(stores, store => ({ text: store.name, value: JSON.stringify(store) }));
    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <ComboField options={storeOptions} name='existingStore' label='Existing Store'
                      validationErrors={validationErrors}/>
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

  renderStoreFields(existingStore, validationErrors) {
    if (existingStore) {
      return null;
    }

    return (
      <div className="row">
        {this.renderTextField('store.name', 'Store Name', validationErrors)}
        {this.renderTextField('store.shippingAddress', 'Store Shipping Address', validationErrors)}
        {this.renderTextField('store.billingAddress', 'Store Billing Address', validationErrors)}
        {this.renderTextField('store.contact', 'Store Contact', validationErrors)}
        {this.renderTextField('store.phone', 'Store Phone', validationErrors)}
        {this.renderTextField('store.email', 'Store Email', validationErrors)}
      </div>);
  }

  render() {
    const validationErrors = {};

    const lineItems = this.props.lineItems || [];
    const displayItems = this.props.displayItems || [];

    return (
      <form className="create-order form-horizontal" style={{ marginTop: '30px' }}>
        <div className={"row"}>
          {this.renderShipAsap()}
        </div>
        <div className={"row"}>
          {this.renderTargetShipDate()}
        </div>
        <div className="row">
          {this.renderShow(validationErrors, this.props.showShow)}
        </div>
        <div className="row">
          {this.renderSalesRep(validationErrors, this.props.showSalesRep)}
        </div>
        <div className="row">
          {this.renderStoresField(this.props.stores, validationErrors)}
        </div>
        {this.renderStoreFields(this.props.existingStore, validationErrors)}
        <div className="row">
          {this.renderTextField('notesToCustomer', 'Notes to Store', validationErrors)}
        </div>
        <div className="row">
          {this.renderTextField('internalNotes', 'Internal  Notes', validationErrors)}
        </div>
        <div className={"row"}>
          <OrderFormQuickAddButtons change={this.props.change} lineItems={lineItems} packages={this.props.packages}/>
        </div>
        <div className="row">
          <h3>Products</h3>
          <div className="col-xs-12">
            <FieldArray name='lineItems' component={OrderFormLineItems}
                        props={{ loading: this.props.loading, lineItems: lineItems }}/>
          </div>
        </div>
        <div className="row">
          <h3>Displays</h3>
          <div className="col-xs-12">
            <FieldArray name='displayItems' component={OrderFormDisplayItems}
                        props={{ loading: this.props.loading, displayItems: displayItems }}/>
          </div>
        </div>
      </form>
    );
  }
});
