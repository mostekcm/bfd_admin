import { PropTypes, Component } from 'react';

import './TableCell.css';

class TableCell extends Component {
  static propTypes = {
    skipTruncate: PropTypes.bool,
    className: PropTypes.string,
    rowSpan: PropTypes.number,
    rowSpan: PropTypes.number
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    const rowSpan = this.props.rowSpan || 1;
    const colSpan = this.props.colSpan || 1;
    const className = this.props.skipTruncate ? this.props.className : 'truncate' + ' ' + this.props.className;
    return <td className={className} rowSpan={rowSpan} colSpan={colSpan}>
        { this.props.children }
      </td>;
  }
}

export default TableCell;
