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

export default class OrderDisplayDetailsTable extends Component {
  static propTypes = {
    displayItems: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.displayItems !== this.props.displayItems;
  }

  getTotalOrderCost(displayItems) {
    let totalCost = 0;
    displayItems.forEach((displayItem) => {
      totalCost += displayItem.quantity * displayItem.cost;
    });
    return totalCost;
  }

  render() {
    const { displayItems } = this.props;
    // now include the currency symbol
    let opts = { format: '%s%v', symbol: '$' };
    const totalOrderCost = formatCurrency(this.getTotalOrderCost(displayItems), opts);
    const zero = formatCurrency(0, opts);

    const rows = [];

    displayItems && displayItems.map((displayItem) => {
      const cost = formatCurrency(displayItem.cost, opts);
      const totalCost = formatCurrency(displayItem.cost * displayItem.quantity, opts);
      const msrp = formatCurrency(displayItem.offsetMerch.sku.msrp, opts);

      rows.push({
        display: `${displayItem.name} for ${displayItem.product.name}`,
        offsetMerch: '',
        cost: cost,
        quantity: displayItem.quantity,
        total: totalCost
      });
      rows.push({
        display: '',
        offsetMerch: `${displayItem.offsetMerch.sku.product.name}, ${displayItem.offsetMerch.sku.size}`,
        cost: msrp,
        quantity: displayItem.offsetMerch.quantity,
        total: zero
      });
    });

    return (
      <Table>
        <TableHeader>
          <TableColumn width="30%">Display</TableColumn>
          <TableColumn width="30%">Offset Merch</TableColumn>
          <TableColumn width="10%">Cost</TableColumn>
          <TableColumn width="10%">Qty Ordered</TableColumn>
          <TableColumn width="10%">Sub Total</TableColumn>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            return <TableRow key={index}>
              <TableTextCell>{row.display}</TableTextCell>
              <TableTextCell>{row.offsetMerch}</TableTextCell>
              <TableTextCell>{row.cost}</TableTextCell>
              <TableTextCell>{row.quantity}</TableTextCell>
              <TableTextCell>{row.total}</TableTextCell>
            </TableRow>;
          })}
          <TableRow key={displayItems.length}>
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
