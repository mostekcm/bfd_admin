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
          {displayItems.map((displayItem, index) => {
            const cost = formatCurrency(displayItem.cost, opts);
            const totalCost = formatCurrency(displayItem.cost * displayItem.quantity, opts);

            return <TableRow key={index}>
              <TableTextCell>{displayItem.name} for {displayItem.product.name}</TableTextCell>
              <TableTextCell>{displayItem.offsetMerch.sku.quantity} x {displayItem.offsetMerch.sku.product.name}, {displayItem.offsetMerch.sku.size}</TableTextCell>
              <TableTextCell>{cost}</TableTextCell>
              <TableTextCell>{displayItem.quantity}</TableTextCell>
              <TableTextCell>{totalCost}</TableTextCell>
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
