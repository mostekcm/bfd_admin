import React, { Component } from 'react';

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

export default class OrderFormTable extends Component {
  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    cases: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fields !== this.props.fields;
  }

  render() {
    const { fields } = this.props;
    let rowIndex = 0;
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
           {fields.lineItems.map((field, index) => {
             //fields.quantity[index].maxlength = 5;
             return <TableRow key={ index }>
               <TableTextCell>{field.sku.product.name.value}, {field.sku.size.value} {field.description.value}</TableTextCell>
               <TableTextCell>${field.cpu.value}</TableTextCell>
               <TableTextCell>{field.size.value}</TableTextCell>
               <TableTextCell>${field.size.value * field.cpu.value}</TableTextCell>
               <TableTextCell>{field.sku.variety.value}</TableTextCell>
               <TableTextCell>
                 <InputText field={field.quantity} fieldName={field.quantity.name} label="" ref={field.quantity.name} />
               </TableTextCell>
               <TableTextCell>{field.quantity && field.quantity.value ? field.quantity.value * field.size.value * field.cpu.value : ''}</TableTextCell>
               <TableTextCell>
                 <InputText field={field.testers} fieldName={field.testers.name} label="" ref={field.testers.name} />
               </TableTextCell>
             </TableRow>;
             }
           )}
        </TableBody>
      </Table>
    );





    //       {cases.forEach((thisCase) => {
    //         let optionNum = 0;
    //         console.log('Carlos inside foreach: ', rowIndex);
    //         return (thisCase.sku.varieties.length > 0 ? thisCase.sku.varieties : [""]).forEach((variety) => {
    //           console.log('Carlos inside variety ', rowIndex, ', variety: ', variety);
    //           return ( <TableRow key={ (rowIndex++).toString() }>
    //             { optionNum++ > 0 || [
    //             <TableTextCell rowspan={thisCase.sku.varieties.length || 1}>{thisCase.sku.product.name}, {thisCase.sku.size} {thisCase.description}</TableTextCell>,
    //             <TableTextCell rowspan={thisCase.sku.varieties.length || 1}>${thisCase.cpu}</TableTextCell>,
    //             <TableTextCell rowspan={thisCase.sku.varieties.length || 1}>{thisCase.size}</TableTextCell>,
    //             <TableTextCell rowspan={thisCase.sku.varieties.length || 1}>${thisCase.size * thisCase.cpu}</TableTextCell>
    //             ]}
    //             <TableTextCell>{variety}</TableTextCell>
    //             <TableTextCell>Put Qty textinput here</TableTextCell>
    //             <TableTextCell>Subttl calc</TableTextCell>
    //             <TableTextCell>testr input</TableTextCell>
    //           </TableRow>);
    //       })})}
    //     </TableBody>
    //   </Table>
    // );
  }
}
