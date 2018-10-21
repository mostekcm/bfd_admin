import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import createForm from '../../../utils/createForm';

import {
  InputDate,
  InputText
} from '../../../Components/Dashboard';

export default createForm('updateShippingInfo', class ShippingInfoForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    autoUpdateDueDate: PropTypes.bool,
    paymentTerms: PropTypes.object,
    shippedDate: PropTypes.string,
    change: PropTypes.func
  };

  constructor() {
    super();
  }

  renderShippedDate() {
    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field component={InputDate}
                 name={'shippedDate'}
                 props={
                   {
                     fieldName: 'shippedDate', label:
                     'Shipped Date'
                   }
                 }
          />
        </div>
      </div>
    );
  }

  renderTermsError(error) {
    return <div className="col-xs-12">
      <div className="custom-field">
        ERROR: Must update store to get payment terms because: {error}!!!
      </div>
    </div>;
  }

  renderDueDate(autoUpdateDueDate, paymentTerms) {
    if (!paymentTerms || !paymentTerms.net) return this.renderTermsError("Payment terms not set in hubspot");

    const time = paymentTerms.net.split(' ')[1];

    if (!time && parseInt(time, 10) !== 0) return this.renderTermsError(`Bad format for NET: ${paymentTerms.net}`);

    if (autoUpdateDueDate) {
      const dueDate = moment(this.props.shippedDate).unix() + parseInt(time, 10) * 24 * 3600;
      const dueDateFormatted = moment.unix(dueDate).format('YYYY-MM-DD');
      this.props.change('dueDate', dueDateFormatted);
      return <div className="col-xs-12">
        <div className="custom-field">
          <label>Due Date</label>: <strong>{dueDateFormatted}</strong>
          <Field name="dueDate" component="input" type="hidden"/>
        </div>
      </div>;
    }

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field component={InputDate}
                 name={'dueDate'}
                 props={
                   {
                     fieldName: 'dueDate',
                     label: 'Due Date'
                   }
                 }
          />
        </div>
      </div>
    );
  }

  renderShippingCost(validationErrors) {
    const props = {
      fieldName: 'shipping',
      label: 'Shipping Cost',
      validationErrors: validationErrors
    };

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field name={'shipping'} component={InputText} props={props}/>
        </div>
      </div>
    );
  }

  render() {
    const validationErrors = {};

    const { autoUpdateDueDate, paymentTerms } = this.props;

    return (
      <form className="update-shipping-info-form form-horizontal" style={{ marginTop: '30px' }}>
        <div className={"row"}>
          {this.renderShippedDate()}
        </div>
        <div className={"row"}>
          {this.renderDueDate(autoUpdateDueDate, paymentTerms)}
        </div>
        <div className="row">
          {this.renderShippingCost(validationErrors)}
        </div>
        <Field name="orderId" component="input" type="hidden"/>
      </form>
    );
  }
});
