import React, { Component } from 'react';
import classNames from 'classnames';

class InputText extends Component {
  render() {
    const { label, fieldName, validationErrors } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length
    });

    return <div className={classes}>
      { label ? <label>{label}</label> : '' }
      <input className="form-control"  {...this.props.input} />
      { validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length && <div className="help-block">{ validationErrors[fieldName][0] }</div> }
    </div>;
  }
}

InputText.propTypes = {
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default InputText;
