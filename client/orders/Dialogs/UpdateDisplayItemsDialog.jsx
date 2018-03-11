import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { orderActions } from '../../actions';
import { Error, Confirm } from '../../components/Dashboard';
import UpdateDisplayItemForm from '../../components/Orders/UpdateDisplayItemForm';
import { initializeDisplayItems } from '../../utils/initializeOrder';

import './UpdateDisplayItemsDialog.css';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    updateDisplayItemsState: state.updateDisplayItems,
    displays: state.displays.toJS().records
  });

  static actionsToProps = {
    ...orderActions
  };

  static propTypes = {
    cancelUpdateDisplayItems: PropTypes.func.isRequired,
    updateDisplayItems: PropTypes.func.isRequired,
    updateDisplayItemsState: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.form = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateDisplayItemsState !== this.props.updateDisplayItemsState;
  }

  onSubmit = (displayItemForm) => {
    const displayItems = _.filter(displayItemForm.displayItems, (item) => item.quantity && item.quantity > 0);

    this.props.updateDisplayItems(displayItemForm.orderId, displayItems);
  }

  onConfirm = () => {
    if (this.form) {
      try {
        this.form.submit();
      } catch(err) {
        console.error("error display items update submit: ", e.message);
      }
    }

  }

  render() {
    const { displays, cancelUpdateDisplayItems } = this.props;
    const { orderId, originalDisplayItems, error, requesting, loading } = this.props.updateDisplayItemsState.toJS();

    const initialValues = { orderId: orderId, displayItems: _.cloneDeep(originalDisplayItems) || [] };

    /* Default the show name and sales rep for now */
    initializeDisplayItems(initialValues, displays);

    const selector = formValueSelector('displayItemForm'); // <-- same as form name

    const ConnectedUpdateDisplayItemForm = connect(
      state => {
        const displayItems = selector(state, 'displayItems');
        const orderId = selector(state, 'orderId');
        return {
          initialValues: initialValues,
          orderId,
          displayItems
        }
      }, null, null, { withRef: true }
    )(UpdateDisplayItemForm);

    return (
      <Confirm title="Update Display Items" show={requesting===true} loading={loading}
               onCancel={cancelUpdateDisplayItems} onConfirm={this.onConfirm}
               dialogClassName={'display-item-form'}>
        <Error message={error} />
        <p>
          Change the display items for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <ConnectedUpdateDisplayItemForm
            ref={formInstance => this.form = formInstance && formInstance.getWrappedInstance()}
            onSubmit={this.onSubmit}
            loading={loading} />
        </div>
      </Confirm>
    );
  }
});
