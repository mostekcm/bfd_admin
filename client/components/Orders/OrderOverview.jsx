import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, OrdersTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';

export default class OrderOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    errorCases: React.PropTypes.object,
    errorDisplays: React.PropTypes.object,
    orders: React.PropTypes.array.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  render() {
    const { loading, error, orders, total, errorCases, errorDisplays} = this.props;
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
              <Error message={errorDisplays ? `Displays Error: ${errorDisplays}` : null } />
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onSearch={this.props.onSearch} enabled={!loading} />
          <div className="row">
            <div className="col-xs-12">
              <OrdersTable loading={loading} orders={orders} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TableTotals currentCount={orders.length} totalCount={total} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
