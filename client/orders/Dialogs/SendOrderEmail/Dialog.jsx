import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';

import { cancelSendOrderEmail, sendOrderEmail } from './actions';

import { Error, Confirm, InputTextArea } from '../../../components/Dashboard';

export default connectContainer(class SendOrderEmailDialog extends Component {
  static stateToProps = (state) => ({
    sendOrderEmailState: state.sendOrderEmail
  });

  static actionsToProps = {
    cancel: cancelSendOrderEmail,
    sendOrderEmail
  };

  static propTypes = {
    cancel: PropTypes.func.isRequired,
    sendOrderEmail: PropTypes.func.isRequired,
    sendOrderEmailState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.emailText = undefined;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.sendOrderEmailState !== this.props.sendOrderEmailState;
  }

  onConfirm = () => {
    const { orderId, pdf } = this.props.sendOrderEmailState.toJS();
    this.props.sendOrderEmail(orderId, this.emailText.value, pdf);
  };

  render() {
    const { cancel } = this.props;
    const { orderId, pdf, emailText, error, loading } = this.props.sendOrderEmailState.toJS();

    const className = `form-horizontal col-xs-12 dates-confirm-form`;

    return (
      <Confirm title={`Send Order Email`} show={!!pdf} loading={loading} onCancel={cancel}
               onConfirm={this.onConfirm}>
        <Error message={error}/>
        <p>
          Send an email for <strong>{orderId}</strong>?
        </p>
        <div className="row">
          <form className={className} style={{ marginTop: '40px' }}>
            <div className="form-group">
              <div className="col-xs-12 col-md-12">
                <InputTextArea input={{
                  ref: (nextValue => {
                    return this.emailText = nextValue
                  }),
                  defaultValue: emailText
                }} fieldName='emailText' label='Email Text'/>
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});

