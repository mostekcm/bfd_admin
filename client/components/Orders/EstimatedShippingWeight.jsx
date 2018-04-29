import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class EstimatedShippingWeight extends Component {
  static propTypes = {
    weight: PropTypes.number.isRequired,
    label: PropTypes.string
  };

  render() {
    const { weight, label } = this.props;
    const weightWithPackingMaterials = parseFloat(weight) * 1.15 + 16.1;
    const weightInPoundsFloat = weightWithPackingMaterials / 16.0;
    let weightInPounds = Math.ceil(weightInPoundsFloat);

    return <div>
      { label || 'ESTIMATED SHIPPING WEIGHT'}: {weightInPounds} lbs
    </div>;
  }
};
