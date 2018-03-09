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

    let totalAccountsReceivable = 0;

    orders.forEach(order => totalAccountsReceivable += order.totals.owed);

    const totalDue = formatCurrency(totalAccountsReceivable, opts);

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
              Total Accounts Receivable: {totalDue}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
