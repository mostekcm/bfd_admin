import React, { PropTypes, Component } from 'react';

import { Field, FieldArray } from 'redux-form';

import UpdatePaymentFields from './UpdatePaymentFields';

import createForm from '../../utils/createForm';

export default createForm('updatePaymentsForm', class UpdatePaymentForm extends Component {
  static propTypes = {
    orderId: PropTypes.string,
    totalCost: PropTypes.number,
    payments: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    initialValues: PropTypes.object
  };

  render() {
    return (
      <form className="payments-form form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
        <div className="row">
          <h3>Products</h3>
          <div className="col-xs-12">
            <FieldArray name='payments' component={UpdatePaymentFields}
                        props={ {
                          loading: this.props.loading,
                          payments: this.props.payments,
                          totalCost: this.props.totalCost
                        } }/>
          </div>
        </div>
        <Field name="orderId" component="input" type="hidden" value={this.props.orderId} />
      </form>
    );
  }
});
