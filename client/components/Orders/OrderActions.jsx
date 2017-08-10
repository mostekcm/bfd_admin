import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class OrderActions extends Component {
  static propTypes = {
    updateDiscount: PropTypes.func.isRequired,
    updatePayments: PropTypes.func.isRequired,
    payCommission: PropTypes.func.isRequired,
    updateShippingInfo: PropTypes.func.isRequired,
    updateLineItems: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired
  }

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
  )

  getUpdateDiscountAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateDiscount}>
      Update Discount
    </MenuItem>
  )

  getUpdatePaymentAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updatePayments}>
      Update Payments
    </MenuItem>
  )

  getPayCommissionAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.payCommission}>
      Pay Commission
    </MenuItem>
  )

  getUpdateShippingInfoAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateShippingInfo}>
      Update Shipping Info
    </MenuItem>
  )

  getUpdateLineItemsAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateLineItems}>
      Update Line Items
    </MenuItem>
  )

  getDeleteAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.deleteOrder}>
      Delete Order
    </MenuItem>
  )

  deleteOrder = () => {
    this.props.deleteOrder(this.state.order);
  }

  updateLineItems = () => {
    this.props.updateLineItems(this.state.order);
  }

  updateDiscount = () => {
    this.props.updateDiscount(this.state.order);
  }

  updatePayments = () => {
    this.props.updatePayments(this.state.order);
  }

  payCommission = () => {
    this.props.payCommission(this.state.order);
  }

  updateShippingInfo = () => {
    this.props.updateShippingInfo(this.state.order);
  }

  render() {
    if (!this.state.order) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="order-actions">
        {this.getPrintAction(this.state.loading)}
        {this.getUpdateDiscountAction(this.state.order, this.state.loading)}
        {this.getUpdateLineItemsAction(this.state.order, this.state.loading)}
        {this.getUpdateShippingInfoAction(this.state.order, this.state.loading)}
        {this.getUpdatePaymentAction(this.state.order, this.state.loading)}
        {this.getPayCommissionAction(this.state.order, this.state.loading)}
        {this.getDeleteAction(this.state.order, this.state.loading)}
      </DropdownButton>
    );
  }
}
