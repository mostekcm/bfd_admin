import createUpdateDialog from '../BaseUpdateDialog/UpdateDialog';
import { cancelUpdateShipping, updateShipping } from './actions';
import { InputText } from '../../../components/Dashboard';

export default createUpdateDialog('Shipping', 'updateShipping', cancelUpdateShipping, updateShipping, value => value.value, InputText);