import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLocalToast } from './useLocalToast';

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('useLocalToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with no toast message', () => {
    const { result } = renderHook(() => useLocalToast());
    expect(result.current.toastMessage).toBeNull();
  });

  it('shows the message passed to showToast', () => {
    const { result } = renderHook(() => useLocalToast());

    act(() => {
      result.current.showToast('Instruções enviadas.');
    });

    expect(result.current.toastMessage).toBe('Instruções enviadas.');
  });

  it('hides the message on its own after 4000ms', () => {
    const { result } = renderHook(() => useLocalToast());

    act(() => {
      result.current.showToast('Instruções enviadas.');
    });
    expect(result.current.toastMessage).toBe('Instruções enviadas.');

    advance(3999);
    expect(result.current.toastMessage).toBe('Instruções enviadas.');

    advance(1);
    expect(result.current.toastMessage).toBeNull();
  });

  it('resets the auto-hide timer when showToast is called again', () => {
    const { result } = renderHook(() => useLocalToast());

    act(() => {
      result.current.showToast('Primeira mensagem.');
    });
    advance(3000);

    act(() => {
      result.current.showToast('Segunda mensagem.');
    });
    // Original timeout would have fired at 4000ms total; only 1000ms have
    // passed since the second call, so the message must still be visible.
    advance(1000);
    expect(result.current.toastMessage).toBe('Segunda mensagem.');

    advance(3000);
    expect(result.current.toastMessage).toBeNull();
  });
});
