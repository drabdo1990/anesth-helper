import { describe, expect, it } from 'vitest';
import { currentStepIndex, type FlowStep } from '../flow';

const s = (done: boolean): FlowStep => ({ id: String(Math.random()), label: 'x', done });

describe('currentStepIndex', () => {
  it('returns first undone step', () => expect(currentStepIndex([s(true), s(false), s(false)])).toBe(1));
  it('returns length when all done', () => expect(currentStepIndex([s(true), s(true)])).toBe(2));
  it('returns 0 for empty list', () => expect(currentStepIndex([])).toBe(0));
});
