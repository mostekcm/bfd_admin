import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectContainer from 'redux-static';

import { orderActions } from '../../../actions';
import { OrderForm } from '../../../components/Orders';
import { Error, Confirm } from '../../../components/Dashboard';

import './CreateDialog.css';

export default connectContainer(class extends Component {
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
    getDictValue: PropTypes.func.isRequired,
    cancelCreateOrder: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orderCreate !== this.props.orderCreate || nextProps.cases !== this.props.cases;
  }

  onSubmit = (order) => {
    this.props.createOrder(order);
  }

  onConfirm = () => {
    this.refs.form.submit();
  }

  render() {
    const { error, loading, record } = this.props.orderCreate.toJS();
    const cases = this.props.cases.toJS();

    let initialValues = {};
    if (record) initialValues = JSON.parse(JSON.stringify(record));
    let index = 0;
    if (!initialValues.lineItems) initialValues.lineItems = [];
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

    connect(
      state => ({
        initialValues: initialValues,
      }),
    )(OrderForm);

    return (
      <Confirm title="Create Order" show={record !== null} loading={loading} onCancel={this.props.cancelCreateOrder} onConfirm={this.onConfirm} dialogClassName={'order-form'}>
        <Error message={error} />
        <OrderForm ref="form" cases={cases.records} initialValues={initialValues} onSubmit={this.onSubmit} getDictValue={this.props.getDictValue} loading={loading} />
      </Confirm>
    );
  }
});
