import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { reportActions } from '../../actions';

import DownloadCsvDialog from './Dialogs/DownloadPaymentsCsvDialog';
import PaymentForm from '../../components/Reports/PaymentForm';

export default connectContainer(class Payments extends Component {
  static stateToProps = (state) => ({
    paymentsReport: state.paymentsReport,
  });

  static actionsToProps = {
    ...reportActions
  };

  static propTypes = {
    paymentsReport: PropTypes.array,
    fetchPaymentsByDate: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.form = null;
  }

  componentWillMount() {
    this.props.requestPaymentsForm();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.paymentsReport !== this.props.paymentsReport;
  }

  openDownloadCsvDialog = (paymentFields) => {
    this.props.fetchPaymentsByDate(paymentFields.startDate);
  }

  onDownloadRequest() {
    if (this.form) {
      try {
        this.form.submit();
      } catch(err) {
        console.error("error submitting request for csv: ", err.message);
      }
    }
  }

  render() {
    const { loading, error, record } = this.props.paymentsReport.toJS();

    return (
      <div className="order">
        <div className="row">
          <div className="col-xs-12 order-table-content">
            <h1>Payments</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 order-table-content">
            <PaymentForm
              ref={formInstance => this.form = formInstance}
              onSubmit={this.openDownloadCsvDialog.bind(this)}/>
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" onClick={this.onDownloadRequest.bind(this)}>Download CSV</button>
        </div>
        <DownloadCsvDialog
          data={record}
          loading={loading}
          error={error}
        />
      </div>
    );

  }
});
