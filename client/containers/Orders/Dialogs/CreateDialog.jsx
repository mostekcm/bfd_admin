import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectContainer from 'redux-static';
import { formValueSelector } from 'redux-form';

import { orderActions } from '../../../actions';
import { OrderForm } from '../../../components/Orders';
import { Error, Confirm } from '../../../components/Dashboard';

import './CreateDialog.css';

export default connectContainer(class extends Component {
  constructor() {
    super();

    this.form = undefined;
  }

  static stateToProps = (state) => ({
    orderCreate: state.orderCreate,
    cases: state.cases,
    displays: state.displays
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

    this.props.createOrder(simpleOrder);
  }

  onConfirm = () => {
    if (this.form) {
      this.form.submit()
        .then(() => console.log("Carlos, submitted successfully"))
        .catch(e => console.error("Carlos, error: ", e.message));
    }
  }

  initializeLineItems(initialValues, cases) {
    let index = 0;
    if (!initialValues.lineItems) initialValues.lineItems = [];

    /* Parse through the cases and add to the initial values */
    if (cases && cases.length > 0) cases.forEach((thisCase) => {
      (thisCase.sku.varieties.length > 0 ? thisCase.sku.varieties : ['']).forEach((variety) => {
        const varietyCase = JSON.parse(JSON.stringify(thisCase));
        varietyCase.sku.variety = variety;
        if (!initialValues.lineItems[index]) {
          initialValues.lineItems[index] = varietyCase;
        }
        ++index;
      });
    });
  }

  initializeDisplayItems(initialValues, displays) {
    if (!initialValues.displayItems || initialValues.displayItems.length == 0) {
      initialValues.displayItems = [];

      /* Parse through the cases and add to the initial values */
      if (displays && displays.length > 0) displays.forEach((thisDisplay) => {
        initialValues.displayItems.push(thisDisplay);
      });
    }
  }

  render() {
    const { error, loading, record } = this.props.orderCreate.toJS();
    const cases = this.props.cases.toJS().records;
    const displays = this.props.displays.toJS().records;

    let initialValues = {};
    if (record) initialValues = JSON.parse(JSON.stringify(record));

    /* Default the show name and sales rep for now */
    initialValues.show = initialValues.show || { name: "House Account" };
    initialValues.salesRep = initialValues.salesRep || { name: "Max Bentley" };

    this.initializeLineItems(initialValues, cases);
    this.initializeDisplayItems(initialValues, displays);

    const selector = formValueSelector('order'); // <-- same as form name

    const ConnectedOrderForm = connect(
      state => {
        const lineItems = selector(state, 'lineItems');
        const displayItems = selector(state, 'displayItems');
        return {
          initialValues: initialValues,
          lineItems,
          displayItems
        }
      }, null, null, { withRef: true }
    )(OrderForm);

    return (
      <Confirm title="Create Order" show={record !== null} loading={loading} onCancel={this.props.cancelCreateOrder}
               onConfirm={this.onConfirm} dialogClassName={'order-form'}>
        <Error message={error}/>
        <ConnectedOrderForm ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
                            cases={cases} displays={displays} onSubmit={this.onSubmit} loading={loading} />
      </Confirm>
    );
  }
});
