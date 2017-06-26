import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class OrderActions extends Component {
  static propTypes = {
    updateDiscount: PropTypes.func.isRequired,
    updateShipping: PropTypes.func.isRequired,
    updateShippedDate: PropTypes.func.isRequired,
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

  getUpdateShippingAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateShipping}>
      Update Shipping
    </MenuItem>
  )

  getUpdateShippedDateAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateShippedDate}>
      Update Shipped Date
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

  updateShipping = () => {
    this.props.updateShipping(this.state.order);
  }

  updateShippedDate = () => {
    this.props.updateShippedDate(this.state.order);
  }

  render() {
    if (!this.state.order) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="order-actions">
        {this.getPrintAction(this.state.loading)}
        {this.getUpdateDiscountAction(this.state.order, this.state.loading)}
        {this.getUpdateShippingAction(this.state.order, this.state.loading)}
        {this.getUpdateShippedDateAction(this.state.order, this.state.loading)}
        {this.getUpdateLineItemsAction(this.state.order, this.state.loading)}
        {this.getDeleteAction(this.state.order, this.state.loading)}
      </DropdownButton>
    );
  }
}
