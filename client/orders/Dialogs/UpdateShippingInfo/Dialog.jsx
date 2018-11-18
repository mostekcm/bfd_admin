import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import moment from 'moment';

import { cancelUpdateShippingInfo, updateShippingInfo } from './actions';
import ShippingInfoForm from './ShippingInfoForm';

import { Error, Confirm } from '../../../components/Dashboard';

import './Dialog.css';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

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

    this.form = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateState !== this.props.updateState;
  }

  onSubmit = (shippingInfo) => {
    const data = {
      shippedDate: moment(shippingInfo.shippedDate).unix(),
      dueDate: moment(shippingInfo.dueDate).unix(),
      shipping: shippingInfo.shipping
    };

    this.props.update(shippingInfo.orderId, data);
  };

  onConfirm = () => {
    if (this.form) {
      try {
        this.form.submit();
      } catch(err) {
        console.error("error submitting shipping info: ", err.message);
      }
    }
  };

  render() {
    const { cancelUpdate } = this.props;
    const { record, autoUpdateDueDate, paymentTerms, error, requesting, loading } = this.props.updateState.toJS();

    // const className = `form-horizontal col-xs-12 shipping-info-confirm-form`;

    const initialValues = _.cloneDeep(record);

    initialValues.shippedDate = initialValues.shippedDate ? moment.unix(initialValues.shippedDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'); // this will intentionally
    initialValues.dueDate = initialValues.dueDate ? moment.unix(initialValues.dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'); // this will intentionally
    // set this to today if shippedDate is undefined

    const selector = formValueSelector('updateShippingInfo'); // <-- same as form name

    const ConnectedShippingForm = connect(
      state => {
        const dueDate = selector(state, 'dueDate');
        const shippedDate = selector(state, 'shippedDate');
        return {
          initialValues,
          dueDate,
          shippedDate
        }
      }, null, null, { withRef: true }
    )(ShippingInfoForm);

    return (
      <Confirm title={`Update Order Shipping Info`} show={requesting === true} loading={loading} onCancel={cancelUpdate}
               onConfirm={this.onConfirm} dialogClassName={'update-shipping-info-form'}>
        <Error message={error}/>
        <p>
          Change the Shipping Info for <strong>{initialValues.orderId}</strong>?
        </p>
        <ConnectedShippingForm
          ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
          autoUpdateDueDate={autoUpdateDueDate}
          paymentTerms={paymentTerms}
          onSubmit={this.onSubmit}
          loading={loading} />
      </Confirm>
    );
  }
});

