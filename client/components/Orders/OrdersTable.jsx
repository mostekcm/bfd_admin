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

export default class OrdersTable extends Component {
  static propTypes = {
    orders: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orders !== this.props.orders;
  }

  getTotalOrderCost(order) {
    let totalCost = 0;
    order.lineItems.forEach((lineItem) => {
      totalCost += lineItem.quantity * lineItem.cpu * lineItem.size;
      totalCost += lineItem.tester.quantity ? lineItem.tester.quantity * lineItem.tester.cpu : 0;
    });
    return totalCost;
  }

  render() {
    const { orders } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="10%">ID</TableColumn>
          <TableColumn width="15%">Show</TableColumn>
          <TableColumn width="30%">Store</TableColumn>
          <TableColumn width="30%">Contact</TableColumn>
          <TableColumn width="8%">#Items</TableColumn>
          <TableColumn width="7%">Total</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            return <TableRow key={index}>
              <TableRouteCell
                route={`/orders/${order.id}`}>{order.id}</TableRouteCell>
              <TableTextCell>{order.show.name}</TableTextCell>
              <TableTextCell>{order.store.name}</TableTextCell>
              <TableTextCell>{order.store.contact}</TableTextCell>
              <TableTextCell>{order.lineItems.length}</TableTextCell>
              <TableTextCell>${this.getTotalOrderCost(order)}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
