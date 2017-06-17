import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { orderActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    updateDiscountState: state.updateDiscount
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cancelUpdateDiscount: PropTypes.func.isRequired,
    updateDiscount: PropTypes.func.isRequired,
    updateDiscountState: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.orderId = undefined;
    this.nextDiscount = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateDiscountState !== this.props.updateDiscountState;
  }

  onConfirm = () => {
    this.props.updateDiscount(this.orderId.value, this.nextDiscount.value);
  }

  render() {
    const { cancelUpdateDiscount } = this.props;
    const { orderId, originalDiscount, error, requesting, loading } = this.props.updateDiscountState.toJS();

    return (
      <Confirm title="Update Discount" show={requesting===true} loading={loading} onCancel={cancelUpdateDiscount} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Change the discount for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label className="col-xs-2 control-label">Discount</label>
              <div className="col-xs-9">
                <input ref={ nextDiscount => this.nextDiscount = nextDiscount } type="text" className="form-control" defaultValue={originalDiscount} />
              </div>
            </div>
            <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
          </form>
        </div>
      </Confirm>
    );
  }
});
