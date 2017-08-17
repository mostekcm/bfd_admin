import React, { Component } from 'react';
import formatCurrency from 'format-currency';

import {
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class OrderDetailsTable extends Component {
  static propTypes = {
    lineItems: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.lineItems !== this.props.lineItems;
  }

  getTotalOrderCost(lineItems) {
    let totalCost = 0;
    lineItems.forEach((lineItem) => {
      totalCost += this.getRowCost(lineItem);
    });
    return totalCost;
  }

  getRowCost(lineItem) {
    const testerCost = lineItem.tester.quantity > 0 ? lineItem.tester.quantity * lineItem.tester.cpu : 0;
    return testerCost;
  }

  render() {
    const { lineItems } = this.props;
    // now include the currency symbol
    let opts = { format: '%s%v', symbol: '$' };
    const totalOrderCost = formatCurrency(this.getTotalOrderCost(lineItems), opts);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="35%">Tester</TableColumn>
          <TableColumn width="35%">Variety</TableColumn>
          <TableColumn width="10%">Cost per Unit</TableColumn>
          <TableColumn width="10%">Qty Ordered</TableColumn>
          <TableColumn width="10%">Sub Total</TableColumn>
        </TableHeader>
        <TableBody>
          {lineItems.map((lineItem, index) => {
            if (!lineItem.tester.quantity || lineItem.tester.quantity <= 0) return '';

            const cpu = formatCurrency(lineItem.tester.cpu, opts);
            const totalCost = formatCurrency(this.getRowCost(lineItem), opts);

            return <TableRow key={index}>
              <TableTextCell>{lineItem.sku.product.name}</TableTextCell>
              <TableTextCell>{lineItem.sku.variety}</TableTextCell>
              <TableTextCell>{cpu}</TableTextCell>
              <TableTextCell>{lineItem.tester.quantity}</TableTextCell>
              <TableTextCell>{totalCost}</TableTextCell>
            </TableRow>;
          })}
          <TableRow key={lineItems.length}>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell>Total</TableTextCell>
            <TableTextCell>{totalOrderCost}</TableTextCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
