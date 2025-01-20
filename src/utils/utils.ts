import _ from 'lodash';

export function isNotNullOrEmpty(str: string | null | undefined): boolean {
  return !_.isNil(str) && !_.isEmpty(str.trim());
}