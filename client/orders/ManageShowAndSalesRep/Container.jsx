import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actions from './actions';
import LoadingPanel from '../../components/Dashboard/LoadingPanel';
import * as constants from '../../constants';

class ManageShowAndSalesRep extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    message: PropTypes.string,
    orders: PropTypes.array,
    fetchOrders: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: null
    };
  }

  setStartDate(startDate) {
    console.log('carlos, startDate: ', startDate);
    this.setState({
      startDate: startDate
    });
  };

  renderError(error) {
    if (!error) return null;

    return <div className={'row'}>
      <div className={'col-xs-12'}>
        <Alert bsStyle="danger" onDismiss={() => null}>
          <h4>{error}</h4>
        </Alert>
      </div>
    </div>
  }

  renderMessage(message) {
    if (!message) return null;

    return <div className={'row'}>
      <div className={'col-xs-12'}>
        <Alert bsStyle="success" onDismiss={() => null}>
          <h4>{message}</h4>
        </Alert>
      </div>
    </div>
  }

  renderShow(orderId, showName) {
    return <FormGroup controlId="formControlsSelect">
      <FormControl
        componentClass="select"
        placeholder="select"
        defaultValue={showName}
        onChange={event => this.updateShow(orderId, event.target.value)}>
        {constants.SHOW_LIST.map((show, index) =>
          <option key={index} value={show.value}>{show.text}</option>
        )}
      </FormControl>
    </FormGroup>;
  }

  renderSalesRep(orderId, salesRep) {
    return <FormGroup controlId="formControlsSelect">
      <FormControl
        componentClass="select"
        placeholder="select"
        defaultValue={salesRep}
        onChange={(event) => this.updateSalesRep(orderId, event.target.value)}>
        {constants.SALES_REP_LIST.map((salesRep, index) =>
          <option key={index} value={salesRep.value}>{salesRep.text}</option>
        )}
      </FormControl>
    </FormGroup>;
  }

  renderOrders(loading, message, error, orders) {
    if ((!orders || orders.length <= 0) && !loading) return null;
    return <LoadingPanel show={loading}>
      {this.renderMessage(message)}
      {this.renderError(error)}
      <div className="row">
        <div className="col-xs-12">
          <table>
            <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Store</th>
              <th>Show</th>
              <th>SalesRep</th>
            </tr>
            </thead>
            <tbody>
            {orders.map((order, index) =>
              <tr key={index}>
                <td>{order.invoiceNumber}</td>
                <td>{moment.unix(order.date).format('MM/DD/YYYY')}</td>
                <td>{order.store.name}</td>
                <td>{this.renderShow(order.id, order.show.name)}</td>
                <td>{this.renderSalesRep(order.id, order.salesRep.name)}</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </LoadingPanel>
  }

  filterOrders() {
    this.props.fetchOrders(this.state.startDate);
  };

  updateShow(orderId, show) {
    console.log('carlos, order: ', orderId, show);
    this.props.updateOrder(orderId, { show: { name: show } }, () => null);
  }

  updateSalesRep(orderId, salesRep) {
    console.log('carlos order sr: ', orderId, salesRep);
    this.props.updateOrder(orderId, { salesRep: { name: salesRep } }, () => null);
  }

  render() {
    const { loading, error, message, orders } = this.props;

    return (
      <div className="orders">
        <div className="row content-header">
          <div className="col-xs-12">
            <h1>Manage Show and Sales Rep</h1>
            <div className={"row pull-right"}>
              <div className={"col-xs-12 col-md-7"}>
                <input className="form-control" type="date"
                       onChange={(event) => this.setStartDate(moment(event.target.value).unix())}/>
              </div>
              <div className={"col-xs-12 col-md-3 pull-right"}>
                <button className="btn btn-success pull-right new" onClick={this.filterOrders.bind(this)}>
                  <i className="icon-budicon-473"></i>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.renderOrders(loading, message, error, orders)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.manageShowAndSalesRep.get('error'),
    message: state.manageShowAndSalesRep.get('message'),
    loading: state.manageShowAndSalesRep.get('loading'),
    orders: state.manageShowAndSalesRep.get('orders').toJS()
  };
}

export default connect(mapStateToProps, { ...actions })(ManageShowAndSalesRep);
