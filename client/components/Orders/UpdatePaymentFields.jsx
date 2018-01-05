import React, { Component } from 'react';
import { Field } from 'redux-form';
import formatCurrency from 'format-currency';

import {
  InputDate,
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

export default class UpdatePaymentFields extends Component {
  static propTypes = {
    payments: React.PropTypes.array,
    totalCost: React.PropTypes.number.isRequired,
    fields: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.payments !== this.props.payments || nextProps.totalCost !== this.props.totalCost;
  }

  getRemainingCost(totalCost, payments) {
    let remaining = totalCost;
    if (payments) payments.forEach(payment => remaining -= (payment.amount || 0));
    return remaining;
  }

  render() {
    const { totalCost, fields, payments } = this.props;

    const opts = { format: '%s%v', symbol: '$' };

    return (
      <Table>
        <TableHeader>
          <TableColumn width="50%">Date</TableColumn>
          <TableColumn width="50%">Amount</TableColumn>
        </TableHeader>
        <TableBody>
           {fields.map((fieldName, index) => {
             if (!payments || payments.length <= index) return null;
             return <TableRow key={ index }>
               <TableTextCell skipTruncate={true} className="datePickerCell" >
                 <Field component={InputDate} name={`${fieldName}.date`} props={{fieldName: 'date', label: '' }} />
               </TableTextCell>
               <TableTextCell>
                 <Field component={InputText} name={`${fieldName}.amount`} type='text' props={{fieldName: 'amount', label: '' }} />
               </TableTextCell>
             </TableRow>;
             }
           )}
          <TableRow key={ fields.length }>
            <TableTextCell>Total Due</TableTextCell>
            <TableTextCell>{formatCurrency(this.getRemainingCost(totalCost, payments), opts)}</TableTextCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
