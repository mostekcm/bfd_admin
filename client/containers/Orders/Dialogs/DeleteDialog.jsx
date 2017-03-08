import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { orderActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    orderDelete: state.orderDelete
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cancelDeleteOrder: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    orderDelete: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orderDelete !== this.props.orderDelete;
  }

  onConfirm = () => {
    this.props.deleteOrder();
  }

  render() {
    const { cancelDeleteOrder } = this.props;
    const { orderId, error, requesting, loading } = this.props.orderDelete.toJS();

    return (
      <Confirm title="Delete Order?" show={requesting} loading={loading} onCancel={cancelDeleteOrder} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to delete order: <strong>{orderId}</strong>?
          This will completely remove the order and cannot be undone.
        </p>
      </Confirm>
    );
  }
});
