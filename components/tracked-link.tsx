'use client';
import type { ComponentProps } from 'react';
import { track, type EventName } from '@/lib/analytics';
export function TrackedLink({ event, children, ...props }: ComponentProps<'a'> & { event: EventName }) {
  return <a {...props} rel={props.target === '_blank' ? 'noopener noreferrer' : undefined} onClick={() => track(event)}>{children}</a>;
}
