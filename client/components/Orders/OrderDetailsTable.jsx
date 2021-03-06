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
    const itemCost = lineItem.cpu * lineItem.size * lineItem.quantity;
    return itemCost;
  }

  render() {
    const { lineItems } = this.props;
    // now include the currency symbol
    let opts = { format: '%s%v', symbol: '$' };

    const skuLineItems = _.filter(lineItems, item => item.quantity && item.quantity > 0);
    const totalOrderCost = formatCurrency(this.getTotalOrderCost(skuLineItems), opts);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="24%">Product</TableColumn>
          <TableColumn width="20%">Variety</TableColumn>
          <TableColumn width="8%">Unit Size</TableColumn>
          <TableColumn width="8%">Cost per Unit</TableColumn>
          <TableColumn width="8%">Units per Case</TableColumn>
          <TableColumn width="8%">Case Cost</TableColumn>
          <TableColumn width="8%"># Cases</TableColumn>
          <TableColumn width="8%"># Units</TableColumn>
          <TableColumn width="8%">Sub Total</TableColumn>
        </TableHeader>
        <TableBody>
          {skuLineItems.map((lineItem, index) => {
            const cpu = formatCurrency(lineItem.cpu, opts);
            const costPerCase = formatCurrency(lineItem.cpu * lineItem.size, opts);
            const totalCost = formatCurrency(this.getRowCost(lineItem), opts);
            const numUnits = Math.round(parseFloat(lineItem.quantity) * parseInt(lineItem.size, 10));

            return <TableRow key={index}>
              <TableTextCell>{lineItem.sku.product.name}</TableTextCell>
              <TableTextCell>{lineItem.sku.variety}</TableTextCell>
              <TableTextCell>{lineItem.sku.size}</TableTextCell>
              <TableTextCell>{cpu}</TableTextCell>
              <TableTextCell>{lineItem.size}</TableTextCell>
              <TableTextCell>{costPerCase}</TableTextCell>
              <TableTextCell>{lineItem.quantity}</TableTextCell>
              <TableTextCell>{numUnits}</TableTextCell>
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
            <TableTextCell colSpan={2} className={'text-right'}>Product SubTotal</TableTextCell>
            <TableTextCell>{totalOrderCost}</TableTextCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
