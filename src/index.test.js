import SnapIt from './index';

describe('adding hook', () => {
  test('error without name is defined and string', () => {
    expect(() => SnapIt().hook()).toThrow('Expected the name to be a string.');
  });

  test('error without fn as processor', () => {
    expect(() => SnapIt().hook('one')).toThrow('Expected the listener to be a function.');
  });

  test('return remove function back', () => {
    expect(typeof SnapIt().hook('one', () => {}, 2)).toBe('function');
  });

  test('return remove function back', () => {
    expect(typeof SnapIt().hook('one', () => {})).toBe('function');
  });

  test('two hooks with same name', () => {
    const snap = SnapIt();
    snap.hook('one', () => {});
    snap.hook('one', () => {});
    expect(snap.__STORE__['one']).toHaveLength(2);
  });

  test('return remove function back', () => {
    const snap = SnapIt();
    snap.hook('one', () => {})();
    expect(snap.__STORE__['one']).toHaveLength(0);
  });

  test('onBefore executed', () => {
    const onBefore = jest.fn();
    const snap = SnapIt({ onBefore });
    snap.hook('one', () => {});
    snap.wrap('one');
    snap.wrap('two');
    expect(onBefore).toHaveBeenCalledTimes(1);
  });

  test('onAfter executed', () => {
    const onAfter = jest.fn();
    const snap = SnapIt({ onAfter });
    snap.hook('one', () => {});
    snap.wrap('one');
    snap.wrap('two');
    expect(onAfter).toHaveBeenCalledTimes(1);
  });
});

describe('object wrap', () => {
  test('error without name is defined and string', () => {
    expect(() => SnapIt().wrap()).toThrow('Expected the name to be a string.');
  });

  test('error without name is defined and string', () => {
    expect(SnapIt().wrap('one', 'object_value')).toBe('object_value');
  });

  test('run the hook', () => {
    const snap = SnapIt();
    snap.hook('one', (e) => e + 1);

    expect(snap.wrap('one', 0)).toBe(1);
  });

  test('onBefore off execution', () => {
    const snap = SnapIt({ onBefore: () => false });
    snap.hook('one', (e) => e + 1);

    expect(snap.wrap('one', 0)).toBe(0);
  });

  describe('right order', () => {
    test('add order', () => {
      const snap = SnapIt();
      snap.hook('one', (e) => e + 2);
      snap.hook('one', (e) => e * 2);

      expect(snap.wrap('one', 1)).toBe(6);
    });

    test('reverse order', () => {
      const snap = SnapIt();
      snap.hook('one', (e) => e + 2, 3);
      snap.hook('one', (e) => e * 2);

      expect(snap.wrap('one', 1)).toBe(6);
    });

    test('negative order', () => {
      const snap = SnapIt();
      snap.hook('one', (e) => e + 2, 3);
      snap.hook('one', (e) => e * 2);
      snap.hook('one', (e) => e * 20, -1);

      expect(snap.wrap('one', 1)).toBe(120);
    });
  });

  describe('throw error on execution', () => {
    console.error = jest.fn();

    beforeEach(() => {
      console.error.mockClear();
    });

    test('throw error in hook', () => {
      const snap = SnapIt();
      snap.hook('one', () => {
        throw new Error('');
      });
      expect(snap.wrap('one', 1)).toBe(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('throw error in second hook', () => {
      const snap = SnapIt();
      snap.hook('one', (i) => i + 1);
      snap.hook('one', () => {
        throw new Error('');
      });
      expect(snap.wrap('one', 1)).toBe(2);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('throw error in second hook with 3', () => {
      const snap = SnapIt();
      snap.hook('one', (i) => i + 1);
      snap.hook('one', () => {
        throw new Error('');
      });
      snap.hook('one', (i) => i + 1);
      expect(snap.wrap('one', 1)).toBe(3);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
