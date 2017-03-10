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
    cases: state.cases
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cases: PropTypes.object.isRequired,
    orderCreate: PropTypes.object.isRequired,
    createOrder: PropTypes.func.isRequired,
    cancelCreateOrder: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orderCreate !== this.props.orderCreate || nextProps.cases !== this.props.cases;
  }

  onSubmit = (order) => {
    console.log("Carlos, creating an order: ", order);
    const simpleOrder = JSON.parse(JSON.stringify(order));
    simpleOrder.lineItems = _.filter(simpleOrder.lineItems, (item) => item.quantity && item.quantity > 0);
    // order.lineItems.forEach((item) => {
    //   if (item.quantity && item.quantity > 0)
    //     simpleOrder.lineItems.push({
    //       sku: {
    //         product: { name: item.sku.product.name },
    //         variety: item.sku.variety,
    //         size: item.sku.size
    //       },
    //       size: item.size,
    //       cpu: item.cpu,
    //       quantity: item.quantity,
    //       testers: item.testers
    //     })
    // });
    // simpleOrder.store = order.store;
    // simpleOrder.show = order.show;
    // simpleOrder.notes = order.notes;
    // simpleOrder.salesRep = order.salesRep;
    // simpleOrder.date = order.date;

    console.log("Carlos, simpleOrder: ", simpleOrder);
    this.props.createOrder(simpleOrder);
  }

  onConfirm = () => {
    console.log('Carlos, before submit');
    if (this.form) {
      this.form.submit()
        .then(() => console.log("Carlos, submitted successfully"))
        .catch(e => console.error("Carlos, error: ", e.message));
    }
  }

  render() {
    const { error, loading, record } = this.props.orderCreate.toJS();
    const cases = this.props.cases.toJS();

    let initialValues = {};
    if (record) initialValues = JSON.parse(JSON.stringify(record));

    /* Default the show name and sales rep for now */
    initialValues.show = initialValues.show || { name: "March Expo" };
    initialValues.salesRep = initialValues.salesRep || { name: "Max Bentley" };

    let index = 0;
    if (!initialValues.lineItems) initialValues.lineItems = [];

    /* Parse through the cases and add to the initial values */
    if (cases.records && cases.records.length > 0) cases.records.forEach((thisCase) => {
      (thisCase.sku.varieties.length > 0 ? thisCase.sku.varieties : ['']).forEach((variety) => {
        const varietyCase = JSON.parse(JSON.stringify(thisCase));
        varietyCase.sku.variety = variety;
        if (!initialValues.lineItems[index]) {
          initialValues.lineItems[index] = varietyCase;
        }
        ++index;
      });
    });

    const selector = formValueSelector('order'); // <-- same as form name

    const ConnectedOrderForm = connect(
      state => {
        const lineItems = selector(state, 'lineItems');
        return {
          initialValues: initialValues,
          lineItems
        }
      }, null, null, { withRef: true }
    )(OrderForm);

    return (
      <Confirm title="Create Order" show={record !== null} loading={loading} onCancel={this.props.cancelCreateOrder}
               onConfirm={this.onConfirm} dialogClassName={'order-form'}>
        <Error message={error}/>
        <ConnectedOrderForm ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
                            cases={cases.records} onSubmit={this.onSubmit} loading={loading}/>
      </Confirm>
    );
  }
});
