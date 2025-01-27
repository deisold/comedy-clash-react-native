import _ from 'lodash';
import Toast from 'react-native-toast-message';

export function isNotNullOrEmpty(str: string | null | undefined): boolean {
  return !_.isNil(str) && !_.isEmpty(str.trim());
}

export function showToastSuccess(message: string) {
  Toast.show({ type: 'success', position: 'bottom', text2: message });
}

export function showToastError(message: string) {
  Toast.show({ type: 'error', position: 'bottom', text2: message });
}