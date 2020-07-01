import {decodePointerFragment} from '@stoplight/json';
import {Segment} from '@stoplight/types';

export function decodeSegmentFragment(segment: Segment): string {
  return typeof segment !== 'string' ? String(segment)
                                     : decodePointerFragment(segment);
}
