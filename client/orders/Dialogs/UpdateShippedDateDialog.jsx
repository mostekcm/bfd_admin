import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { orderActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    updateShippedDateState: state.updateShippedDate
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cancelUpdateShipping: PropTypes.func.isRequired,
    updateShippedDate: PropTypes.func.isRequired,
    updateShippedDateState: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.orderId = undefined;
    this.nextShippedDate = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateShippedDateState !== this.props.updateShippedDateState;
  }

  onConfirm = () => {
    this.props.updateShippedDate(this.orderId.value, this.nextShippedDate.value);
  }

  render() {
    const { cancelUpdateShipping } = this.props;
    const { orderId, originalShipping, error, requesting, loading } = this.props.updateShippedDateState.toJS();

    return (
      <Confirm title="Update Shipping" show={requesting===true} loading={loading} onCancel={cancelUpdateShipping} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Change the shipping for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label className="col-xs-2 control-label">Shipping</label>
              <div className="col-xs-9">
                <input ref={ nextShippedDate => this.nextShippedDate = nextShippedDate } type="text" className="form-control" defaultValue={originalShipping} />
              </div>
            </div>
            <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
          </form>
        </div>
      </Confirm>
    );
  }
});
