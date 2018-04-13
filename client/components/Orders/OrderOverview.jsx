import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, OrdersTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';
import formatCurrency from 'format-currency';

export default class OrderOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    errorCases: React.PropTypes.object,
    errorCompanies: React.PropTypes.object,
    errorDisplays: React.PropTypes.object,
    orders: React.PropTypes.array.isRequired,
    query: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  render() {
    const { loading, error, orders, total, errorCases, errorCompanies, errorDisplays} = this.props;
    const opts = { format: '%s%v', symbol: '$' };

    let totalAccountsReceivable = {};

    orders.forEach(order => {
      if (!totalAccountsReceivable[order.dealStage])
        totalAccountsReceivable[order.dealStage] = 0;
      totalAccountsReceivable[order.dealStage] += order.totals.owed;
    });

    const dealPercent = {
      'Closed Won': 1.0,
      'Closed Lost': 0.0,
      'Approved': 0.9,
      'Pending Approval': 0.6,
      'Qualifying': 0.3
    };

    let overallEstimatedAR = 0;
    Object.keys(totalAccountsReceivable).forEach(key => {
      overallEstimatedAR += dealPercent[key] * totalAccountsReceivable[key];
    });

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorCases ? `Cases Error: ${errorCases}` : null } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorCompanies ? `Companies Error: ${errorCompanies}` : null } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorDisplays ? `Displays Error: ${errorDisplays}` : null } />
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onSearch={this.props.onSearch} query={this.props.query} enabled={!loading} />
          <div className="row">
            <div className="col-xs-12">
              <OrdersTable loading={loading} orders={orders} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              {Object.keys(totalAccountsReceivable).map((stage, index) => <div key={index}>Total Accounts Receivable ({stage}): {formatCurrency(totalAccountsReceivable[stage], opts)}<br/></div>)}
              Total Estimated Accounts Receivable: {formatCurrency(overallEstimatedAR, opts)}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
