import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';
import { Button } from 'react-bootstrap';

import './Order.css';

import { fetchOrder } from '../../actions/order';
import { Error, LoadingPanel } from '../../components/Dashboard';
import EstimatedShippingWeight from '../../components/Orders/EstimatedShippingWeight';
import OrderStoreInfo from '../../components/Orders/OrderStoreInfo';
import PackingListTable from '../../components/Orders/PackingListTable';
import { getSimpleLineItemsForOrder } from '../../utils/getSimpleLineItems';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({
    error: state.order.get('error') + state.updateCompany.get('error'),
    loading: state.order.get('loading') || state.updateCompany.get('loading'),
    order: state.order
  });

  static actionsToProps = {
    fetchOrder,
  };

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    order: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
    fetchOrder: React.PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchOrder(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.params !== this.props.params ||
      nextProps.loading !== this.props.loading ||
      nextProps.order !== this.props.order ||
      nextProps.location !== this.props.location;
  }

  backToOrder() {
    this.props.router.push('/orders/' + this.props.params.id);
  }

  render() {
    const { loading, error, record } = this.props.order.toJS();

    const order = record;
    const {
      displayLineItems,
      packingLineItems,
      testerLineItems
    } = getSimpleLineItemsForOrder(order);

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Packing Slip</h2>
            <div className="pull-right">
              <Button onClick={this.backToOrder.bind(this)}>Back to Order</Button>
            </div>
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-6 col-md-6 wrapper">
              <div className="inline">INVOICE NUMBER: {order.invoiceNumber}</div>
              <div className={"inline"}>TODAY: {moment().format('MM/DD/YYYY')}</div>
              ORDER DATE: {moment.unix(order.date).format('MM/DD/YYYY')}
              {order.dueDate ?
                <div className="inline">DUE DATE: {moment.unix(order.dueDate).format('MM/DD/YYYY')}</div> : ''}
              {order.targetShipDate && !order.shippedDate ?
                <div>TARGET SHIP DATE: {moment.unix(order.targetShipDate).format('MM/DD/YYYY')}</div> : ''}
              <EstimatedShippingWeight weight={order.totals.weight}/>
              {order.shippedDate ? <div>SHIPPED DATE: {moment.unix(order.shippedDate).format('MM/DD/YYYY')}</div> : ''}
              {order.show && order.show.name !== 'House Account' ? <div>SHOW: {order.show.name}</div> : ''}
              <br/>
            </div>
            <div className="col-xs-6 col-md-6 wrapper">
              <OrderStoreInfo store={order.store}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          {order.notesToCustomer ?
            <div className="row">
              <div className="col-xs-12 col-md-6">
                NOTES: {order.notesToCustomer}
              </div>
            </div> : ''}
          {order.internalNotes ?
            <div className="row">
              <div className="col-xs-12 col-md-6">
                INTERNAL NOTES: {order.internalNotes}
              </div>
            </div> : ''}
          <div className="row">
            <h3>Product (includes Offset Merch)</h3>
            <div className="col-xs-12">
              <PackingListTable lineItems={packingLineItems}/>
            </div>
          </div>
          <div className="row">
            <h3>Displays</h3>
            <div className="col-xs-12">
              <PackingListTable lineItems={displayLineItems}/>
            </div>
          </div>
          <div className="row">
            <h3>Testers</h3>
            <div className="col-xs-12">
              <PackingListTable lineItems={testerLineItems}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );

  }
});
