import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';
import Markdown from 'react-markdown';
import formatCurrency from 'format-currency';
import { Alert } from 'react-bootstrap';

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
import { requestSendOrderEmail, cancelSendOrderEmail } from '../../orders/Dialogs/SendOrderEmail/actions';
import SendOrderEmailDialog from '../../orders/Dialogs/SendOrderEmail/Dialog';
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
import EstimatedShippingWeight from '../../components/Orders/EstimatedShippingWeight';
import OrderStoreInfo from '../../components/Orders/OrderStoreInfo';

import { getEstimatedShippingAndHandling } from '../../orders/utils';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({
    emailSuccess: state.sendOrderEmail.get('success'),
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
    updateCompany,
    requestSendOrderEmail,
    cancelSendOrderEmail
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
    return nextProps.loading !== this.props.loading ||
      nextProps.lineItems !== this.props.lineItems ||
      nextProps.displayItems !== this.props.displayItems;
  }

  getTesterCost(item) {
    return item.tester.quantity ? item.tester.quantity * item.tester.cpu : 0;
  }

  getLineItemCost(item) {
    return item.quantity * item.cpu * item.size;
  }

  viewPackingList(order) {
    this.props.router.push(`/orders/packing/${order.id}`);
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
1. *Please allow two weeks of lead-time for orders to ship (although we do make every effort to shorten this process when resources allow).*
1. *Please notify us of delayed shipping requirements or requests for expedited processing.*
1. *Minimum of $100 applies only to opening orders; no minimum order for re-orders. Case quantities apply for all orders.*
1. *All payments by Credit Card (CC) or prepaid, except in special circumstances, with approval.*
1. *Prices are subject to change.*
1. *Late or returned payments are subject to a 15% fee and may result in rejection of future orders.*
1. *The following shipping charges will apply:*
    1. *Up to 150: 10%*
    1. *$151-$300: 7.5%*
    1. *$301+: 5%*
`;

    const terms2 = `
1. *No items may be returned without approval.*
1. *A 15% restocking fee will be charged on any item approved for return.*
1. *Tester & Sample details as follows:*
   1. *Testers are not intended for resale*
   1. *Staff Samples may be obtainable upon request, subject to availability*
   1. *Tester pricing limited to one tester per six cases per product*
   1. *Tester sizes offered as available*
   1. *Special tester sizes cost $1 each, on a limited basis*
   1. *Full-sized testers offered when miniature tester sizes are not available*
   1. *Full-sized testers cost 50% of wholesale pricing, on a limited basis*
   1. *Tester cost may be waived when two or more cases are ordered per instance.*
`;

    const owed = order.totals.owed + (order.shippedDate ? 0 : getEstimatedShippingAndHandling(order.totals.product));
    const amountDue = formatCurrency(owed, opts);

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-9">
            <h2 className="pull-left">{order.shippedDate ? 'INVOICE' : 'ORDER CONFIRMATION'}</h2>
          </div>
          <div className={'col-xs-3 pull-right'}>
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
                viewPackingList={this.viewPackingList.bind(this)}
                sendOrderEmail={this.props.requestSendOrderEmail}
              />
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className={'row'}>
            { this.props.emailSuccess ?
            <Alert bsStyle="success" onDismiss={this.props.cancelSendOrderEmail}>
              <h4>Your email was sent successfully</h4>
            </Alert> : null }
          </div>
          <div className={"row"}>
            <div className="col-xs-12 col-md-12 wrapper">
              <h3
                className={"pull-left"}>{order.shippedDate ? order.totals.owed > 0 ? 'AMOUNT DUE: ' + amountDue : 'PAID' : 'ESTIMATED TOTAL: ' + amountDue}
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-6 wrapper">
              <div className="inline">INVOICE NUMBER: {order.invoiceNumber}</div>
              <div className={"inline"}>TODAY: {moment().format('MM/DD/YYYY')}</div>
              ORDER DATE: {moment.unix(order.date).format('MM/DD/YYYY')}
              {order.dueDate ?
                <div className="inline">DUE DATE: {moment.unix(order.dueDate).format('MM/DD/YYYY')}</div> : ''}
              {order.targetShipDate && !order.shippedDate ?
                <div>TARGET SHIP DATE: {order.shipAsap ? 'ASAP' : ''} {moment.unix(order.targetShipDate).format('MM/DD/YYYY')}</div> : ''}
              {order.shippedDate ? <div>SHIPPED DATE: {moment.unix(order.shippedDate).format('MM/DD/YYYY')}</div> : ''}
              {order.show && order.show.name !== 'House Account' ? <div>SHOW: {order.show.name}</div> : ''}
              <br/>
              <OrderStoreInfo store={order.store}/>
            </div>
            <div className="col-xs-6 col-md-6 wrapper">
              Beauty Full Day LLC<br/>
              12084 Waconia Cir NE<br/>
              Blaine, MN 55449<br/><br/>
              (651) 401-5402<br/>
              orders@beautyfullday.com<br/>
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
          <div className="row">
            <h3>Products</h3>
            <div className="col-xs-12">
              <OrderDetailsTable lineItems={lineItems}/>
            </div>
          </div>
          {displayItems.length > 0 ?
            <div className="row">
              <h3>Displays</h3>
              <div className="col-xs-12">
                <OrderDisplayDetailsTable displayItems={displayItems}/>
              </div>
            </div> : ''}
          {order.totals.tester > 0 ?
            <div className="row">
              <h3>Testers</h3>
              <div className="col-xs-12">
                <OrderTestersTable lineItems={lineItems}/>
              </div>
            </div> : ''}
          <div className="row">
            <div className="col-xs-12 wrapper totals">
              TOTAL PRODUCT COST: {formatCurrency(order.totals.product, opts)}
            </div>
          </div>
          {order.totals.shippingAndHandling > 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                TOTAL SHIPPING &amp; HANDLING: {formatCurrency(order.totals.shippingAndHandling, opts)}
              </div>
            </div> : ''}
          {order.totals.shippingAndHandling <= 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                ESTIMATED SHIPPING &amp; HANDLING: {formatCurrency(getEstimatedShippingAndHandling(order.totals.product), opts)}
              </div>
            </div> : ''}
          {order.totals.discount > 0 ?
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                TOTAL DISCOUNT: {formatCurrency(order.totals.discount, opts)}
              </div>
            </div> : ''}
          {order.totals.totalPaid > 0 ?
            order.payments.map((payment, index) =>
              <div className="row" key={index}>
                <div className="col-xs-12 wrapper totals">
                  PAID ({moment.unix(payment.date).format('MM/DD/YYYY')}): {formatCurrency(payment.amount, opts)}
                </div>
              </div>
            ) : ''}
            <div className="row">
              <div className="col-xs-12 wrapper totals">
                {order.totals.shippingAndHandling <= 0 ? "ESTIMATED" : "" } AMOUNT OWED: {amountDue}
              </div>
            </div>
          <div className="row">
            <div className="col-xs-12 wrapper totals">
              <EstimatedShippingWeight weight={order.totals.weight}/>
            </div>
          </div>
          {order.totals.owed > 0 ?
            <div className="row">
              <h2>Payment Information</h2>
              <div className="col-xs-12">
                <Markdown source={paymentInfo}/>
              </div>
            </div> : ''}
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
        <dialogs.DeleteDialog/>
        <UpdatePaymentsDialog/>
        <PayCommissionDialog/>
        <SendOrderEmailDialog/>
        <UpdateDatesDialog/>
        <UpdateShippingInfoDialog/>
        <UpdateDealStageDialog/>
        <dialogs.UpdateDiscountDialog/>
        <dialogs.UpdateLineItemsDialog/>
        <UpdateDisplayItemsDialog/>
      </div>
    );

  }
});
