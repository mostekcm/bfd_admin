import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { orderActions } from '../../actions';


import * as dialogs from '../../orders/Dialogs';
import { OrderOverview } from '../../components/Orders';

import './Orders.css';

class Orders extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    errorCases: PropTypes.string,
    errorCompanies: PropTypes.string,
    errorDisplays: PropTypes.string,
    errorPackages: PropTypes.string,
    orders: PropTypes.array,
    cases: PropTypes.array,
    companies: PropTypes.array,
    displays: PropTypes.array,
    packages: PropTypes.array,
    orderCreateError: PropTypes.string,
    orderCreateLoading: PropTypes.bool,
    validationErrors: PropTypes.object,
    appSettings: PropTypes.object,
    total: PropTypes.number,
    fetchOrders: PropTypes.func.isRequired,
    createOrder: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showCreateForm: false
    };
  }

  componentWillMount = () => {
    this.props.fetchOrders('', true, 0, 30);
  };

  onSearch = (query) => {
    this.props.fetchOrders(query);
  };

  onReset = () => {
    this.props.fetchOrders('', true, 0, 30);
  };

  createOrder = () => {
    this.props.requestCreateOrder(this.props.cases, this.props.displays);
  };

  render() {
    const { loading, error, orders, total, cases, companies, displays, packages, errorCases, errorCompanies, errorDisplays, errorPackages } = this.props;

    return (
      <div className="orders">
        <div className="row content-header">
          <div className="col-xs-12 order-table-content">
            <h1>Orders</h1>
            {(cases.length > 0 && displays.length > 0 && companies.length > 0 && Object.keys(packages).length > 0) ?
              <button className="btn btn-success pull-right new" onClick={this.createOrder}>
                <i className="icon-budicon-473"></i>
                New Order
              </button>
            : ''}
          </div>
        </div>
        <dialogs.CreateDialog />
        <OrderOverview
          onReset={this.onReset}
          onSearch={this.onSearch}
          query={this.props.query}
          error={error}
          errorCases={errorCases}
          errorCompanies={errorCompanies}
          errorDisplays={errorDisplays}
          errorPackages={errorPackages}
          orders={orders}
          total={total}
          loading={loading}
          push={this.props.router.push}
          age={this.props.age}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.orders.get('error'),
    errorCases: state.cases.get('error'),
    errorCompanies: state.companies.get('error'),
    errorDisplays: state.displays.get('error'),
    errorPackages: state.packages.get('error'),
    orderCreateError: state.orderCreate.get('error'),
    orderCreateLoading: state.orderCreate.get('loading'),
    validationErrors: state.orderCreate.get('validationErrors'),
    loading: state.orders.get('loading') || state.cases.get('loading') || state.displays.get('loading') || state.packages.get('loading'),
    orders: state.orders.get('records').toJS(),
    cases: state.cases.get('records').toJS(),
    companies: state.companies.get('records').toJS(),
    displays: state.displays.get('records').toJS(),
    packages: state.packages.get('records').toJS(),
    query: state.orders.get('query'),
    age: state.orders.get('age'),
    total: state.orders.get('total'),
    nextPage: state.orders.get('nextPage')
  };
}

export default connect(mapStateToProps, { ...orderActions })(Orders);
