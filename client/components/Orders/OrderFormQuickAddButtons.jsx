import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default class OrderFormQuickAddButtons extends Component {
  static propTypes = {
    packages: PropTypes.array,
    lineItems: PropTypes.array,
    change: PropTypes.func
  };

  constructor() {
    super();
  }

  addPackage(lineItemPackage) {
    this.props.lineItems.map((lineItem, index) => {
      const matchingCase = _.find(lineItemPackage.cases, aCase =>
        aCase.product.name === lineItem.sku.product.name &&
        aCase.size === lineItem.sku.size);
      if (matchingCase)
        this.props.change(`lineItems[${index}].quantity`, matchingCase.numCases);
    });
  }

  setTesters() {
    const setTesterFor = {};
    this.props.lineItems.map((lineItem, index) => {
      const key = lineItem.sku.product.name + lineItem.sku.variety;
      if (lineItem.quantity && !setTesterFor[key]) {
        setTesterFor[key] = true;
        this.props.change(`lineItems[${index}].tester.quantity`, 1);
      } else {
        this.props.change(`lineItems[${index}].tester.quantity`, null);
      }
    });
  }

  renderPackageButtons(packages) {
    return <div>
      {_.map(packages, (aPackage, index) => <Button key={index}
                                                    onClick={this.addPackage.bind(this, aPackage)}>{aPackage.name}</Button>)}
    </div>
  }

  render() {
    return (
      <div className={"row"}>
        <h3>Packages</h3>
        <div className={'pull-left'}>
          {this.renderPackageButtons(this.props.packages)}
        </div>
        <div className={'pull-right'}>
          <Button onClick={this.setTesters.bind(this)}>Set Testers</Button>
        </div>
      </div>
    );
  }
};
