import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import formatCurrency from 'format-currency';
import { Button } from 'react-bootstrap';

import { reportActions } from '../../actions';

import { Error, LoadingPanel } from '../../components/Dashboard';
import {
  ReportOrderTotalsTable
} from '../../components/Reports';

export default connectContainer(class CommissionDueReport extends Component {
  static stateToProps = (state) => ({
    commissionDueReport: state.commissionDueReport,
    payCommissionsState: state.payCommissions
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    params: PropTypes.object,
    commissionDueReport: PropTypes.object,
    fetchCommissionDueReport: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.payCommissions = this.payCommissions.bind(this);
  }

  componentWillMount() {
    this.props.fetchCommissionDueReport(this.props.params.name);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.params.name !== this.props.params.name) this.props.fetchCommissionDueReport(nextProps.params.name);
    return nextProps.commissionDueReport !== this.props.commissionDueReport || nextProps.params.name !== this.props.params.name;
  }

  payCommissions() {
    this.props.payCommissions(this.props.params.name, this.commissionReports);
  }

  render() {
    const { error, records } = this.props.commissionDueReport.toJS();
    const loading = this.props.commissionDueReport.toJS().loading || this.props.payCommissionsState.toJS().loading;

    this.commissionReports = records || [];

    const opts = { format: '%s%v', symbol: '$' };

    let overallTotalBase = 0;
    let overallTotalCommissionDue = 0;

    this.commissionReports.forEach((commissionInfo) => {
      overallTotalBase += commissionInfo.totalCommissionBase;
      overallTotalCommissionDue += commissionInfo.totalCommissionDue;
    })

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Commission Report for {this.props.params.name}</h2>
            <div className="pull-right">
              <Button bsStyle="success" title="Pay Commissions" id="pay-commissions-button" onClick={this.payCommissions}>Pay Commissions</Button>
            </div>
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          {
            this.commissionReports.map((commissionInfo, index) => {
              return (
                <div className="row" key={index}>
                  <div className="col-xs-12">
                    <h2>{ commissionInfo.salesRep.name }</h2>
                  </div>
                  <div className="col-xs-12">
                    <h3>Orders</h3>
                  </div>
                  <div className="col-xs-12">
                    <ReportOrderTotalsTable orders={ commissionInfo.orders }/>
                  </div>
                  <div className="col-xs-12">
                    <h3>Totals</h3>
                  </div>
                  <div className="col-xs-12">
                    Total Commission Base: { formatCurrency(commissionInfo.totalCommissionBase, opts) }<br />
                    Total Owed: { formatCurrency(commissionInfo.totalCommissionDue, opts)}
                  </div>
                </div>
              );
            })
          }
          <div className="row">
            <div className="col-xs-12">
              <h3>Overall Totals</h3>
            </div>
            <div className="col-xs-12">
              Overall Total Commission Base: { formatCurrency(overallTotalBase, opts) }<br />
              Overall Total Owed: { formatCurrency(overallTotalCommissionDue, opts)}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );

  }
});
