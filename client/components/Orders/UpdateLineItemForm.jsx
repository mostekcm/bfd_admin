import React, { PropTypes, Component } from 'react';

import { Field, FieldArray } from 'redux-form';

import { OrderFormLineItems } from './';

import createForm from '../../utils/createForm';

export default createForm('lineItemForm', class UpdateLineItemForm extends Component {
  static propTypes = {
    orderId: PropTypes.string,
    lineItems: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    initialValues: PropTypes.object
  };

  render() {
    return (
      <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
        <div className="row">
          <h3>Products</h3>
          <div className="col-xs-12">
            <FieldArray name='lineItems' component={OrderFormLineItems}
                        props={ { loading: this.props.loading, lineItems: this.props.lineItems } }/>
          </div>
        </div>
        <Field name="orderId" component="input" type="hidden" value={this.props.orderId} />
      </form>
    );
  }
});
