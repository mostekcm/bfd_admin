import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { orderActions } from '../../actions';
import { Error, Confirm } from '../../components/Dashboard';
import { UpdateLineItemForm } from '../../components/Orders';
import { initializeLineItems } from '../../utils/initializeOrder';

import './UpdateLineItemsDialog.css';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    updateLineItemsState: state.updateLineItems,
    cases: state.cases
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    cancelUpdateLineItems: PropTypes.func.isRequired,
    updateLineItems: PropTypes.func.isRequired,
    updateLineItemsState: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.form = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateLineItemsState !== this.props.updateLineItemsState;
  }

  onSubmit = (lineItemForm) => {
    const lineItems = _.filter(lineItemForm.lineItems, (item) => item.quantity && item.quantity > 0);

    this.props.updateLineItems(lineItemForm.orderId, lineItems);
  }

  onConfirm = () => {
    if (this.form) {
      this.form.submit()
        .catch(e => console.error("error line items update: ", e.message));
    }

  }

  render() {
    const { cancelUpdateDiscount } = this.props;
    const { orderId, originalLineItems, error, requesting, loading } = this.props.updateLineItemsState.toJS();

    const cases = this.props.cases.toJS().records;

    const initialValues = { orderId: orderId, lineItems: JSON.parse(JSON.stringify(originalLineItems)) };

    /* Default the show name and sales rep for now */
    initializeLineItems(initialValues, cases);

    const selector = formValueSelector('lineItemForm'); // <-- same as form name

    const ConnectedUpdateLineItemForm = connect(
      state => {
        const lineItems = selector(state, 'lineItems');
        const orderId = selector(state, 'orderId');
        return {
          initialValues: initialValues,
          orderId,
          lineItems
        }
      }, null, null, { withRef: true }
    )(UpdateLineItemForm);

    return (
      <Confirm title="Update Line Items" show={requesting===true} loading={loading}
               onCancel={this.props.cancelUpdateLineItems} onConfirm={this.onConfirm}
               dialogClassName={'line-item-form'}>
        <Error message={error} />
        <p>
          Change the line items for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <ConnectedUpdateLineItemForm
            ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
            onSubmit={this.onSubmit}
            loading={loading} />
        </div>
      </Confirm>
    );
  }
});
