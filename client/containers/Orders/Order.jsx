import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';
import Markdown from 'react-markdown';
import { Tabs, Tab } from 'react-bootstrap';
import formatCurrency from 'format-currency';

import { orderActions } from '../../actions';

import './Order.css';

import { Error, LoadingPanel } from '../../components/Dashboard';
import * as dialogs from './Dialogs';
import { OrderActions, OrderDetailsTable, OrderDisplayDetailsTable/*, OrderHeader, OrderProfile, OrderLogs,
 OrderInfo*/ } from '../../components/Orders';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({
    error: state.order.get('error'),
    loading: state.order.get('loading'),
    order: state.order,
    lineItems: state.order.get('record').toJS().lineItems,
    displayItems: state.order.get('record').toJS().displayItems
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    displayItems: PropTypes.array,
    lineItems: PropTypes.array,
    order: PropTypes.object,
    params: PropTypes.object,
    fetchOrder: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchOrder(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.loading !== this.props.loading || nextProps.lineItems !== this.props.lineItems || nextProps.displayItems !== this.props.displayItems;
  }

  getLineItemCost(item) {
    let total = 0;
    total += item.quantity * item.cpu * item.size;
    total += item.tester.quantity ? item.tester.quantity * item.tester.cpu : 0;
    return total;
  }

  render() {
    const { loading, error, record } = this.props.order.toJS();
    const opts = { format: '%s%v', symbol: '$' };

    const order = record;
    const lineItems = this.props.lineItems || [];
    const displayItems = this.props.displayItems || [];

    let total = 0;

    lineItems.forEach(item => total += this.getLineItemCost(item) );
    displayItems.forEach(item => total += item.quantity * item.cost);

    const paymentInfo = `
\`\`\`
METHOD: Prepaid  Check  Credit Card

NAME ON CREDIT CARD: _________________________________________________________________

CREDIT CARD #: _______________________________________________________________________

EXP DATE: _________________________________________    CVV2: _________________________
\`\`\`
`;

    const terms1 = `
1. *Minimum of $100 applies only to opening orders*
1. *First order prepaid or payment by Credit Card (CC)*
1. *For balances over 60 days past due any and/or all of the following actions may be taken:*
   1. *A Finance Charge of 1.5% per month will be assessed*
   1. *A credit card on file may be charged*
   1. *Future orders will require payment by credit card*
1. *A $25.00 charge on returned checks.*
`;

    const terms2 = `
5. *Shipping charges will be added to all orders.*
6. *Shipping charges will be added to all orders.*
1. *Beauty Full Day LLC does not ship COD*
1. *Please notify us of special ship dates or events.*
1. *Prices are subject to change without notice*
1. *No merchandise may be returned without prior approval.*
1. *A 15% restocking fee will be charged on any item approved for return.*
1. *Tester pricing available on request*
`;

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Order Details</h2>
            <div className="pull-right">
              <OrderActions
                order={this.props.order}
                deleteOrder={this.props.requestDeleteOrder}
              />
            </div>
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              ORDER DATE: {moment(order.date).format()}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              SHOW: {order.show && order.show.name}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              TOTAL COST: {formatCurrency(total, opts)}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <OrderDetailsTable lineItems={lineItems} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <OrderDisplayDetailsTable displayItems={displayItems} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              STORE NAME: {order.store && order.store.name}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              STORE SHIPPING ADDRESS: {order.store && order.store.shippingAddress}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              STORE BILLING ADDRESS: {order.store && order.store.billingAddress}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              CONTACT PERSON: {order.store && order.store.contact}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-6">
              PHONE: {order.store && order.store.phone}
            </div>
            <div className="col-xs-6 col-md-6">
              EMAIL: {order.store && order.store.email}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              NOTES: {order.notes}
            </div>
          </div>
          <div className="row">
            <h2>Payment Information</h2>
            <div className="col-xs-12">
              <Markdown source={paymentInfo} />
            </div>
          </div>
          <div className="row">
            <h2>Ordering Information</h2>
            <div className="col-xs-6 col-md-6">
              <Markdown source={terms1} />
            </div>
            <div className="col-xs-6 col-md-6">
              <Markdown source={terms2} />
            </div>
          </div>
        </LoadingPanel>
        <dialogs.DeleteDialog />
      </div>
      );
      //   <!-- div className="row">
      //     <div className="col-xs-12">
      //       <OrderHeader loading={order.get('loading')} order={order.get('record')} error={order.get('error')} />
      //     </div>
      //   </div>
      //   <div className="row order-tabs">
      //     <div className="col-xs-12">
      //       <Tabs defaultActiveKey={1} animation={false} id="order-info-tabs">
      //         <Tab eventKey={1} title="Order Information">
      //           <OrderInfo loading={order.get('loading')} order={order.get('record')}
      //                     memberships={order.get('memberships').toJSON()} error={order.get('error')} />
      //         </Tab>
      //         <Tab eventKey={2} title="Devices">
      //           <OrderDevices loading={devices.get('loading')} devices={devices.get('records')}
      //                        error={devices.get('error')} />
      //         </Tab>
      //         <Tab eventKey={3} title="Logs">
      //           <LogDialog
      //             onClose={this.props.clearLog} error={log.get('error')}
      //             loading={log.get('loading')} log={log.get('record')}
      //             logId={log.get('logId')}
      //           />
      //           <OrderLogs
      //             onOpen={this.props.fetchLog} loading={logs.get('loading')}
      //             logs={logs.get('records')} order={order.get('record')}
      //             error={logs.get('error')}
      //           />
      //         </Tab>
      //         <Tab eventKey={4} title="Profile">
      //           <OrderProfile loading={order.get('loading')} order={order.get('record')} error={order.get('error')} />
      //         </Tab>
      //       </Tabs>
      //     </div>
      //   </div>
      //   <dialogs.DeleteDialog />
      //   <dialogs.EmailChangeDialog />
      //   <dialogs.PasswordResetDialog />
      //   <dialogs.PasswordChangeDialog />
      //   <dialogs.OrdernameChangeDialog />
      //   <dialogs.ResendVerificationEmailDialog />
      //   <dialogs.BlockDialog />
      //   <dialogs.UnblockDialog />
      //   <dialogs.RemoveMultiFactorDialog / -->
      // </div>
  }
});
