import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectContainer from 'redux-static';
import { formValueSelector } from 'redux-form';

import { orderActions } from '../../actions';
import { OrderForm } from '../../components/Orders';
import { Error, Confirm } from '../../components/Dashboard';

import { initializeLineItems, initializeDisplayItems } from '../../utils/initializeOrder';

import './CreateDialog.css';

export default connectContainer(class extends Component {
  constructor() {
    super();

    this.form = undefined;
  }

  static stateToProps = (state) => ({
    orderCreate: state.orderCreate,
    cases: state.cases,
    displays: state.displays,
    stores: state.orders.get('stores').toJS()
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cases: PropTypes.object.isRequired,
    displays: PropTypes.object.isRequired,
    orderCreate: PropTypes.object.isRequired,
    createOrder: PropTypes.func.isRequired,
    cancelCreateOrder: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orderCreate !== this.props.orderCreate || nextProps.cases !== this.props.cases || nextProps.displays !== this.props.displays;
  }

  onSubmit = (order) => {
    const simpleOrder = JSON.parse(JSON.stringify(order));
    simpleOrder.lineItems = _.filter(simpleOrder.lineItems, (item) => item.quantity && item.quantity > 0);
    simpleOrder.displayItems = _.filter(simpleOrder.displayItems, (item) => item.quantity && item.quantity > 0);
    if (simpleOrder.existingStore) {
      simpleOrder.store = JSON.parse(simpleOrder.existingStore);
      delete simpleOrder.existingStore;
    }

    this.props.createOrder(simpleOrder);
  }

  onConfirm = () => {
    if (this.form) {
      try {
        this.form.submit();
      } catch(err) {
        console.error("error submitting order: ", e.message);
      }
    }
  }

  render() {
    const { error, loading, record } = this.props.orderCreate.toJS();
    const cases = this.props.cases.toJS().records;
    const displays = this.props.displays.toJS().records;
    const stores = this.props.stores;

    let initialValues = {};
    if (record) initialValues = JSON.parse(JSON.stringify(record));

    /* Default the show name and sales rep for now */
    initialValues.show = initialValues.show || { name: "House Account" };
    initialValues.salesRep = initialValues.salesRep || { name: "Max Bentley" };
    if (initialValues.store) {
      initialValues.existingStore = JSON.stringify(initialValues.store);
      initialValues.store = undefined;
    }

    initializeLineItems(initialValues, cases);
    initializeDisplayItems(initialValues, displays);

    const selector = formValueSelector('order'); // <-- same as form name

    const ConnectedOrderForm = connect(
      state => {
        const lineItems = selector(state, 'lineItems');
        const displayItems = selector(state, 'displayItems');
        const existingStore = selector(state, 'existingStore');
        return {
          initialValues: initialValues,
          lineItems,
          displayItems,
          existingStore
        }
      }, null, null, { withRef: true }
    )(OrderForm);

    return (
      <Confirm title="Create Order" show={record !== null} loading={loading} onCancel={this.props.cancelCreateOrder}
               onConfirm={this.onConfirm} dialogClassName={'order-form'}>
        <Error message={error}/>
        <ConnectedOrderForm
          ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
          stores={stores}
          cases={cases}
          displays={displays}
          onSubmit={this.onSubmit}
          loading={loading} />
      </Confirm>
    );
  }
});
