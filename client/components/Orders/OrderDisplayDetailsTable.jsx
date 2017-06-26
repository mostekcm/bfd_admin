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

      rows.push({
        display: displayItem.product.name.length > 0 ? `${displayItem.name} for ${displayItem.product.name}` : displayItem.name,
        cost: cost,
        quantity: displayItem.quantity,
        total: totalCost
      });
      console.log(rows[rows.length - 1]);
      displayItem.offsetMerch.forEach((offsetMerch) => {
        const offsetQuantity = parseFloat(offsetMerch.quantity) * parseFloat(displayItem.quantity);
        const totalRetail = formatCurrency(parseFloat(offsetMerch.sku.msrp) * offsetQuantity, opts);
        if (offsetMerch.sku.product.name.length > 0) {
          rows.push({
            display: '',
            offsetMerch: `${offsetMerch.sku.product.name}, ${offsetMerch.sku.size}`,
            offsetMerchValue: `Total Retail Value: ${totalRetail}`,
            cost: '',
            quantity: offsetQuantity,
            total: ''
          });
        }
      });
    });

    return (

      <Table>
        <TableHeader>
          <TableColumn width="30%">Display</TableColumn>
          <TableColumn width="40%">Offset Merch</TableColumn>
          <TableColumn width="10%">Quantity</TableColumn>
          <TableColumn width="10%">Cost</TableColumn>
          <TableColumn width="10%">Total Cost</TableColumn>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            return <TableRow key={index}>
              <TableTextCell>{row.display}</TableTextCell>
              <TableTextCell>{row.offsetMerch ? <span>{row.offsetMerch}<br />{row.offsetMerchValue}</span> : ''}</TableTextCell>
              <TableTextCell>{row.quantity}</TableTextCell>
              <TableTextCell>{row.cost}</TableTextCell>
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
    )
      ;
  }
}
