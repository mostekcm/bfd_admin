import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { Error, Confirm } from '../../../components/Dashboard';

const createUpdateDialog = (infoName, stateName, cancelUpdateFunc, updateFunc, getValueFunc, InputComponent) => connectContainer(class extends Component {
    static stateToProps = (state) => ({
      updateState: state[stateName]
    });

    static actionsToProps = {
      cancelUpdate: cancelUpdateFunc,
      update: updateFunc
    };

    static propTypes = {
      cancelUpdate: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
      updateState: PropTypes.object.isRequired
    }

    constructor() {
      super();
      this.orderId = undefined;
      this.nextValue = undefined;
    }

    shouldComponentUpdate(nextProps) {
      return nextProps.updateState !== this.props.updateState;
    }

    onConfirm = () => {
      this.props.update(this.orderId.value, getValueFunc(this.nextValue));
    }

    render() {
      const { cancelUpdate } = this.props;
      const { orderId, originalValue, error, requesting, loading } = this.props.updateState.toJS();

      const className = `form-horizontal col-xs-12 ${infoName}-confirm-form`;

      return (
        <Confirm title={ `Update Order ${infoName}` } show={requesting===true} loading={loading} onCancel={cancelUpdate} onConfirm={this.onConfirm}>
          <Error message={error} />
          <p>
            Change the { infoName } for <strong>{orderId}</strong>?
          </p>
          <div className="row">
            <form className={className} style={{ marginTop: '40px' }}>
              <div className="form-group">
                <div className="col-xs-9">
                  <InputComponent input={ { ref: (nextValue => { return this.nextValue = nextValue }),
                    defaultValue: originalValue } } fieldName={infoName} label={infoName} />
                </div>
              </div>
              <input ref={ orderId => this.orderId = orderId } type="hidden" readOnly="readonly" className="form-control" value={orderId} />
            </form>
          </div>
        </Confirm>
      );
    }
  });

export default createUpdateDialog;
