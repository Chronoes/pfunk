import { extend } from 'lodash';

export function createConstants(values) {
  return values.reduce((constants, value) => extend(constants, { [value]: value }), {});
}
