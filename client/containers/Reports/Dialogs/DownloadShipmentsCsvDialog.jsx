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
    shipmentsReport: state.shipmentsReport,
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    shipmentsReport: PropTypes.object.isRequired,
    requestShipmentsForm: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.shipmentsReport !== this.props.shipmentsReport;
  }

  onConfirm = () => {
    this.props.requestShipmentsForm();
  };

  render() {
    const { error, loading, records } = this.props.shipmentsReport.toJS();

    const shipments = records === null ? records : _.map(records, record => ({
      date: moment.unix(record.shippedDate).format('MM-DD-YYYY'),
      payee: record.store.name,
      account: 'Assets:Accounts Receivable',
      show: `Income:Sales:Wholesale:${record.salesRep.name}:${record.show.name}`,
      amount: record.totals.total
    }));

    return (
      <Confirm title="Download CSV" show={shipments !== null} loading={loading} onCancel={this.onConfirm}
               onConfirm={this.onConfirm} dialogClassName={'csv-download-form'}>
        <Error message={error}/>
        Found {shipments && shipments.length} orders:
        <CSVLink className='btn btn-success' data={shipments || []}>Download CSV</CSVLink>
      </Confirm>
    );
  }
});
