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
    });
    return totalCost;
  }

  render() {
    const { orders } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="25%">ID</TableColumn>
          <TableColumn width="45%">Customer Name</TableColumn>
          <TableColumn width="15%">LineItems</TableColumn>
          <TableColumn width="15%">TotalProductCost</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            console.log("Carlos, order: ", order);
              return <TableRow key={index}>
                <TableRouteCell
                  route={`/orders/${order.id}`}>{order.id}</TableRouteCell>
                <TableTextCell>{'Carlos add customer name'}</TableTextCell>
                <TableTextCell>{order.lineItems.length}</TableTextCell>
                <TableTextCell>${this.getTotalOrderCost(order)}</TableTextCell>
              </TableRow>;
          }
          )}
        </TableBody>
      </Table>
    );
  }
}
