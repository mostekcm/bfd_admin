import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class OrderActions extends Component {
  static propTypes = {
    updateCompany: PropTypes.func.isRequired,
    updateDates: PropTypes.func.isRequired,
    updateDealStage: PropTypes.func.isRequired,
    updateDiscount: PropTypes.func.isRequired,
    updatePayments: PropTypes.func.isRequired,
    payCommission: PropTypes.func.isRequired,
    updateShippingInfo: PropTypes.func.isRequired,
    updateLineItems: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    viewPackingList: PropTypes.func.isRequired,
    sendOrderEmail: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired
  };

  state = {
    order: null,
    loading: false
  };

  constructor() {
    super();

    this.printOrder.bind(this);
    this.getPrintAction.bind(this);
  }

  printOrder() {
    print();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order) {
      const { record, loading } = nextProps.order.toJS();
      this.setState({
        order: record,
        loading
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.order !== this.props.order;
  }

  getPrintAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.printOrder}>
      Print Order
    </MenuItem>
  );

  getUpdateDatesAndNotesAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateDates}>
      Update Dates and Notes
    </MenuItem>
  );

  getUpdateDiscountAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateDiscount}>
      Update Discount
    </MenuItem>
  );

  getUpdatePaymentAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updatePayments}>
      Update Payments
    </MenuItem>
  );

  getPayCommissionAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.payCommission}>
      Pay Commission
    </MenuItem>
  );

  getUpdateCompanyAction = (order, loading) => {
    return (
      <MenuItem disabled={loading || false} onClick={this.updateCompany}>
        Pull Company from HubSpot
      </MenuItem>
    );
  };

  getUpdateDealStageAction = (order, loading) => {
    if (order.shippedDate) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.updateDealStage}>
        Update Deal Stage
      </MenuItem>
    );
  };

  getUpdateShippingInfoAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateShippingInfo}>
      Update Shipping Info
    </MenuItem>
  );

  getUpdateLineItemsAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateLineItems}>
      Update Line Items
    </MenuItem>
  );

  getUpdateDisplayItemsAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateDisplayItems}>
      Update Display Items
    </MenuItem>
  );

  getDeleteAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.deleteOrder}>
      Delete Order
    </MenuItem>
  );

  getViewPackingListAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.viewPackingList}>
      View Packing List
    </MenuItem>
  );

  getSendOrderEmailAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.sendOrderEmail}>
      Send Order Email
    </MenuItem>
  );

  viewPackingList = () => {
    this.props.viewPackingList(this.state.order);
  };

  sendOrderEmail = () => {
    this.props.sendOrderEmail(this.state.order);
  };

  deleteOrder = () => {
    this.props.deleteOrder(this.state.order);
  };

  updateLineItems = () => {
    this.props.updateLineItems(this.state.order);
  };

  updateDisplayItems = () => {
    this.props.updateDisplayItems(this.state.order);
  };

  updateDates = () => {
    this.props.updateDates(this.state.order);
  };

  updateDiscount = () => {
    this.props.updateDiscount(this.state.order);
  };

  updatePayments = () => {
    this.props.updatePayments(this.state.order);
  };

  payCommission = () => {
    this.props.payCommission(this.state.order);
  };

  updateCompany = () => {
    this.props.updateCompany(this.state.order);
  };

  updateDealStage = () => {
    this.props.updateDealStage(this.state.order);
  };

  updateShippingInfo = () => {
    this.props.updateShippingInfo(this.state.order);
  };

  render() {
    if (!this.state.order) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="order-actions">
        {this.getUpdateCompanyAction(this.state.order, this.state.loading)}
        {this.getUpdateDealStageAction(this.state.order, this.state.loading)}
        {this.getUpdateDatesAndNotesAction(this.state.order, this.state.loading)}
        {this.getUpdateDiscountAction(this.state.order, this.state.loading)}
        {this.getUpdateLineItemsAction(this.state.order, this.state.loading)}
        {this.getUpdateDisplayItemsAction(this.state.order, this.state.loading)}
        {this.getUpdateShippingInfoAction(this.state.order, this.state.loading)}
        {this.getUpdatePaymentAction(this.state.order, this.state.loading)}
        {this.getPayCommissionAction(this.state.order, this.state.loading)}
        {this.getDeleteAction(this.state.order, this.state.loading)}
        {this.getViewPackingListAction(this.state.order, this.state.loading)}
        {this.getSendOrderEmailAction(this.state.order, this.state.loading)}
      </DropdownButton>
    );
  }
}
