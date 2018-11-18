import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import { SearchBar, OrdersTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';
import formatCurrency from 'format-currency';

export default class OrderOverview extends React.Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    error: PropTypes.object,
    errorCases: PropTypes.object,
    errorCompanies: PropTypes.object,
    errorDisplays: PropTypes.object,
    orders: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    age: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { selectedOrders: {} };
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  };

  createSpeedeeEmail() {
    this.props.push({
      pathname: '/speedee',
      state: {
        orders: this.state.selectedOrders
      }
    });
  }

  orderRollup() {
    this.props.push({
      pathname: '/orderRollup',
      state: {
        orders: this.state.selectedOrders
      }
    });
  }

  onRowSelect(order, selected) {
    const selectedOrders = this.state.selectedOrders;
    if (selected) {
      if (!(order.id in selectedOrders)) selectedOrders[order.id] = order;
    } else {
      if (order.id in selectedOrders) delete selectedOrders[order.id];
    }

    this.setState({ selectedOrders });
  }

  render() {
    const { loading, error, orders, errorCases, errorCompanies, errorDisplays } = this.props;
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
        <div show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorCases ? `Cases Error: ${errorCases}` : null}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorCompanies ? `Companies Error: ${errorCompanies}` : null}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={errorDisplays ? `Displays Error: ${errorDisplays}` : null}/>
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onSearch={this.props.onSearch} query={this.props.query}
                     enabled={!loading}/>
          <div className={"row"}>
            <div className={"col-xs-12 col-sm-2"}>
              <button className={`btn btn-success pull-left new`}
                      disabled={Object.keys(this.state.selectedOrders).length <= 0}
                      onClick={this.createSpeedeeEmail.bind(this)}>
                <i className="icon-budicon-778"></i>
                Email Speedee
              </button>
            </div>
            <div className={"col-xs-12 col-sm-2"}>
              <button className={`btn btn-success pull-left new`}
                      disabled={Object.keys(this.state.selectedOrders).length <= 0}
                      onClick={this.orderRollup.bind(this)}>
                <i className="icon-budicon-715"></i>
                Order Rollup
              </button>
            </div>
            <div className={"col-xs-12 col-sm-2"}>
              Finished Order Age: {this.props.age}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <OrdersTable loading={loading} orders={orders} onRowSelect={this.onRowSelect.bind(this)}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              {Object.keys(totalAccountsReceivable).map((stage, index) => <div key={index}>Total Accounts Receivable
                ({stage}): {formatCurrency(totalAccountsReceivable[stage], opts)}<br/></div>)}
              Total Estimated Accounts Receivable: {formatCurrency(overallEstimatedAR, opts)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
