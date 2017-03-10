import React, { Component } from 'react';
import { Field } from 'redux-form';
import formatCurrency from 'format-currency';

import {
  InputText,
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class OrderFormDisplayItems extends Component {
  static propTypes = {
    displayItems: React.PropTypes.array.isRequired,
    fields: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fields !== this.props.fields || nextProps.displayItems !== this.props.displayItems;
  }

  render() {
    const { fields } = this.props;

    const opts = { format: '%s%v', symbol: '$' };

    const displayItems = this.props.displayItems || [];

    let total = 0;
    if (displayItems) displayItems.forEach(display => { if (display.quantity) total += display.quantity * display.cost });

    return (
      <Table>
        <TableHeader>
          <TableColumn width="30%">Display</TableColumn>
          <TableColumn width="10%">Offset Merch Qty</TableColumn>
          <TableColumn width="30%">Offset Merch</TableColumn>
          <TableColumn width="10%">Cost</TableColumn>
          <TableColumn width="10%">Qty</TableColumn>
          <TableColumn width="10%">Subtotal</TableColumn>
        </TableHeader>
        <TableBody>
          {fields.map((fieldName, index) => {
              if (!displayItems) return <div></div>;
              const display = displayItems[index];
              return <TableRow key={ index }>
                <TableTextCell>{display.name} for {display.product.name}</TableTextCell>
                <TableTextCell>{display.offsetMerch.quantity}</TableTextCell>
                <TableTextCell>{display.offsetMerch.sku.product.name}, {display.offsetMerch.sku.size}</TableTextCell>
                <TableTextCell>{formatCurrency(display.cost, opts)}</TableTextCell>
                <TableTextCell>
                  <Field component={InputText} name={`${fieldName}.quantity`} type='text'
                         props={{ fieldName: 'quantity', label: '' }}/>
                </TableTextCell>
                <TableTextCell>{display.quantity ? formatCurrency(display.quantity * display.cost, opts) : ''}</TableTextCell>
              </TableRow>;
            }
          )}
          <TableRow key={ fields.length }>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell>Total For Displays</TableTextCell>
            <TableTextCell>{formatCurrency(total, opts)}</TableTextCell>
          </TableRow>;
        </TableBody>
      </Table>
    );
  }
}
