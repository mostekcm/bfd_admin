import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';

import { cancelPayCommission, payCommission } from './actions';

import { Error, Confirm, InputDate, InputCombo } from '../../../components/Dashboard';

import { getPaidCommissionData } from '../../utils';

import './Dialog.css';

export default connectContainer(class PayCommission extends Component {
  static stateToProps = (state) => ({
    updateState: state.payCommission
  });

  static actionsToProps = {
    cancelUpdate: cancelPayCommission,
    update: payCommission
  };

  static propTypes = {
    cancelUpdate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateState: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.orderId = undefined;
    this.payee = undefined;
    this.paidDate = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateState !== this.props.updateState;
  }

  onConfirm = () => {
    const payee = this.payee.value;
    const paidDate = moment(this.paidDate.state.inputValue).format('X');
    const { commissions, commissionInfo } = this.props.updateState.toJS();
    this.props.update(this.orderId.value, getPaidCommissionData(commissions, commissionInfo, payee, paidDate, this.orderId.value));
  }

  renderCommissionPayees(commissions, validationErrors) {
    const payeeOptions = [
      {
        text: 'Max Bentley',
        value: 'max'
      },
      {
        text: 'Jes Mostek',
        value: 'jes'
      }
    ];

    const paidPayees = _(commissions).filter(commission => commission.paidDate).map(commission => commission.payee).value();

    const unpaidOptions = _(payeeOptions).filter(option => paidPayees.indexOf(option.value) < 0).value();

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <InputCombo input={ { ref: (payee => this.payee = payee) } } options={unpaidOptions} fieldName="payee" label='Payee' validationErrors={validationErrors} />
        </div>
      </div>
    );
  }


  render() {
    const { cancelUpdate } = this.props;
    const { orderId, error, commissions, requesting, loading, validationErrors } = this.props.updateState.toJS();

    const className = `form-horizontal col-xs-12 shipping-info-confirm-form`;
    
    const now = moment().format('X');

    return (
      <Confirm title={ `Update Order Shipping Info` } show={requesting===true} loading={loading} onCancel={cancelUpdate} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Set commission as paid for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className={className} style={{ marginTop: '40px' }}>
            <div className="form-group">
              <div className="col-xs-12">
                {this.renderCommissionPayees(commissions, validationErrors)}
              </div>
              <div className="col-xs-12 col-md-12">
                <InputDate input={ { ref: (nextValue => { return this.paidDate = nextValue }),
                  defaultValue: now } } fieldName='paidDate' label='Paid Date' />
              </div>
            </div>
            <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
          </form>
        </div>
      </Confirm>
    );
  }
});

