import React, { Component } from 'react';
import { Field } from 'redux-form';
import formatCurrency from 'format-currency';

import {
  InputText,
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class OrderFormLineItems extends Component {
  static propTypes = {
    lineItems: React.PropTypes.array.isRequired,
    fields: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fields !== this.props.fields || nextProps.lineItems !== this.props.lineItems;
  }

  getLineItemCost(item) {
    let total = 0;
    total += item.quantity ? item.quantity * item.size * item.cpu : 0;
    total += item.tester.quantity ? item.tester.quantity * item.tester.cpu : 0;
    return total;
  }

  render() {
    const { fields } = this.props;

    const opts = { format: '%s%v', symbol: '$' };

    const lineItems = this.props.lineItems || [];

    let total = 0;
    lineItems.forEach(item => total += this.getLineItemCost(item));

    return (
      <Table>
        <TableHeader>
          <TableColumn width="30%">Item Details</TableColumn>
          <TableColumn width="9%">Cost per Unit</TableColumn>
          <TableColumn width="9%">Units per Case</TableColumn>
          <TableColumn width="9%">Case Price</TableColumn>
          <TableColumn width="15%">Options</TableColumn>
          <TableColumn width="9%">Qty</TableColumn>
          <TableColumn width="10%">Subtotal</TableColumn>
          <TableColumn width="9%">Tester</TableColumn>
        </TableHeader>
        <TableBody>
           {fields.map((fieldName, index) => {
             if (lineItems.length === 0) return <div></div>;
             const field = lineItems[index];
             return <TableRow key={ index }>
               <TableTextCell>{field.sku.product.name}, {field.sku.size} {field.description}</TableTextCell>
               <TableTextCell>{formatCurrency(field.cpu, opts)}</TableTextCell>
               <TableTextCell>{field.size}</TableTextCell>
               <TableTextCell>{formatCurrency(field.size * field.cpu, opts)}</TableTextCell>
               <TableTextCell>{field.sku.variety}</TableTextCell>
               <TableTextCell>
                 <Field component={InputText} name={`${fieldName}.quantity`} type='text' props={{fieldName: 'quantity', label: '' }} />
               </TableTextCell>
               <TableTextCell>{field.quantity ? formatCurrency(field.quantity * field.size * field.cpu, opts) : ''}</TableTextCell>
               <TableTextCell>
                 <Field component={InputText} name={`${fieldName}.tester.quantity`} type='text' props={{fieldName: 'tester.quantity', label: '' }} />
               </TableTextCell>
             </TableRow>;
             }
           )}
          <TableRow key={ fields.length }>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell> </TableTextCell>
            <TableTextCell>Total For Line Items</TableTextCell>
            <TableTextCell>{formatCurrency(total, opts)}</TableTextCell>
          </TableRow>;
        </TableBody>
      </Table>
    );
  }
}
