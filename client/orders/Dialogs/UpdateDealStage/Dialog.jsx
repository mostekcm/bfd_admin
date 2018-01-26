import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { cancelUpdateDealStage, updateDealStage } from './actions';

import { Error, Confirm } from '../../../components/Dashboard';

import './Dialog.css';
import InputCombo from '../../../components/Dashboard/InputCombo';

export default connectContainer(class UpdateDealStageDialog extends Component {
  static stateToProps = (state) => ({
    updateState: state.updateDealStage
  });

  static actionsToProps = {
    cancelUpdate: cancelUpdateDealStage,
    update: updateDealStage
  };

  static propTypes = {
    cancelUpdate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateState: PropTypes.object.isRequired
  }

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
      dealStage: this.nextDealStage.value
    };

    this.props.update(this.orderId.value, data);
  }

  render() {
    const { cancelUpdate } = this.props;
    const { orderId, invoiceNumber, shippedDate, originalDealStage, error, requesting, loading } = this.props.updateState.toJS();

    if (shippedDate) return null;

    const dealStages = ['Qualifying', 'Pending Approval', 'Approved', 'Closed Lost'];
    const dealOptions = _.map(dealStages, stage => ({ value: stage, text: stage }));

    const className = `form-horizontal col-xs-12 deal-stage-form`;

    return (
      <Confirm title={ `Update Deal Stage` } show={requesting===true} loading={loading} onCancel={cancelUpdate} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Change the Deal Stage for <strong>{invoiceNumber}</strong>?
        </p>
        <div className="row">
          <form className={className} style={{ marginTop: '40px' }}>
            <div className="form-group">
              <div className="col-xs-12 col-md-12">
                <InputCombo input={ { ref: (nextValue => { return this.nextDealStage = nextValue }),
                  defaultValue: originalDealStage } } options={dealOptions} fieldName='dealStage' label='Deal Stage' />
              </div>
            </div>
            <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
          </form>
        </div>
      </Confirm>
    );
  }
});

