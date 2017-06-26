import createUpdateDialog from '../BaseUpdateDialog/UpdateDialog';
import { cancelUpdateShippedDate, updateShippedDate } from './actions';
import { InputDate } from '../../../components/Dashboard';

import './Dialog.css';

export default createUpdateDialog('ShippedDate', 'updateShippedDate', cancelUpdateShippedDate, updateShippedDate, InputDate);