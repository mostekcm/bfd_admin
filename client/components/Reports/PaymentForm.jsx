import React, { PropTypes, Component } from 'react';

import { Field } from 'redux-form';

import createForm from '../../utils/createForm';

import {
  InputDate
} from '../Dashboard';

export default createForm('payments', class PaymentForm extends Component {
  static propTypes = {
    startDate: PropTypes.date,
    onSubmit: PropTypes.func
  };

  constructor() {
    super();
  }

  renderDateField(name, label, validationErrors) {
    const props = {
      fieldName: name,
      label: label,
      validationErrors: validationErrors
    };

    return (
      <div className="col-xs-12">
        <div className="custom-field">
          <Field name={name} component={InputDate} props={props}/>
        </div>
      </div>
    );
  }

  render() {
    const validationErrors = {};

    return (
      <form className="payment-form form-horizontal" style={{ marginTop: '30px' }} onSubmit={this.props.onSubmit}>
        <div className="row">
          {this.renderDateField('startDate', 'Start Date', validationErrors)}
        </div>
      </form>
    );
  }
});
