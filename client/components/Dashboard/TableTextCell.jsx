import React, { PropTypes, Component } from 'react';
import TableCell from './TableCell';

export default class TableTextCell extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    clickArgs: PropTypes.array,
    rowSpan: PropTypes.number
  };

  static defaultProps = {
    clickArgs: []
  }

  clickCell = () => {
    this.props.onClick(...this.props.clickArgs);
  };

  render() {
    if (this.props.onClick) {
      return (
        <TableCell className={this.props.className} rowSpan={this.props.rowSpan}>
          <a href="#" onClick={this.clickCell} title={ this.props.children || '' }>
            { this.props.children || '' }
          </a>
        </TableCell>
      );
    }

    return <TableCell className={this.props.className} rowSpan={this.props.rowSpan}>
      <span title={ this.props.children || '' }>{ this.props.children || '' }</span>
    </TableCell>;
  }
}
