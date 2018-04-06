import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'react-bootstrap';

import { InputCombo } from 'auth0-extension-ui';

class ChooseShowForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    clients: PropTypes.array,
    running: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired
  };

  renderButton(running, submitting, handleSubmit) {
    return <Button bsSize="large" bsStyle="primary" disabled={submitting}
                   onClick={handleSubmit}>
      {running ? 'Extend Timer' : 'Start Timer'}
    </Button>;
  }

  renderClientDropDown(clients, running, submitting) {
    return <Field
      name={'clientID'}
      type={'select'}
      component={InputCombo}
      label={'Client'}
      placeholder={'Choose a client: '}
      options={_.map(clients, client => ({ text: client.name, value: client.client_id }))}
      disabled={submitting || running}
    />;
  }

  renderTimeDropDown(clients, running, submitting) {
    return <Field
      name={'amount'}
      type={'select'}
      component={InputCombo}
      label={'Time'}
      placeholder={'Amount:'}
      options={[{text: '1 minute', value: 1}, {text: '5 minutes', value: 5}]}
      disabled={submitting || running}
    />;
  }

  render() {
    const {
      clients,
      running,
      submitting,
      handleSubmit
    } = this.props;

    return <div className={'row'}>
      <div className={'col-xs-12 col-md-9'}>
        {this.renderClientDropDown(clients, running, submitting)}
      </div>
      <div className={'col-xs-12 col-md-9'}>
        {this.renderTimeDropDown(submitting)}
      </div>
      <div className={'col-xs-12 col-md-3 pull-right'}>
        <Button bsSize="large" bsStyle="primary" disabled={submitting}
                onClick carlos you were here, need to make this a push={handleSubmit}>
          Get
        </Button>      </div>
    </div>;
  }
}

const reduxFormDecorator = reduxForm({
  form: 'controls'
});

export const ControlsForm = reduxFormDecorator(ControlsFormBase);
export default ControlsForm;
