import React, { Component } from 'react';
import { connect } from 'react-redux';

import { orderActions } from '../../actions';


import * as dialogs from '../../orders/Dialogs';
import { OrderOverview } from '../../components/Orders';

import './Orders.css';

class Orders extends Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string,
    errorCases: React.PropTypes.string,
    errorDisplays: React.PropTypes.string,
    orders: React.PropTypes.array,
    cases: React.PropTypes.array,
    displays: React.PropTypes.array,
    orderCreateError: React.PropTypes.string,
    orderCreateLoading: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    appSettings: React.PropTypes.object,
    total: React.PropTypes.number,
    fetchOrders: React.PropTypes.func.isRequired,
    createOrder: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showCreateForm: false
    };
  }

  componentWillMount = () => {
    this.props.fetchOrders();
  };

  onSearch = (query) => {
    this.props.fetchOrders(query);
  }

  onReset = () => {
    this.props.fetchOrders('', true);
  }

  createOrder = () => {
    this.props.requestCreateOrder(this.props.cases, this.props.displays);
  }

  render() {
    const { loading, error, orders, total, cases, displays, errorCases, errorDisplays } = this.props;

    return (
      <div className="orders">
        <div className="row content-header">
          <div className="col-xs-12 order-table-content">
            <h1>Orders</h1>
            {(cases.length > 0 && displays.length > 0) ?
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
          errorDisplays={errorDisplays}
          orders={orders}
          total={total}
          loading={loading}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.orders.get('error'),
    errorCases: state.cases.get('error'),
    errorDisplays: state.displays.get('error'),
    orderCreateError: state.orderCreate.get('error'),
    orderCreateLoading: state.orderCreate.get('loading'),
    validationErrors: state.orderCreate.get('validationErrors'),
    loading: state.orders.get('loading') || state.cases.get('loading') || state.displays.get('loading'),
    orders: state.orders.get('records').toJS(),
    query: state.orders.get('query'),
    cases: state.cases.get('records').toJS(),
    displays: state.displays.get('records').toJS(),
    total: state.orders.get('total'),
    nextPage: state.orders.get('nextPage')
  };
}

export default connect(mapStateToProps, { ...orderActions })(Orders);
