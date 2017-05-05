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
      Object.keys(displays).forEach(name =>
        displayItems.push({
          productName: displays[name].product.name,
          name: name,
          quantity: displays[name].quantity,
        }));
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="35%">Name</TableColumn>
          <TableColumn width="35%">Product</TableColumn>
          <TableColumn width="10%">Quantity</TableColumn>
        </TableHeader>
        <TableBody>
          {displayItems.map((item, index) => {
            return <TableRow key={index}>
              <TableTextCell>{item.name}</TableTextCell>
              <TableTextCell>{item.productName}</TableTextCell>
              <TableTextCell>{item.quantity}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
