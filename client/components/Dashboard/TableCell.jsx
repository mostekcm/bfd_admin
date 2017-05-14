import { PropTypes, Component } from 'react';

import './TableCell.css';

class TableCell extends Component {
  static propTypes = {
    className: PropTypes.string,
    rowSpan: PropTypes.number
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    const rowSpan = this.props.rowSpan || 1;
    const className = 'truncate' + ' ' + this.props.className;
    return <td className={className} rowSpan={rowSpan}>
        { this.props.children }
      </td>;
  }
}

export default TableCell;
