import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import formatCurrency from 'format-currency';

import { reportActions } from '../../actions';

import { Error, LoadingPanel } from '../../components/Dashboard';
import {
  ReportOrderTotalsTable
} from '../../components/Reports';

export default connectContainer(class CommissionDueReport extends Component {
  static stateToProps = (state) => ({
    commissionDueReport: state.commissionDueReport,
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    commissionDueReport: PropTypes.object,
    fetchCommissionDueReport: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchCommissionDueReport();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.commissionDueReport !== this.props.commissionDueReport;
  }

  render() {
    const { loading, error, records } = this.props.commissionDueReport.toJS();

    const commissionReports = records || [];

    const opts = { format: '%s%v', symbol: '$' };

    return (
      <div className="order">
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          {
            commissionReports.map((commissionInfo, index) => {
              return (
                <div className="row" index={index}>
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
        </LoadingPanel>
      </div>
    );

  }
});
