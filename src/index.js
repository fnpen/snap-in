export default ({ onBefore, onAfter, ...options } = {}) => {
  const store = {};

  function getHooks(name) {
    return typeof store[name] === 'undefined' ? (store[name] = []) : store[name];
  }

  function hook(name, listener, priority = null) {
    if (typeof name !== 'string') {
      throw new Error('Expected the name to be a string.');
    }

    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    const hooks = getHooks(name);

    const addedIndex = hooks.push({ listener, priority }) - 1;

    return () => hooks.splice(addedIndex, 1); // Remove previosly added
  }

  function wrap(name, object) {
    if (typeof name !== 'string') {
      throw new Error('Expected the name to be a string.');
    }

    const hooks = getHooks(name);
    if (!hooks.length) {
      return object;
    }

    if (typeof onBefore === 'function') {
      if (onBefore(name, object, hooks) === false) {
        return object;
      }
    }

    const fns = [...hooks]
      .sort((a, b) => {
        return b.priority - a.priority;
      })
      .map((hook) => hook.listener);

    let result = fns.reduce((last, fn) => {
      let r;
      try {
        r = fn(last, options);
      } catch {
        console.error(`Error in hook on wrap execution with name: ${name}`);
        r = last;
      }
      return r;
    }, object);

    if (typeof onAfter === 'function') {
      onAfter(name, object, result, hooks);
    }

    return result;
  }

  return {
    hook,
    wrap,
    __STORE__: store,
  };
};
