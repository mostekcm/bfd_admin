import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import moment from 'moment';

import { cancelUpdateShippingInfo, updateShippingInfo } from './actions';

import { Error, Confirm, InputDate, InputText } from '../../../components/Dashboard';

import './Dialog.css';

export default connectContainer(class UpdateShippingInfoDialog extends Component {
  static stateToProps = (state) => ({
    updateState: state.updateShippingInfo
  });

  static actionsToProps = {
    cancelUpdate: cancelUpdateShippingInfo,
    update: updateShippingInfo
  };

  static propTypes = {
    cancelUpdate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateState: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.orderId = undefined;
    this.nextShippedDate = undefined;
    this.nextShippingCost = undefined;
    this.nextDueDate = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateState !== this.props.updateState;
  }

  onConfirm = () => {
    const data = {
      shippedDate: moment(this.nextShippedDate.value).format('X'),
      dueDate: moment(this.nextDueDate.value).format('X'),
      shipping: this.nextShippingCost.value
    };

    this.props.update(this.orderId.value, data);
  };

  render() {
    const { cancelUpdate } = this.props;
    const { orderId, originalShippedDate, originalShippingCost, originalDueDate, error, requesting, loading } = this.props.updateState.toJS();

    const className = `form-horizontal col-xs-12 shipping-info-confirm-form`;
    const shippedDate = originalShippedDate || moment().unix();
    const originalShippedDateFormatted = moment.unix(shippedDate).format('YYYY-MM-DD');
    const originalDueDateFormatted = moment.unix(originalDueDate).format('YYYY-MM-DD');

    return (
      <Confirm title={ `Update Order Shipping Info` } show={requesting===true} loading={loading} onCancel={cancelUpdate} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Change the Shipping Info for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className={className} style={{ marginTop: '40px' }}>
            <div className="form-group">
              <div className="col-xs-12 col-md-12">
                <InputDate input={ { ref: (nextValue => { return this.nextShippedDate = nextValue }),
                  defaultValue: originalShippedDateFormatted } } fieldName='shippedDate' label='Shipped Date' />
              </div>
              <div className="col-xs-12 col-md-12">
                <InputDate input={ { ref: (nextValue => { return this.nextDueDate = nextValue }),
                  defaultValue: originalDueDateFormatted } } fieldName='dueDate' label='Due Date' />
              </div>
              <div className="col-xs-12 col-md-12">
                <InputText input={ { ref: (nextValue => { return this.nextShippingCost = nextValue }),
                  defaultValue: originalShippingCost } } fieldName='shippingCost' label='Shipping Cost' />
              </div>
            </div>
            <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
          </form>
        </div>
      </Confirm>
    );
  }
});

