import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class OrderActions extends Component {
  static propTypes = {
    updateShipping: PropTypes.func.isRequired,
    editOrder: PropTypes.func.isRequired,
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

  getUpdateShippingAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.updateShipping}>
      Update Shipping
    </MenuItem>
  )

  getEditAction = (order, loading) => (
    <MenuItem disabled={loading || false} onClick={this.editOrder}>
      Edit Order
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

  editOrder = () => {
    this.props.editOrder(this.state.order);
  }

  updateShipping = () => {
    this.props.updateShipping(this.state.order);
  }

  render() {
    if (!this.state.order) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="order-actions">
        {this.getPrintAction(this.state.loading)}
        {this.getUpdateShippingAction(this.state.order, this.state.loading)}
        {this.getEditAction(this.state.order, this.state.loading)}
        {this.getDeleteAction(this.state.order, this.state.loading)}
      </DropdownButton>
    );
  }
}
