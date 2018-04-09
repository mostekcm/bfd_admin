import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { InputCombo } from 'auth0-extension-ui';

import * as constants from '../../constants';

class ChooseShowForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    submitting: PropTypes.bool
  };

  renderShowDropDown(submitting) {
    return <Field
      name={'show'}
      type={'select'}
      component={InputCombo}
      label={'Show'}
      placeholder={'Choose a Show: '}
      options={constants.SHOW_LIST}
      disabled={submitting}
    />;
  }

  renderTimeDropDown(submitting) {
    const thisYear = moment().year();
    return <Field
      name={'year'}
      type={'select'}
      component={InputCombo}
      label={'Year'}
      placeholder={"Year: "}
      options={_.range(2017,thisYear+1).map(year => ({text:year, value:year}))}
      disabled={submitting}
    />;
  }

  render() {
    const {
      submitting
    } = this.props;

    return <div className={'row'}>
      <div className={'col-xs-12 col-md-9'}>
        {this.renderShowDropDown(submitting)}
      </div>
      <div className={'col-xs-12 col-md-9'}>
        {this.renderTimeDropDown(submitting)}
      </div>
    </div>;
  }
}

export const ChooseShowFormName = 'showForm';

export default (onSubmit) => reduxForm({
  form: ChooseShowFormName,
  onSubmit
})(ChooseShowForm);
