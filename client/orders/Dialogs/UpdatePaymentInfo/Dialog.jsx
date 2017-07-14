import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';

import { cancelUpdatePayments, updatePayments } from './actions';

import { Error, Confirm } from '../../../components/Dashboard';

import UpdatePaymentForm from '../../../components/Orders/UpdatePaymentForm';

import './Dialog.css';

export default connectContainer(class UpdatePaymentsDialog extends Component {
  static stateToProps = (state) => ({
    updateState: state.updatePayments
  });

  static actionsToProps = {
    cancelUpdate: cancelUpdatePayments,
    update: updatePayments
  };

  static propTypes = {
    cancelUpdate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateState: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.form = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateState !== this.props.updateState;
  }

  onSubmit = (paymentForm) => {
    const paymentsData = _(paymentForm.payments)
      .filter(payment => payment.amount && payment.amount > 0)
      .map((payment) => { return { date: payment.date.format('X'), amount: payment.amount } })
      .value();

    this.props.update(paymentForm.orderId, { payments: paymentsData });
  }

  onConfirm = () => {
    if (this.form) {
      this.form.submit()
        .catch(e => console.error("error payments update: ", e.message));
    }
  }

  render() {
    const { cancelUpdate } = this.props;
    const { orderId, totalCost, payments, error, requesting, loading } = this.props.updateState.toJS();

    const className = `form-horizontal col-xs-12 shipping-info-confirm-form`;

    const initialPayments = JSON.parse(JSON.stringify(payments)) || [];
    const initialValues = { orderId: orderId, payments: _.map(initialPayments, payment => { return { date: moment.unix(payment.date), amount: payment.amount }; }) };

    initialValues.payments.push({ date: moment() });

    const selector = formValueSelector('updatePaymentsForm'); // <-- same as form name

    const ConnectedUpdatePaymentForm = connect(
      state => {
        const payments = selector(state, 'payments');
        const orderId = selector(state, 'orderId');
        return {
          initialValues: initialValues,
          orderId,
          payments
        }
      }, null, null, { withRef: true }
    )(UpdatePaymentForm);

    return (
      <Confirm title={ `Update Order Payment Info` } show={requesting===true} loading={loading} onCancel={cancelUpdate} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Change the Payments for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <ConnectedUpdatePaymentForm
            ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
            totalCost={totalCost}
            onSubmit={this.onSubmit}
            loading={loading}
          />
        </div>
      </Confirm>
    );
  }
});

