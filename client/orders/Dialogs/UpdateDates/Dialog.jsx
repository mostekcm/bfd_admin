import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import moment from 'moment';

import { cancelUpdateDates, updateDates } from './actions';

import { Error, Confirm, InputDate } from '../../../components/Dashboard';

import './Dialog.css';

export default connectContainer(class UpdateDatesDialog extends Component {
  static stateToProps = (state) => ({
    updateState: state.updateDates
  });

  static actionsToProps = {
    cancelUpdate: cancelUpdateDates,
    update: updateDates
  };

  static propTypes = {
    cancelUpdate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.orderId = undefined;
    this.nextTargetShipDate = undefined;
    this.nextOrderDate = undefined;
    this.nextShipAsap = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.updateState !== this.props.updateState;
  }

  onConfirm = () => {
    const data = {
      date: moment(this.nextOrderDate.value).format('X'),
    };

    if (this.nextTargetShipDate) {
      data.targetShipDate = moment(this.nextTargetShipDate.value).format('X');
      data.dueDate = moment(this.nextTargetShipDate.value).format('X');
    }

    data.shipAsap = !!this.nextShipAsap.checked;

    this.props.update(this.orderId.value, data);
  };

  renderTargetShipDate(originalTargetShipDate, shippedDate) {
    if (shippedDate && shippedDate !== '') return null;

    return <div className="col-xs-12 col-md-12">
      <InputDate input={{
        ref: (nextValue => {
          return this.nextTargetShipDate = nextValue
        }),
        defaultValue: moment.unix(originalTargetShipDate).format('YYYY-MM-DD')
      }} fieldName='shippedDate' label='Target Ship Date'/>
    </div>;
  }

  render() {
    const { cancelUpdate } = this.props;
    const { orderId, originalTargetShipDate, originalShipAsap, shippedDate, originalDate, error, requesting, loading } = this.props.updateState.toJS();

    const className = `form-horizontal col-xs-12 dates-confirm-form`;

    return (
      <Confirm title={`Update Order Dates`} show={requesting === true} loading={loading} onCancel={cancelUpdate}
               onConfirm={this.onConfirm}>
        <Error message={error}/>
        <p>
          Change the Dates for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className={className} style={{ marginTop: '40px' }}>
            <div className="form-group">
              <div className="col-xs-12 col-md-12">
                <InputDate input={{
                  ref: (nextValue => {
                    return this.nextOrderDate = nextValue
                  }),
                  defaultValue: moment.unix(originalDate).format('YYYY-MM-DD')
                }} fieldName='orderDate' label='Order Date'/>
              </div>
              {this.renderTargetShipDate(originalTargetShipDate, shippedDate)}
              <div className="col-xs-12 col-md-12">
                <label htmlFor={'shipAsap'}>Ship ASAP?</label><br/>
                <input type={'checkbox'} name={'shipAsap'} ref={shipAsap => this.nextShipAsap = shipAsap} className={'checked'} defaultChecked={!!originalShipAsap}/>
              </div>
            </div>
            <input ref={orderId => this.orderId = orderId} type="hidden" readOnly="readonly" className="form-control"
                   value={orderId}/>
          </form>
        </div>
      </Confirm>
    );
  }
});

