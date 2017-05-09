import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { reportActions } from '../../actions';

import { Error, LoadingPanel } from '../../components/Dashboard';
import {
  ReportSkusTable, ReportDisplaysTable, ReportLabelTotalsTable, ReportLabelsToPrintTable, ReportOrdersTable
} from '../../components/Reports';

export default connectContainer(class MonthReport extends Component {
  static stateToProps = (state) => ({
    monthReport: state.monthReport,
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    monthReport: PropTypes.array,
    params: PropTypes.object,
    fetchMonthReport: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchMonthReport(this.props.params.month);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.monthReport !== this.props.monthReport;
  }

  render() {
    const { loading, error, record } = this.props.monthReport.toJS();

    return (
      <div className="order">
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <h1>{record.month}</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          <div className="row">
            <h2>Orders</h2>
            <div className="col-xs-12">
              <ReportOrdersTable orders={record.orders}/>
            </div>
          </div>
          <div className="row">
            <h2>Skus</h2>
            <div className="col-xs-12">
              <ReportSkusTable skus={record.skus}/>
            </div>
          </div>
          <div className="row">
            <h2>Displays</h2>
            <div className="col-xs-12">
              <ReportDisplaysTable displays={record.displays}/>
            </div>
          </div>
          <div className="row">
            <h2>Label to Buy</h2>
            <div className="col-xs-12">
              <ReportLabelTotalsTable labelTotals={record.labelTotals}/>
            </div>
          </div>
          <div className="row">
            <h2>Labels to Print</h2>
            <div className="col-xs-12">
              <ReportLabelsToPrintTable labelsToPrint={record.labelsToPrint}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );

  }
});
