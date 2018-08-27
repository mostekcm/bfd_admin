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
    const { order, pdf } = this.props.sendOrderEmailState.toJS();
    this.props.sendOrderEmail(order.id, this.emailText.value, pdf);
  };

  render() {
    const { cancel } = this.props;
    const { order: { id: orderId, totals, dealStage }, pdf, emailText, error, loading } = this.props.sendOrderEmailState.toJS();

    const className = `form-horizontal col-xs-12 dates-confirm-form`;

    let defaultEmailText = emailText;
    if (!defaultEmailText) {
      if (dealStage === 'Closed Won') {
        if (Math.abs(totals.owed) < 0.01) {
          defaultEmailText = `Please find a copy of your paid invoice attached.`;
        } else {
          defaultEmailText = `Please find a copy of your invoice attached.`;
        }
      } else {
        defaultEmailText = `A copy of your order confirmation is attached.  Please let me know if it is what you want and we will get it shipped out for you!`;
      }
    }

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
                  defaultValue: defaultEmailText
                }} fieldName='emailText' label='Email Text'/>
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});

