import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportDisplaysTable extends Component {
  static propTypes = {
    displays: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.displays !== this.props.displays;
  }

  render() {
    const { displays } = this.props;

    const displayItems = [];

    if (displays) {
      Object.keys(displays).forEach(productName =>
        displayItems.push({
          productName: productName,
          quantity: displays[productName].quantity,
        }));
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="35%">Product</TableColumn>
          <TableColumn width="10%">Quantity</TableColumn>
        </TableHeader>
        <TableBody>
          {displayItems.map((item, index) => {
            return <TableRow key={index}>
              <TableTextCell>{item.productName}</TableTextCell>
              <TableTextCell>{item.quantity}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
