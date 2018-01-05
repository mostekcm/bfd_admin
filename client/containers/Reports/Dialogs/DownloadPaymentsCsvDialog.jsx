import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { CSVLink } from 'react-csv';
import _ from 'lodash';

import { reportActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';

export default connectContainer(class extends Component {
  constructor(props) {
    super(props);
  }

  static stateToProps = (state) => ({
    paymentsReport: state.paymentsReport,
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    paymentsReport: PropTypes.object.isRequired,
    requestPaymentsForm: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.paymentsReport !== this.props.paymentsReport;
  }

  onConfirm = () => {
    this.props.requestPaymentsForm();
  };

  render() {
    const { error, loading, records } = this.props.paymentsReport.toJS();

    const payments = records === null ? records : _(records).map(record => _.map(record.payments,
      payment => ({
        date: moment.unix(payment.date).format('MM-DD-YYYY'),
        payee: record.store.name,
        paymentType: record.store.name.startsWith('Hy-Vee') || record.store.name.startsWith('Fresh and Natural') ? 'Check' : 'Square',
        amount: payment.amount
      }))).flatten().value();

    return (
      <Confirm title="Download CSV" show={payments !== null} loading={loading} onCancel={this.onConfirm}
               onConfirm={this.onConfirm} dialogClassName={'csv-download-form'}>
        <Error message={error}/>
        Found {payments && payments.length} orders:
        <CSVLink className='btn btn-success' data={payments || []}>Download CSV</CSVLink>
      </Confirm>
    );
  }
});
