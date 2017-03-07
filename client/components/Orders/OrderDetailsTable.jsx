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

export default class OrderDetailsTable extends Component {
  static propTypes = {
    lineItems: React.PropTypes.array.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.lineItems !== this.props.lineItems;
  }

  render() {
    const { lineItems } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="25%">Product</TableColumn>
          <TableColumn width="15%">Unit Size</TableColumn>
          <TableColumn width="10%">Units per Case</TableColumn>
          <TableColumn width="10%">Cost per Unit</TableColumn>
          <TableColumn width="10%">Case Cost</TableColumn>
          <TableColumn width="10%">Qty Ordered</TableColumn>
          <TableColumn width="10%">Testers Ordered</TableColumn>
          <TableColumn width="10%">Sub Total</TableColumn>
        </TableHeader>
        <TableBody>
          {lineItems.map((lineItem, index) => {
              return <TableRow key={index}>
                <TableTextCell>{lineItem.sku.product.name}</TableTextCell>
                <TableTextCell>{lineItem.sku.size}</TableTextCell>
                <TableTextCell>{lineItem.size}</TableTextCell>
                <TableTextCell>${lineItem.cpu}</TableTextCell>
                <TableTextCell>{lineItem.cpu * lineItem.size}</TableTextCell>
                <TableTextCell>{lineItem.quantity}</TableTextCell>
                <TableTextCell>{lineItem.testers}</TableTextCell>
                <TableTextCell>${lineItem.cpu * lineItem.size * lineItem.quantity}</TableTextCell>
              </TableRow>;
          }
          )}
        </TableBody>
      </Table>
    );
  }
}
