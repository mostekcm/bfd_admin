import moment from 'moment';
import React, { Component } from 'react';
import DateTime from 'react-datetime';
import classNames from 'classnames';

import '../../../node_modules/react-datetime/css/react-datetime.css';

class InputDate extends Component {
  onChange = (event) => {
    const { field } = this.props;
    if (!field) return;
    field.onChange(event);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const { label, fieldName, validationErrors } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length
    });

    const defaultValueDateTime = this.props.input.defaultValue || moment().format('X');

    return (
      <div className={classes}>
        <label>{label}</label>
        <DateTime {...this.props.input} defaultValue={moment.unix(defaultValueDateTime).format('MM/DD/YYYY hh:mm A')} onChange={this.onChange} />
          {validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length && <div className="help-block">{validationErrors[fieldName][0]}</div>}
      </div>
    );
  }
}

InputDate.propTypes = {
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default InputDate;
