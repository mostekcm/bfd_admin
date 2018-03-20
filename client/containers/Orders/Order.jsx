import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';
import Markdown from 'react-markdown';
import formatCurrency from 'format-currency';

import { orderActions } from '../../actions';

/* Dialogs */
import { requestUpdatePayments } from '../../orders/Dialogs/UpdatePaymentInfo/actions';
import UpdatePaymentsDialog from '../../orders/Dialogs/UpdatePaymentInfo/Dialog';
import { requestPayCommission } from '../../orders/Dialogs/PayCommission/actions';
import PayCommissionDialog from '../../orders/Dialogs/PayCommission/Dialog';
import { requestUpdateShippingInfo } from '../../orders/Dialogs/UpdateShippingInfo/actions';
import UpdateShippingInfoDialog from '../../orders/Dialogs/UpdateShippingInfo/Dialog';
import { requestUpdateDealStage } from '../../orders/Dialogs/UpdateDealStage/actions';
import UpdateDealStageDialog from '../../orders/Dialogs/UpdateDealStage/Dialog';
import { requestUpdateDates } from '../../orders/Dialogs/UpdateDates/actions';
import UpdateDatesDialog from '../../orders/Dialogs/UpdateDates/Dialog';
import { requestUpdateDisplayItems } from '../../actions/order';
import UpdateDisplayItemsDialog from '../../orders/Dialogs/UpdateDisplayItemsDialog';
import { updateCompany } from '../../actions/order';

import './Order.css';

import { Error, LoadingPanel } from '../../components/Dashboard';
import * as dialogs from '../../orders/Dialogs';
import {
  OrderActions, OrderDetailsTable, OrderDisplayDetailsTable, OrderTestersTable/*, OrderHeader, OrderProfile, OrderLogs,
 OrderInfo*/
} from '../../components/Orders';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({
    error: state.order.get('error') + state.updateCompany.get('error'),
    loading: state.order.get('loading') || state.updateCompany.get('loading'),
    order: state.order,
    lineItems: state.order.get('record').toJS().lineItems,
    displayItems: state.order.get('record').toJS().displayItems
  });

  static actionsToProps = {
    ...orderActions,
    requestUpdateDates,
    requestUpdatePayments,
    requestPayCommission,
    requestUpdateShippingInfo,
    requestUpdateDealStage,
    requestUpdateDisplayItems,
    updateCompany
  };

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    displayItems: PropTypes.array,
    lineItems: PropTypes.array,
    order: PropTypes.object,
    params: PropTypes.object,
    fetchOrder: React.PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchOrder(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.loading !== this.props.loading || nextProps.lineItems !== this.props.lineItems || nextProps.displayItems !== this.props.displayItems;
  }

  getTesterCost(item) {
    return item.tester.quantity ? item.tester.quantity * item.tester.cpu : 0;
  }

  getLineItemCost(item) {
    return item.quantity * item.cpu * item.size;
  }

  renderShippingWeight(weight) {
    const weightWithPackingMaterials = parseFloat(weight) * 1.15;
    const weightInPoundsFloat = weightWithPackingMaterials / 16.0;
    let weightInPounds = Math.floor(weightInPoundsFloat);
    let remainingOunces = Math.ceil((weightInPoundsFloat - weightInPounds)*16);
    if (remainingOunces === 16) {
      weightInPounds += 1;
      remainingOunces = 0;
    }
    return `${weightInPounds} lbs ${remainingOunces} oz`;
  }

  renderAddress(address, header) {
    address = address || 'No Address';
    let parts = address.split(',');
    let postalCode = undefined;
    let state = undefined;
    let city = undefined;
    if (parts.length >= 2) {
      const lastLine = parts.pop().trim();
      city = parts.pop().trim();
      const stateZipParts = lastLine.split(' ');
      state = stateZipParts.shift();
      postalCode = stateZipParts.join('');
    }

    return (
      <div className="address">
        { header ?
          <div className="address">
            {header}<br />
          </div> : '' }
        {
          state ? <div className="address">
            { parts.map(part => {
              return <div className="address">{part}<br /></div>;
            })
            }
            {city}, {state} &nbsp;{postalCode}<br />
          </div> : <div className="address">{address}<br /></div>
        }<br />
      </div>
    );
  }

  getContactName(store) {
    return store.contacts ? _.map(store.contacts, 'name').join(' or ') :
      (store.contact && store.contact.name) || 'No Contact';
  }

  getPhone(store) {
    return store.contacts ? _.map(store.contacts, 'phone').join(' or ') : store.phone || 'No Phone';
  }

  getEmail(store) {
    return store.contacts ? _.map(store.contacts, 'email').join(' or ') : store.email || 'No Email';
  }

  render() {
    const { loading, error, record } = this.props.order.toJS();
    const opts = { format: '%s%v', symbol: '$' };

    const order = record;
    order.totals = order.totals || {};
    const lineItems = this.props.lineItems || [];
    const displayItems = this.props.displayItems || [];

    const paymentInfo = `
\`\`\`
METHOD: Prepaid  Check  Credit Card

NAME ON CREDIT CARD: _________________________________________________________________

CREDIT CARD #: _______________________________________________________________________

EXP DATE: _________________________________________    CVV2: _________________________

TAX ID: ___________________________________________
\`\`\`
`;

    const terms1 = `
1. *Minimum of $100 applies only to opening orders*
1. *All orders prepaid or payment by Credit Card (CC)*
1. *A $25.00 charge on returned checks.*
1. *Shipping charges will be added to all orders.*
1. *Beauty Full Day LLC does not ship COD*
1. *Please notify us of special ship dates or events.*
1. *Prices are subject to change without notice*
`;

    const terms2 = `
8. *No merchandise may be returned without prior approval.*
1. *A 15% restocking fee will be charged on any item approved for return.*
1. *Tester pricing:*
   1. *1 oz special tester size, offered when available, at $1/tester*
   1. *Otherwise full-size testers available at 1/2 wholesale cost*
   1. *limit 1 tester per product ordered per 6 cases ordered*
`;

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Order Details</h2>
            <div className="pull-right">
              <OrderActions
                order={this.props.order}
                updateDates={this.props.requestUpdateDates}
                deleteOrder={this.props.requestDeleteOrder}
                updatePayments={this.props.requestUpdatePayments}
                payCommission={this.props.requestPayCommission}
                updateShippingInfo={this.props.requestUpdateShippingInfo}
                updateCompany={this.props.updateCompany}
                updateDealStage={this.props.requestUpdateDealStage}
                updateDiscount={this.props.requestUpdateDiscount}
                updateLineItems={this.props.requestUpdateLineItems}
                updateDisplayItems={this.props.requestUpdateDisplayItems}
              />
            </div>
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-6 col-md-6 wrapper">
              <div className="inline">INVOICE NUMBER: {order.invoiceNumber}</div>
              ORDER DATE: {moment.unix(order.date).format('MM/DD/YYYY')}
              { order.dueDate ? <div className="inline">DUE DATE: {moment.unix(order.dueDate).format('MM/DD/YYYY')}</div> : '' }
              { order.targetShipDate && !order.shippedDate ? <div>TARGET SHIP DATE: {moment.unix(order.targetShipDate).format('MM/DD/YYYY')}</div> : '' }
              { order.shippedDate ? <div>SHIPPED DATE: {moment.unix(order.shippedDate).format('MM/DD/YYYY')}</div> : '' }
              { order.show && order.show.name !== 'House Account' ? <div>SHOW: {order.show.name}</div> : '' }
              { order.store ? <div className="address"><br/>
                {order.store.name}<br />
                Attn: {this.getContactName(order.store)}<br />
                {this.renderAddress(order.store.shippingAddress)}
                { order.store.billingAddress ? this.renderAddress(order.store.billingAddress, 'bill to: ') : '' }
                {this.getPhone(order.store)}<br />
                {this.getEmail(order.store)}
              </div> : <div></div> }
            </div>
            <div className="col-xs-6 col-md-6 wrapper">
              Beauty Full Day LLC<br />
              12084 Waconia Cir NE<br />
              Blaine, MN  55449<br /><br />
              (612) 247-6537<br />
              orders@beautyfullday.com<br />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          { order.notesToCustomer ?
            <div className="row">
              <div className="col-xs-12 col-md-6">
                NOTES: {order.notesToCustomer}
              </div>
            </div> : '' }
          <div className="row">
            <h3>Products</h3>
            <div className="col-xs-12">
              <OrderDetailsTable lineItems={lineItems}/>
            </div>
          </div>
          { displayItems.length > 0 ?
            <div className="row">
              <h3>Displays</h3>
              <div className="col-xs-12">
                <OrderDisplayDetailsTable displayItems={displayItems}/>
              </div>
            </div> : '' }
          { order.totals.tester > 0 ?
            <div className="row">
              <h3>Testers</h3>
              <div className="col-xs-12">
                <OrderTestersTable lineItems={lineItems}/>
              </div>
            </div> : '' }
          <div className="row">
            <div className="col-xs-12 wrapper totals">
              TOTAL PRODUCT COST: {formatCurrency(order.totals.product, opts)}
            </div>
          </div>
          { order.totals.shippingAndHandling > 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                TOTAL SHIPPING &amp; HANDLING: {formatCurrency(order.totals.shippingAndHandling, opts)}
              </div>
            </div> : '' }
          { order.totals.discount > 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                TOTAL DISCOUNT: {formatCurrency(order.totals.discount, opts)}
              </div>
            </div> : '' }
          { order.totals.totalPaid > 0 ?
            order.payments.map((payment, index) =>
              <div className="row" key={index}>
                <div className="col-xs-12 wrapper totals">
                  PAID ({moment.unix(payment.date).format('MM/DD/YYYY')}): { formatCurrency(payment.amount, opts) }
                </div>
              </div>
            ) : '' }
          { order.totals.shippingAndHandling > 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                AMOUNT OWED: {formatCurrency(order.totals.owed, opts)}
              </div>
            </div> : '' }
          <div className="row">
            <div className="col-xs-12 wrapper totals">
              ESTIMATED SHIPPING WEIGHT: {this.renderShippingWeight(order.totals.weight)}
            </div>
          </div>
          { order.totals.owed > 0 ?
            <div className="row">
              <h2>Payment Information</h2>
              <div className="col-xs-12">
                <Markdown source={paymentInfo}/>
              </div>
            </div> : '' }
          <div className="row">
            <h2>Ordering Information</h2>
            <div className="col-xs-6 col-md-6">
              <Markdown source={terms1}/>
            </div>
            <div className="col-xs-6 col-md-6">
              <Markdown source={terms2}/>
            </div>
          </div>
        </LoadingPanel>
        <dialogs.DeleteDialog />
        <UpdatePaymentsDialog />
        <PayCommissionDialog />
        <UpdateDatesDialog />
        <UpdateShippingInfoDialog />
        <UpdateDealStageDialog />
        <dialogs.UpdateDiscountDialog />
        <dialogs.UpdateLineItemsDialog />
        <UpdateDisplayItemsDialog />
      </div>
    );

  }
});
