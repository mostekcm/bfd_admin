import React, { Component } from 'react';

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
import formatCurrency from 'format-currency';

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
      totalCost += lineItem.quantity * lineItem.cpu * lineItem.size;
    });
    return totalCost;
  }

  render() {
    const { lineItems } = this.props;
    // now include the currency symbol
    let opts = { format: '%s%v', symbol: '$' };
    const totalOrderCost = formatCurrency(this.getTotalOrderCost(lineItems), opts);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="24%">Product</TableColumn>
          <TableColumn width="20%">Variety</TableColumn>
          <TableColumn width="8%">Unit Size</TableColumn>
          <TableColumn width="8%">Cost per Unit</TableColumn>
          <TableColumn width="8%">Units per Case</TableColumn>
          <TableColumn width="8%">Case Cost</TableColumn>
          <TableColumn width="8%">Qty Ordered</TableColumn>
          <TableColumn width="8%">Testers Ordered</TableColumn>
          <TableColumn width="8%">Sub Total</TableColumn>
        </TableHeader>
        <TableBody>
          {lineItems.map((lineItem, index) => {
            const cpu = formatCurrency(lineItem.cpu, opts);
            const costPerCase = formatCurrency(lineItem.cpu * lineItem.size, opts);
            const totalCost = formatCurrency(lineItem.cpu * lineItem.size * lineItem.quantity, opts);

            return <TableRow key={index}>
              <TableTextCell>{lineItem.sku.product.name}</TableTextCell>
              <TableTextCell>{lineItem.sku.variety}</TableTextCell>
              <TableTextCell>{lineItem.sku.size}</TableTextCell>
              <TableTextCell>{cpu}</TableTextCell>
              <TableTextCell>{lineItem.size}</TableTextCell>
              <TableTextCell>{costPerCase}</TableTextCell>
              <TableTextCell>{lineItem.quantity}</TableTextCell>
              <TableTextCell>{lineItem.testers}</TableTextCell>
              <TableTextCell>{totalCost}</TableTextCell>
            </TableRow>;
          })}
          <TableRow key={lineItems.length}>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
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
