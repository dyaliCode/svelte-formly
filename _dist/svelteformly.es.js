function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, callback) {
    const unsub = store.subscribe(callback);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment && $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(changed, child_ctx);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, props) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (key, ret, value = ret) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
            return ret;
        })
        : prop_values;
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

function toVal(mix) {
	var k, y, str='';
	if (mix) {
		if (typeof mix === 'object') {
			if (!!mix.push) {
				for (k=0; k < mix.length; k++) {
					if (mix[k] && (y = toVal(mix[k]))) {
						str && (str += ' ');
						str += y;
					}
				}
			} else {
				for (k in mix) {
					if (mix[k] && (y = toVal(k))) {
						str && (str += ' ');
						str += y;
					}
				}
			}
		} else if (typeof mix !== 'boolean' && !mix.call) {
			str && (str += ' ');
			str += mix;
		}
	}
	return str;
}

function clsx () {
	var i=0, x, str='';
	while (i < arguments.length) {
		if (x = toVal(arguments[i++])) {
			str && (str += ' ');
			str += x;
		}
	}
	return str;
}

function min(val, args) {
  const minValue = parseFloat(args[0]);
  const value = isNaN(val) ? val.length : parseFloat(val);

  return value >= minValue;
}

function max(val, args) {
  const maxValue = parseFloat(args[0]);
  const value = isNaN(val) ? val.length : parseFloat(val);

  return isNaN(value) ? true : value <= maxValue;
}

function between(val, args) {
  return min(val, [args[0]]) && max(val, [args[1]]);
}

function email(val, args) {
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return val && regex.test(val);
}

function required(val, args) {
  if (
    val === undefined ||
    val === null ||
    val === "undefined" ||
    val === "null"
  )
    return false;

  if (typeof val === "string") {
    const tmp = val.replace(/\s/g, "");

    return tmp.length > 0;
  }

  return true;
}

function url(val, args) {
  const regex = (/(https?|ftp|git|svn):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
  return regex.test(url);
}

function equal(val, args) {
  return val === args[0];
}

/**
 * Convert byts to diffirents sizes types.
 * @param {number} bytes
 */

/**
 * Get extension file.
 * @param {file} file.
 */
function getFileExtension(file) {
  const filenameParts = file.name.split(".");
  return filenameParts[filenameParts.length - 1].toLowerCase();
}

/**
 * Validate by types.
 * @param {file} file .file object.
 * @param {array} allowedFileTypes list allowed types file.
 */
function types(file, allowedFileTypes) {
  if (!allowedFileTypes.includes(getFileExtension(file))) {
    return false;
  }
  return true;
}

/**
 * Validate by size.
 * @param {file} file .file object.
 * @param {number} maxFileSize max size file.
 */
function maxsize(file, maxFileSize) {
  const maxSize = parseFloat(maxFileSize) * 1024 * 1024;
  if (file.size > maxSize) {
    return false;
  }
  return true;
}



var rules = /*#__PURE__*/Object.freeze({
    __proto__: null,
    between: between,
    email: email,
    max: max,
    min: min,
    required: required,
    url: url,
    equal: equal,
    types: types,
    maxsize: maxsize
});

/**
 * Validation fields.
 * @param {object fields to validate} fn
 * @param {default fields with config} storeValues
 */
function validateFields(fn, storeValues) {
  let fields = fn.call();
  let valid = true;
  Object.keys(fields).map(key => {
    const field = fields[key];
    if (field.validators) {
      const statusObjField = validate(field);
      fields[key] = { ...fields[key], ...statusObjField };
      if (statusObjField.validation.errors.length > 0) {
        valid = false;
      }
    } else {
      fields[key] = {
        ...fields[key],
        validation: { errors: [], dirty: false }
      };
    }
  });

  fields = { ...fields, valid };
  storeValues.set(fields);
}

/**
 * Validate field by rule.
 * @param {configs field} field
 */
function validate(field) {
  const { value, validators } = field;
  let valid = true;
  let rule;
  let errors = [];

  validators.map(validator => {
    // For file type.
    if (validator === "file") {
      if (value) {
        Object.keys(value).map(i => {
          Object.keys(field.file).map(r => {
            valid = rules[r].call(null, value[i], field.file[r]);
            if (!valid) {
              errors = [...errors, r];
            }
          });
        });
      }
    } else {
      // For custom rule.
      if (typeof validator === "function") {
        valid = validator.call();
        rule = validator.name;
      } else {
        const args = validator.split(/:/g);
        rule = args.shift();
        valid = rules[rule].call(null, value, args);
      }
      if (!valid) {
        errors = [...errors, rule];
      }
    }
  });

  return { ...field, validation: { errors, dirty: errors.length > 0 } };
}

/**
 * Validate fields form and store status.
 * @param {object fields to validate} fn
 */
function validator(fn) {
  const storeValues = writable({ valid: true });
  afterUpdate(() => validateFields(fn, storeValues));
  return storeValues;
}

const valuesForm = writable({
  isValidForm: true,
  values: {}
});

/* src/Components/Tag.svelte generated by Svelte v3.15.0 */

function create_else_block(ctx) {
	let div;
	let div_class_value;
	let current;
	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr(div, "class", div_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
			}

			if (!current || changed.classes && div_class_value !== (div_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null)) {
				attr(div, "class", div_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (16:27) 
function create_if_block_2(ctx) {
	let strong;
	let strong_class_value;
	let current;
	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	return {
		c() {
			strong = element("strong");
			if (default_slot) default_slot.c();
			attr(strong, "class", strong_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null);
		},
		m(target, anchor) {
			insert(target, strong, anchor);

			if (default_slot) {
				default_slot.m(strong, null);
			}

			current = true;
		},
		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
			}

			if (!current || changed.classes && strong_class_value !== (strong_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null)) {
				attr(strong, "class", strong_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(strong);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (12:26) 
function create_if_block_1(ctx) {
	let small;
	let small_class_value;
	let current;
	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	return {
		c() {
			small = element("small");
			if (default_slot) default_slot.c();
			attr(small, "class", small_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null);
		},
		m(target, anchor) {
			insert(target, small, anchor);

			if (default_slot) {
				default_slot.m(small, null);
			}

			current = true;
		},
		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
			}

			if (!current || changed.classes && small_class_value !== (small_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null)) {
				attr(small, "class", small_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(small);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

// (8:0) {#if tag === 'span'}
function create_if_block(ctx) {
	let span;
	let span_class_value;
	let current;
	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	return {
		c() {
			span = element("span");
			if (default_slot) default_slot.c();
			attr(span, "class", span_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null);
		},
		m(target, anchor) {
			insert(target, span, anchor);

			if (default_slot) {
				default_slot.m(span, null);
			}

			current = true;
		},
		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
			}

			if (!current || changed.classes && span_class_value !== (span_class_value = ctx.classes.length > 0 ? clsx(ctx.classes) : null)) {
				attr(span, "class", span_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(span);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_else_block];
	const if_blocks = [];

	function select_block_type(changed, ctx) {
		if (ctx.tag === "span") return 0;
		if (ctx.tag === "small") return 1;
		if (ctx.tag === "strong") return 2;
		return 3;
	}

	current_block_type_index = select_block_type(null, ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(changed, ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { tag = "div" } = $$props;
	let { classes = [] } = $$props;
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("tag" in $$props) $$invalidate("tag", tag = $$props.tag);
		if ("classes" in $$props) $$invalidate("classes", classes = $$props.classes);
		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
	};

	return { tag, classes, $$slots, $$scope };
}

class Tag extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { tag: 0, classes: 0 });
	}
}

/* src/Components/Input.svelte generated by Svelte v3.15.0 */

function create_fragment$1(ctx) {
	let input;
	let input_class_value;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "type", ctx.type);
			attr(input, "id", ctx.id);
			attr(input, "name", ctx.name);
			input.value = ctx.value;
			attr(input, "class", input_class_value = clsx(ctx.classe));
			attr(input, "placeholder", ctx.placeholder);
			input.disabled = ctx.disabled;
			attr(input, "min", ctx.min);
			attr(input, "max", ctx.max);
			attr(input, "step", ctx.step);
			attr(input, "autocomplete", ctx.autocomplete);
			dispose = listen(input, "input", ctx.onChangerValue);
		},
		m(target, anchor) {
			insert(target, input, anchor);
		},
		p(changed, ctx) {
			if (changed.type) {
				attr(input, "type", ctx.type);
			}

			if (changed.id) {
				attr(input, "id", ctx.id);
			}

			if (changed.name) {
				attr(input, "name", ctx.name);
			}

			if (changed.value) {
				input.value = ctx.value;
			}

			if (changed.classe && input_class_value !== (input_class_value = clsx(ctx.classe))) {
				attr(input, "class", input_class_value);
			}

			if (changed.placeholder) {
				attr(input, "placeholder", ctx.placeholder);
			}

			if (changed.disabled) {
				input.disabled = ctx.disabled;
			}

			if (changed.min) {
				attr(input, "min", ctx.min);
			}

			if (changed.max) {
				attr(input, "max", ctx.max);
			}

			if (changed.step) {
				attr(input, "step", ctx.step);
			}

			if (changed.autocomplete) {
				attr(input, "autocomplete", ctx.autocomplete);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { type = "text" } = $$props;
	let { id = "" } = $$props;
	let { name = "" } = $$props;
	let { value = "" } = $$props;
	let { classe = "" } = $$props;
	let { min = null } = $$props;
	let { max = null } = $$props;
	let { step = null } = $$props;
	let { autocomplete = "off" } = $$props;
	let { placeholder = null } = $$props;
	let { disabled = null } = $$props;
	const dispatch = createEventDispatcher();

	function onChangerValue(event) {
		dispatch("changeValue", { name, value: event.target.value });
	}

	onMount(() => {
		$$invalidate("type", type = type === "datetimelocal" ? "datetime-local" : type);

		$$invalidate("value", value = type === "range"
		? $$invalidate("value", value = min)
		: value);

		dispatch("changeValue", { name, value });
	});

	$$self.$set = $$props => {
		if ("type" in $$props) $$invalidate("type", type = $$props.type);
		if ("id" in $$props) $$invalidate("id", id = $$props.id);
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("value" in $$props) $$invalidate("value", value = $$props.value);
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("min" in $$props) $$invalidate("min", min = $$props.min);
		if ("max" in $$props) $$invalidate("max", max = $$props.max);
		if ("step" in $$props) $$invalidate("step", step = $$props.step);
		if ("autocomplete" in $$props) $$invalidate("autocomplete", autocomplete = $$props.autocomplete);
		if ("placeholder" in $$props) $$invalidate("placeholder", placeholder = $$props.placeholder);
		if ("disabled" in $$props) $$invalidate("disabled", disabled = $$props.disabled);
	};

	return {
		type,
		id,
		name,
		value,
		classe,
		min,
		max,
		step,
		autocomplete,
		placeholder,
		disabled,
		onChangerValue
	};
}

class Input extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			type: 0,
			id: 0,
			name: 0,
			value: 0,
			classe: 0,
			min: 0,
			max: 0,
			step: 0,
			autocomplete: 0,
			placeholder: 0,
			disabled: 0
		});
	}
}

/* src/Components/Textarea.svelte generated by Svelte v3.15.0 */

function create_fragment$2(ctx) {
	let textarea;
	let textarea_class_value;
	let textarea_value_value;
	let dispose;

	return {
		c() {
			textarea = element("textarea");
			attr(textarea, "id", ctx.id);
			attr(textarea, "name", ctx.name);
			attr(textarea, "class", textarea_class_value = clsx(ctx.classe));
			textarea.required = ctx.required;
			textarea.disabled = ctx.disabled;
			attr(textarea, "rows", ctx.rows);
			attr(textarea, "cols", ctx.cols);
			textarea.value = textarea_value_value = "\n  " + ctx.value + "\n";
			dispose = listen(textarea, "input", ctx.onChangerValue);
		},
		m(target, anchor) {
			insert(target, textarea, anchor);
		},
		p(changed, ctx) {
			if (changed.id) {
				attr(textarea, "id", ctx.id);
			}

			if (changed.name) {
				attr(textarea, "name", ctx.name);
			}

			if (changed.classe && textarea_class_value !== (textarea_class_value = clsx(ctx.classe))) {
				attr(textarea, "class", textarea_class_value);
			}

			if (changed.required) {
				textarea.required = ctx.required;
			}

			if (changed.disabled) {
				textarea.disabled = ctx.disabled;
			}

			if (changed.rows) {
				attr(textarea, "rows", ctx.rows);
			}

			if (changed.cols) {
				attr(textarea, "cols", ctx.cols);
			}

			if (changed.value && textarea_value_value !== (textarea_value_value = "\n  " + ctx.value + "\n")) {
				textarea.value = textarea_value_value;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(textarea);
			dispose();
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { id = "" } = $$props;
	let { name = "" } = $$props;
	let { value = "" } = $$props;
	let { classe = "" } = $$props;
	let { rows = 4 } = $$props;
	let { cols = 50 } = $$props;
	let { required = false } = $$props;
	let { disabled = false } = $$props;
	const dispatch = createEventDispatcher();

	function onChangerValue(event) {
		dispatch("changeValue", { name, value: event.target.value });
	}

	onMount(() => {
		dispatch("changeValue", { name, value });
	});

	$$self.$set = $$props => {
		if ("id" in $$props) $$invalidate("id", id = $$props.id);
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("value" in $$props) $$invalidate("value", value = $$props.value);
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("rows" in $$props) $$invalidate("rows", rows = $$props.rows);
		if ("cols" in $$props) $$invalidate("cols", cols = $$props.cols);
		if ("required" in $$props) $$invalidate("required", required = $$props.required);
		if ("disabled" in $$props) $$invalidate("disabled", disabled = $$props.disabled);
	};

	return {
		id,
		name,
		value,
		classe,
		rows,
		cols,
		required,
		disabled,
		onChangerValue
	};
}

class Textarea extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			id: 0,
			name: 0,
			value: 0,
			classe: 0,
			rows: 0,
			cols: 0,
			required: 0,
			disabled: 0
		});
	}
}

/* src/Components/Select.svelte generated by Svelte v3.15.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.option = list[i];
	return child_ctx;
}

// (32:2) {:else}
function create_else_block$1(ctx) {
	let option;

	return {
		c() {
			option = element("option");
			option.textContent = "Any";
			option.__value = "Any";
			option.value = option.__value;
		},
		m(target, anchor) {
			insert(target, option, anchor);
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (30:2) {#each options as option (option.value)}
function create_each_block(key_1, ctx) {
	let option;
	let t_value = ctx.option.title + "";
	let t;
	let option_value_value;

	return {
		key: key_1,
		first: null,
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = ctx.option.value;
			option.value = option.__value;
			this.first = option;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p(changed, ctx) {
			if (changed.options && t_value !== (t_value = ctx.option.title + "")) set_data(t, t_value);

			if (changed.options && option_value_value !== (option_value_value = ctx.option.value)) {
				option.__value = option_value_value;
			}

			option.value = option.__value;
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

function create_fragment$3(ctx) {
	let select;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let select_class_value;
	let dispose;
	let each_value = ctx.options;
	const get_key = ctx => ctx.option.value;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value.length) {
		each_1_else = create_else_block$1();
		each_1_else.c();
	}

	return {
		c() {
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(select, "id", ctx.id);
			attr(select, "name", ctx.name);
			attr(select, "class", select_class_value = clsx(ctx.classe));
			select.disabled = ctx.disabled;
			dispose = listen(select, "input", ctx.onChangeValue);
		},
		m(target, anchor) {
			insert(target, select, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			if (each_1_else) {
				each_1_else.m(select, null);
			}
		},
		p(changed, ctx) {
			const each_value = ctx.options;
			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block, null, get_each_context);

			if (each_value.length) {
				if (each_1_else) {
					each_1_else.d(1);
					each_1_else = null;
				}
			} else if (!each_1_else) {
				each_1_else = create_else_block$1();
				each_1_else.c();
				each_1_else.m(select, null);
			}

			if (changed.id) {
				attr(select, "id", ctx.id);
			}

			if (changed.name) {
				attr(select, "name", ctx.name);
			}

			if (changed.classe && select_class_value !== (select_class_value = clsx(ctx.classe))) {
				attr(select, "class", select_class_value);
			}

			if (changed.disabled) {
				select.disabled = ctx.disabled;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (each_1_else) each_1_else.d();
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { id = "" } = $$props;
	let { name = "" } = $$props;
	let { classe = "" } = $$props;
	let { options = [] } = $$props;
	let { disabled = false } = $$props;
	const dispatch = createEventDispatcher();

	function onChangeValue(event) {
		dispatch("changeValue", { name, value: event.target.value });
	}

	onMount(() => {
		if (options.length > 0) {
			dispatch("changeValue", { name, value: options[0].value });
		}
	});

	$$self.$set = $$props => {
		if ("id" in $$props) $$invalidate("id", id = $$props.id);
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("options" in $$props) $$invalidate("options", options = $$props.options);
		if ("disabled" in $$props) $$invalidate("disabled", disabled = $$props.disabled);
	};

	return {
		id,
		name,
		classe,
		options,
		disabled,
		onChangeValue
	};
}

class Select extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			id: 0,
			name: 0,
			classe: 0,
			options: 0,
			disabled: 0
		});
	}
}

/* src/Components/Radio.svelte generated by Svelte v3.15.0 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.item = list[i];
	child_ctx.i = i;
	return child_ctx;
}

// (28:0) {#each items as item, i}
function create_each_block$1(ctx) {
	let div;
	let input;
	let input_class_value;
	let input_id_value;
	let input_value_value;
	let input_checked_value;
	let t0;
	let span;
	let t1_value = ctx.item.title + "";
	let t1;
	let t2;
	let div_class_value;
	let dispose;

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			attr(input, "type", "radio");
			attr(input, "class", input_class_value = clsx(ctx.classe));
			attr(input, "id", input_id_value = ctx.item.id);
			attr(input, "name", ctx.name);
			input.value = input_value_value = ctx.item.value;
			input.checked = input_checked_value = ctx.i === 0;

			attr(div, "class", div_class_value = ctx.aligne === "inline"
			? "form-check-inline"
			: "form-check");

			dispose = listen(input, "input", ctx.onChangeValue);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			append(div, t0);
			append(div, span);
			append(span, t1);
			append(div, t2);
		},
		p(changed, ctx) {
			if (changed.classe && input_class_value !== (input_class_value = clsx(ctx.classe))) {
				attr(input, "class", input_class_value);
			}

			if (changed.items && input_id_value !== (input_id_value = ctx.item.id)) {
				attr(input, "id", input_id_value);
			}

			if (changed.name) {
				attr(input, "name", ctx.name);
			}

			if (changed.items && input_value_value !== (input_value_value = ctx.item.value)) {
				input.value = input_value_value;
			}

			if (changed.items && t1_value !== (t1_value = ctx.item.title + "")) set_data(t1, t1_value);

			if (changed.aligne && div_class_value !== (div_class_value = ctx.aligne === "inline"
			? "form-check-inline"
			: "form-check")) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			dispose();
		}
	};
}

function create_fragment$4(ctx) {
	let each_1_anchor;
	let each_value = ctx.items;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(changed, ctx) {
			if (changed.aligne || changed.items || changed.clsx || changed.classe || changed.name || changed.onChangeValue) {
				each_value = ctx.items;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { name = "" } = $$props;
	let { classe = "" } = $$props;
	let { aligne = "default" } = $$props;
	let { items = [] } = $$props;
	const dispatch = createEventDispatcher();

	function onChangeValue(event) {
		dispatch("changeValue", { name, value: event.target.value });
	}

	onMount(() => {
		if (items.length > 0) {
			dispatch("changeValue", { name, value: items[0].value });
		}
	});

	$$self.$set = $$props => {
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("aligne" in $$props) $$invalidate("aligne", aligne = $$props.aligne);
		if ("items" in $$props) $$invalidate("items", items = $$props.items);
	};

	return {
		name,
		classe,
		aligne,
		items,
		onChangeValue
	};
}

class Radio extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, classe: 0, aligne: 0, items: 0 });
	}
}

/* src/Components/Checkbox.svelte generated by Svelte v3.15.0 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.item = list[i];
	child_ctx.i = i;
	return child_ctx;
}

// (30:0) {#each items as item, i}
function create_each_block$2(ctx) {
	let div;
	let input;
	let input_class_value;
	let input_id_value;
	let input_name_value;
	let input_checked_value;
	let t0;
	let span;
	let t1_value = ctx.item.title + "";
	let t1;
	let t2;
	let div_class_value;
	let dispose;

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			attr(input, "type", "checkbox");
			attr(input, "class", input_class_value = clsx(ctx.classe));
			attr(input, "id", input_id_value = ctx.item.id);
			attr(input, "name", input_name_value = ctx.item.name);
			input.checked = input_checked_value = ctx.item.checked ? ctx.item.checked : false;

			attr(div, "class", div_class_value = ctx.aligne === "inline"
			? "form-check-inline"
			: "form-check");

			dispose = listen(input, "input", ctx.onChangeValue);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			append(div, t0);
			append(div, span);
			append(span, t1);
			append(div, t2);
		},
		p(changed, ctx) {
			if (changed.classe && input_class_value !== (input_class_value = clsx(ctx.classe))) {
				attr(input, "class", input_class_value);
			}

			if (changed.items && input_id_value !== (input_id_value = ctx.item.id)) {
				attr(input, "id", input_id_value);
			}

			if (changed.items && input_name_value !== (input_name_value = ctx.item.name)) {
				attr(input, "name", input_name_value);
			}

			if (changed.items && input_checked_value !== (input_checked_value = ctx.item.checked ? ctx.item.checked : false)) {
				input.checked = input_checked_value;
			}

			if (changed.items && t1_value !== (t1_value = ctx.item.title + "")) set_data(t1, t1_value);

			if (changed.aligne && div_class_value !== (div_class_value = ctx.aligne === "inline"
			? "form-check-inline"
			: "form-check")) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			dispose();
		}
	};
}

function create_fragment$5(ctx) {
	let each_1_anchor;
	let each_value = ctx.items;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(changed, ctx) {
			if (changed.aligne || changed.items || changed.clsx || changed.classe || changed.onChangeValue) {
				each_value = ctx.items;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { classe = "" } = $$props;
	let { aligne = "default" } = $$props;
	let { items = [] } = $$props;
	const dispatch = createEventDispatcher();

	function onChangeValue(event) {
		dispatch("changeValue", {
			name: event.target.name,
			value: event.target.checked
		});
	}

	onMount(() => {
		if (items.length > 0) {
			$$invalidate("items", items[0].checked = true, items);

			items.map(i => {
				dispatch("changeValue", {
					name: i.name,
					value: i.checked ? i.checked : false
				});
			});
		}
	});

	$$self.$set = $$props => {
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("aligne" in $$props) $$invalidate("aligne", aligne = $$props.aligne);
		if ("items" in $$props) $$invalidate("items", items = $$props.items);
	};

	return { classe, aligne, items, onChangeValue };
}

class Checkbox extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { classe: 0, aligne: 0, items: 0 });
	}
}

/* src/Components/File.svelte generated by Svelte v3.15.0 */

function add_css() {
	var style = element("style");
	style.id = "svelte-mwz6k8-style";
	style.textContent = ".list-files.svelte-mwz6k8 .file.svelte-mwz6k8{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}.list-files.svelte-mwz6k8 .file .img.svelte-mwz6k8,.list-files.svelte-mwz6k8 .file .infos.svelte-mwz6k8{width:50%}";
	append(document.head, style);
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.file = list[i];
	return child_ctx;
}

// (48:2) {#each files as file}
function create_each_block$3(ctx) {
	let div2;
	let div0;
	let img;
	let img_src_value;
	let img_alt_value;
	let t0;
	let div1;
	let ul;
	let li0;
	let t1;
	let t2_value = ctx.file.name + "";
	let t2;
	let t3;
	let li1;
	let t4;
	let t5_value = ctx.file.size + "";
	let t5;
	let t6;
	let li2;
	let t7;
	let t8_value = ctx.file.type + "";
	let t8;
	let t9;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			ul = element("ul");
			li0 = element("li");
			t1 = text("Name: ");
			t2 = text(t2_value);
			t3 = space();
			li1 = element("li");
			t4 = text("Size: ");
			t5 = text(t5_value);
			t6 = space();
			li2 = element("li");
			t7 = text("Type: ");
			t8 = text(t8_value);
			t9 = space();
			if (img.src !== (img_src_value = URL.createObjectURL(ctx.file))) attr(img, "src", img_src_value);
			attr(img, "alt", img_alt_value = ctx.file.name);
			set_style(img, "width", "100%");
			attr(div0, "class", "img svelte-mwz6k8");
			attr(div1, "class", "infos svelte-mwz6k8");
			attr(div2, "class", "file svelte-mwz6k8");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, img);
			append(div2, t0);
			append(div2, div1);
			append(div1, ul);
			append(ul, li0);
			append(li0, t1);
			append(li0, t2);
			append(ul, t3);
			append(ul, li1);
			append(li1, t4);
			append(li1, t5);
			append(ul, t6);
			append(ul, li2);
			append(li2, t7);
			append(li2, t8);
			append(div2, t9);
		},
		p(changed, ctx) {
			if (changed.files && img.src !== (img_src_value = URL.createObjectURL(ctx.file))) {
				attr(img, "src", img_src_value);
			}

			if (changed.files && img_alt_value !== (img_alt_value = ctx.file.name)) {
				attr(img, "alt", img_alt_value);
			}

			if (changed.files && t2_value !== (t2_value = ctx.file.name + "")) set_data(t2, t2_value);
			if (changed.files && t5_value !== (t5_value = ctx.file.size + "")) set_data(t5, t5_value);
			if (changed.files && t8_value !== (t8_value = ctx.file.type + "")) set_data(t8, t8_value);
		},
		d(detaching) {
			if (detaching) detach(div2);
		}
	};
}

function create_fragment$6(ctx) {
	let input;
	let input_class_value;
	let t;
	let div;
	let dispose;
	let each_value = ctx.files;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	return {
		c() {
			input = element("input");
			t = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(input, "type", "file");
			attr(input, "id", ctx.id);
			attr(input, "name", ctx.name);
			input.value = ctx.value;
			attr(input, "class", input_class_value = clsx(ctx.classe));
			input.disabled = ctx.disabled;
			input.multiple = ctx.multiple;
			attr(div, "class", "list-files svelte-mwz6k8");
			dispose = listen(input, "input", ctx.onChangerValue);
		},
		m(target, anchor) {
			insert(target, input, anchor);
			insert(target, t, anchor);
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p(changed, ctx) {
			if (changed.id) {
				attr(input, "id", ctx.id);
			}

			if (changed.name) {
				attr(input, "name", ctx.name);
			}

			if (changed.value) {
				input.value = ctx.value;
			}

			if (changed.classe && input_class_value !== (input_class_value = clsx(ctx.classe))) {
				attr(input, "class", input_class_value);
			}

			if (changed.disabled) {
				input.disabled = ctx.disabled;
			}

			if (changed.multiple) {
				input.multiple = ctx.multiple;
			}

			if (changed.files || changed.URL) {
				each_value = ctx.files;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
			if (detaching) detach(t);
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			dispose();
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let { id = "" } = $$props;
	let { name = "" } = $$props;
	let { value = "" } = $$props;
	let { classe = "" } = $$props;
	let { disabled = null } = $$props;
	let { multiple = false } = $$props;
	let files = [];
	const dispatch = createEventDispatcher();

	function onChangerValue(event) {
		$$invalidate("files", files = event.target.files);
		dispatch("changeValue", { name, value: files });
	}

	$$self.$set = $$props => {
		if ("id" in $$props) $$invalidate("id", id = $$props.id);
		if ("name" in $$props) $$invalidate("name", name = $$props.name);
		if ("value" in $$props) $$invalidate("value", value = $$props.value);
		if ("classe" in $$props) $$invalidate("classe", classe = $$props.classe);
		if ("disabled" in $$props) $$invalidate("disabled", disabled = $$props.disabled);
		if ("multiple" in $$props) $$invalidate("multiple", multiple = $$props.multiple);
	};

	return {
		id,
		name,
		value,
		classe,
		disabled,
		multiple,
		files,
		onChangerValue
	};
}

class File extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-mwz6k8-style")) add_css();

		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
			id: 0,
			name: 0,
			value: 0,
			classe: 0,
			disabled: 0,
			multiple: 0
		});
	}
}

/* src/Components/Message.svelte generated by Svelte v3.15.0 */

function create_if_block$1(ctx) {
	let t_value = ctx.displayError(ctx.error) + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(changed, ctx) {
			if (changed.error && t_value !== (t_value = ctx.displayError(ctx.error) + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

function create_fragment$7(ctx) {
	let div;
	let if_block = ctx.error && create_if_block$1(ctx);

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			attr(div, "class", "invalid-feedback");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p(changed, ctx) {
			if (ctx.error) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if (if_block) if_block.d();
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let { error } = $$props;
	let { messages = {} } = $$props;

	const rules = {
		required: "This field is required",
		min: "This field must be more characters long",
		max: "This field must be more characters long",
		between: "This field must be between values defined",
		equal: "This field must be equal to value defined",
		email: "This email format is not valid",
		types: "Must to allowed file types",
		maxsize: "This file has size more than max size",
		custom_rule: "Error"
	};

	function displayError(rule) {
		let message = "";

		if (messages[rule]) {
			message += messages[rule] ? messages[rule] : rules["custom_rule"];
		} else {
			message += rules[rule] ? rules[rule] : rules["custom_rule"];
		}

		return message;
	}

	$$self.$set = $$props => {
		if ("error" in $$props) $$invalidate("error", error = $$props.error);
		if ("messages" in $$props) $$invalidate("messages", messages = $$props.messages);
	};

	return { error, messages, displayError };
}

class Message extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { error: 0, messages: 0 });
	}
}

/* src/Components/Field.svelte generated by Svelte v3.15.0 */

function get_each_context_1(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.error = list[i];
	child_ctx.index = i;
	return child_ctx;
}

function get_each_context$4(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.field = list[i];
	return child_ctx;
}

// (74:4) {#if field.label}
function create_if_block_10(ctx) {
	let label;
	let t_value = ctx.field.label + "";
	let t;
	let label_for_value;

	return {
		c() {
			label = element("label");
			t = text(t_value);
			attr(label, "for", label_for_value = ctx.field.id);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, t);
		},
		p(changed, ctx) {
			if (changed.fields && t_value !== (t_value = ctx.field.label + "")) set_data(t, t_value);

			if (changed.fields && label_for_value !== (label_for_value = ctx.field.id)) {
				attr(label, "for", label_for_value);
			}
		},
		d(detaching) {
			if (detaching) detach(label);
		}
	};
}

// (123:36) 
function create_if_block_9(ctx) {
	let current;

	const file = new File({
			props: {
				id: ctx.field.id,
				name: ctx.field.name,
				value: ctx.field.value,
				classe: ctx.field.class,
				disabled: ctx.field.disabled,
				multiple: ctx.field.multiple
			}
		});

	file.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(file.$$.fragment);
		},
		m(target, anchor) {
			mount_component(file, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const file_changes = {};
			if (changed.fields) file_changes.id = ctx.field.id;
			if (changed.fields) file_changes.name = ctx.field.name;
			if (changed.fields) file_changes.value = ctx.field.value;
			if (changed.fields) file_changes.classe = ctx.field.class;
			if (changed.fields) file_changes.disabled = ctx.field.disabled;
			if (changed.fields) file_changes.multiple = ctx.field.multiple;
			file.$set(file_changes);
		},
		i(local) {
			if (current) return;
			transition_in(file.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(file.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(file, detaching);
		}
	};
}

// (117:40) 
function create_if_block_8(ctx) {
	let current;

	const checkbox = new Checkbox({
			props: {
				classe: ctx.field.class,
				items: ctx.field.items,
				aligne: ctx.field.aligne
			}
		});

	checkbox.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(checkbox.$$.fragment);
		},
		m(target, anchor) {
			mount_component(checkbox, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const checkbox_changes = {};
			if (changed.fields) checkbox_changes.classe = ctx.field.class;
			if (changed.fields) checkbox_changes.items = ctx.field.items;
			if (changed.fields) checkbox_changes.aligne = ctx.field.aligne;
			checkbox.$set(checkbox_changes);
		},
		i(local) {
			if (current) return;
			transition_in(checkbox.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(checkbox.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(checkbox, detaching);
		}
	};
}

// (110:37) 
function create_if_block_7(ctx) {
	let current;

	const radio = new Radio({
			props: {
				name: ctx.field.name,
				classe: ctx.field.class,
				items: ctx.field.items,
				aligne: ctx.field.aligne
			}
		});

	radio.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(radio.$$.fragment);
		},
		m(target, anchor) {
			mount_component(radio, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const radio_changes = {};
			if (changed.fields) radio_changes.name = ctx.field.name;
			if (changed.fields) radio_changes.classe = ctx.field.class;
			if (changed.fields) radio_changes.items = ctx.field.items;
			if (changed.fields) radio_changes.aligne = ctx.field.aligne;
			radio.$set(radio_changes);
		},
		i(local) {
			if (current) return;
			transition_in(radio.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(radio.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(radio, detaching);
		}
	};
}

// (102:38) 
function create_if_block_6(ctx) {
	let current;

	const select = new Select({
			props: {
				id: ctx.field.id,
				name: ctx.field.name,
				classe: ctx.field.class,
				options: ctx.field.options,
				disabled: ctx.field.disabled
			}
		});

	select.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(select.$$.fragment);
		},
		m(target, anchor) {
			mount_component(select, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const select_changes = {};
			if (changed.fields) select_changes.id = ctx.field.id;
			if (changed.fields) select_changes.name = ctx.field.name;
			if (changed.fields) select_changes.classe = ctx.field.class;
			if (changed.fields) select_changes.options = ctx.field.options;
			if (changed.fields) select_changes.disabled = ctx.field.disabled;
			select.$set(select_changes);
		},
		i(local) {
			if (current) return;
			transition_in(select.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(select.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(select, detaching);
		}
	};
}

// (92:40) 
function create_if_block_5(ctx) {
	let current;

	const textarea = new Textarea({
			props: {
				id: ctx.field.id,
				name: ctx.field.name,
				value: ctx.field.value,
				classe: ctx.field.class,
				rows: ctx.field.rows,
				cols: ctx.field.cols,
				disabled: ctx.field.disabled
			}
		});

	textarea.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(textarea.$$.fragment);
		},
		m(target, anchor) {
			mount_component(textarea, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const textarea_changes = {};
			if (changed.fields) textarea_changes.id = ctx.field.id;
			if (changed.fields) textarea_changes.name = ctx.field.name;
			if (changed.fields) textarea_changes.value = ctx.field.value;
			if (changed.fields) textarea_changes.classe = ctx.field.class;
			if (changed.fields) textarea_changes.rows = ctx.field.rows;
			if (changed.fields) textarea_changes.cols = ctx.field.cols;
			if (changed.fields) textarea_changes.disabled = ctx.field.disabled;
			textarea.$set(textarea_changes);
		},
		i(local) {
			if (current) return;
			transition_in(textarea.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(textarea.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(textarea, detaching);
		}
	};
}

// (78:4) {#if field.type === 'text' || field.type === 'password' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'range' || field.type === 'date' || field.type === 'color' || field.type === 'datetimelocal'}
function create_if_block_4(ctx) {
	let current;

	const input = new Input({
			props: {
				type: ctx.field.type,
				id: ctx.field.id,
				name: ctx.field.name,
				value: ctx.field.value,
				classe: ctx.field.class,
				placeholder: ctx.field.placeholder,
				min: ctx.field.min,
				max: ctx.field.max,
				step: ctx.field.step,
				autocomplete: ctx.field.autocomplete,
				disabled: ctx.field.disabled
			}
		});

	input.$on("changeValue", ctx.changeValueHander);

	return {
		c() {
			create_component(input.$$.fragment);
		},
		m(target, anchor) {
			mount_component(input, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const input_changes = {};
			if (changed.fields) input_changes.type = ctx.field.type;
			if (changed.fields) input_changes.id = ctx.field.id;
			if (changed.fields) input_changes.name = ctx.field.name;
			if (changed.fields) input_changes.value = ctx.field.value;
			if (changed.fields) input_changes.classe = ctx.field.class;
			if (changed.fields) input_changes.placeholder = ctx.field.placeholder;
			if (changed.fields) input_changes.min = ctx.field.min;
			if (changed.fields) input_changes.max = ctx.field.max;
			if (changed.fields) input_changes.step = ctx.field.step;
			if (changed.fields) input_changes.autocomplete = ctx.field.autocomplete;
			if (changed.fields) input_changes.disabled = ctx.field.disabled;
			input.$set(input_changes);
		},
		i(local) {
			if (current) return;
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(input, detaching);
		}
	};
}

// (134:4) {#if field.description}
function create_if_block_2$1(ctx) {
	let if_block_anchor;
	let current;
	let if_block = ctx.field.description.text && create_if_block_3(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			if (ctx.field.description.text) {
				if (if_block) {
					if_block.p(changed, ctx);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (135:6) {#if field.description.text}
function create_if_block_3(ctx) {
	let current;

	const tag = new Tag({
			props: {
				tag: ctx.field.description.tag,
				classes: ctx.field.description.class,
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(tag.$$.fragment);
		},
		m(target, anchor) {
			mount_component(tag, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const tag_changes = {};
			if (changed.fields) tag_changes.tag = ctx.field.description.tag;
			if (changed.fields) tag_changes.classes = ctx.field.description.class;

			if (changed.$$scope || changed.fields) {
				tag_changes.$$scope = { changed, ctx };
			}

			tag.$set(tag_changes);
		},
		i(local) {
			if (current) return;
			transition_in(tag.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tag.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(tag, detaching);
		}
	};
}

// (136:8) <Tag tag={field.description.tag} classes={field.description.class}>
function create_default_slot_1(ctx) {
	let t_value = ctx.field.description.text + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(changed, ctx) {
			if (changed.fields && t_value !== (t_value = ctx.field.description.text + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (142:4) {#if !isValidForm}
function create_if_block$2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = ctx.$form[ctx.field.name].validation.errors.length > 0 && create_if_block_1$1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			if (ctx.$form[ctx.field.name].validation.errors.length > 0) {
				if (if_block) {
					if_block.p(changed, ctx);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (143:6) {#if $form[field.name].validation.errors.length > 0}
function create_if_block_1$1(ctx) {
	let each_1_anchor;
	let current;
	let each_value_1 = ctx.$form[ctx.field.name].validation.errors;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			if (changed.$form || changed.fields) {
				each_value_1 = ctx.$form[ctx.field.name].validation.errors;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (144:8) {#each $form[field.name].validation.errors as error, index}
function create_each_block_1(ctx) {
	let current;

	const message = new Message({
			props: {
				error: ctx.error,
				messages: ctx.field.messages
			}
		});

	return {
		c() {
			create_component(message.$$.fragment);
		},
		m(target, anchor) {
			mount_component(message, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const message_changes = {};
			if (changed.$form || changed.fields) message_changes.error = ctx.error;
			if (changed.fields) message_changes.messages = ctx.field.messages;
			message.$set(message_changes);
		},
		i(local) {
			if (current) return;
			transition_in(message.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(message.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(message, detaching);
		}
	};
}

// (70:2) <Tag     tag={field.prefix ? (field.prefix.tag ? field.prefix.tag : 'div') : 'div'}     classes={field.prefix ? (field.prefix.class ? field.prefix.class : 'form-group') : 'form-group'}>
function create_default_slot(ctx) {
	let t0;
	let current_block_type_index;
	let if_block1;
	let t1;
	let t2;
	let t3;
	let current;
	let if_block0 = ctx.field.label && create_if_block_10(ctx);

	const if_block_creators = [
		create_if_block_4,
		create_if_block_5,
		create_if_block_6,
		create_if_block_7,
		create_if_block_8,
		create_if_block_9
	];

	const if_blocks = [];

	function select_block_type(changed, ctx) {
		if (ctx.field.type === "text" || ctx.field.type === "password" || ctx.field.type === "email" || ctx.field.type === "tel" || ctx.field.type === "number" || ctx.field.type === "range" || ctx.field.type === "date" || ctx.field.type === "color" || ctx.field.type === "datetimelocal") return 0;
		if (ctx.field.type === "textarea") return 1;
		if (ctx.field.type === "select") return 2;
		if (ctx.field.type === "radio") return 3;
		if (ctx.field.type === "checkbox") return 4;
		if (ctx.field.type === "file") return 5;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(null, ctx))) {
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	let if_block2 = ctx.field.description && create_if_block_2$1(ctx);
	let if_block3 = !ctx.isValidForm && create_if_block$2(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			t2 = space();
			if (if_block3) if_block3.c();
			t3 = space();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert(target, t1, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, t2, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert(target, t3, anchor);
			current = true;
		},
		p(changed, ctx) {
			if (ctx.field.label) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_10(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(changed, ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(changed, ctx);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					}

					transition_in(if_block1, 1);
					if_block1.m(t1.parentNode, t1);
				} else {
					if_block1 = null;
				}
			}

			if (ctx.field.description) {
				if (if_block2) {
					if_block2.p(changed, ctx);
					transition_in(if_block2, 1);
				} else {
					if_block2 = create_if_block_2$1(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(t2.parentNode, t2);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (!ctx.isValidForm) {
				if (if_block3) {
					if_block3.p(changed, ctx);
					transition_in(if_block3, 1);
				} else {
					if_block3 = create_if_block$2(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(t3.parentNode, t3);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(if_block3);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(if_block3);
			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t0);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

			if (detaching) detach(t1);
			if (if_block2) if_block2.d(detaching);
			if (detaching) detach(t2);
			if (if_block3) if_block3.d(detaching);
			if (detaching) detach(t3);
		}
	};
}

// (68:0) {#each fields as field (field.name)}
function create_each_block$4(key_1, ctx) {
	let first;
	let current;

	const tag = new Tag({
			props: {
				tag: ctx.field.prefix
				? ctx.field.prefix.tag ? ctx.field.prefix.tag : "div"
				: "div",
				classes: ctx.field.prefix
				? ctx.field.prefix.class
					? ctx.field.prefix.class
					: "form-group"
				: "form-group",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(tag.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(tag, target, anchor);
			current = true;
		},
		p(changed, ctx) {
			const tag_changes = {};

			if (changed.fields) tag_changes.tag = ctx.field.prefix
			? ctx.field.prefix.tag ? ctx.field.prefix.tag : "div"
			: "div";

			if (changed.fields) tag_changes.classes = ctx.field.prefix
			? ctx.field.prefix.class
				? ctx.field.prefix.class
				: "form-group"
			: "form-group";

			if (changed.$$scope || changed.isValidForm || changed.$form || changed.fields) {
				tag_changes.$$scope = { changed, ctx };
			}

			tag.$set(tag_changes);
		},
		i(local) {
			if (current) return;
			transition_in(tag.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tag.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			destroy_component(tag, detaching);
		}
	};
}

function create_fragment$8(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let current;
	let each_value = ctx.fields;
	const get_key = ctx => ctx.field.name;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$4(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(changed, ctx) {
			const each_value = ctx.fields;
			group_outros();
			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
			check_outros();
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let $valuesForm;
	let $form;
	component_subscribe($$self, valuesForm, $$value => $$invalidate("$valuesForm", $valuesForm = $$value));
	let { fields = [] } = $$props;
	let values = [];
	let isValidForm = true;

	const setValuesForm = (isValidForm, values) => {
		valuesForm.set({ isValidForm, values: { ...values } });
	};

	const changeValueHander = event => {
		values[`${event.detail.name}`] = event.detail.value;

		fields.filter(field => {
			if (field.name === event.detail.name) {
				field.value = event.detail.value;
			}
		});

		setValuesForm(isValidForm, values);
	};

	let fieldsToValidate = {};

	const form = validator(() => {
		if (fields.length > 0) {
			fields.map(field => {
				let { validation } = field;
				const value = field.value ? field.value : null;

				const fieldValidate = {
					[field.name]: {
						value: values[field.name] ? values[field.name] : value,
						validators: validation,
						file: field.type === "file" ? field.file : null
					}
				};

				fieldsToValidate = { ...fieldsToValidate, ...fieldValidate };
			});
		}

		return fieldsToValidate;
	});

	component_subscribe($$self, form, value => $$invalidate("$form", $form = value));

	form.subscribe(data => {
		$$invalidate("isValidForm", isValidForm = data.valid);
		setValuesForm(isValidForm, values);
	});

	onMount(() => {
	});

	$$self.$set = $$props => {
		if ("fields" in $$props) $$invalidate("fields", fields = $$props.fields);
	};

	return {
		fields,
		isValidForm,
		changeValueHander,
		form,
		$form
	};
}

class Field extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { fields: 0 });
	}
}

/* src/Component.svelte generated by Svelte v3.15.0 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-59kba7-style";
	style.textContent = ".custom-form.svelte-59kba7 .form-group{width:30%;border:solid 1px red}.custom-form.svelte-59kba7 .form-group .list-files .file{background-color:#303534;color:white}";
	append(document.head, style);
}

function create_fragment$9(ctx) {
	let form;
	let t0;
	let button;
	let current;
	let dispose;
	const field = new Field({ props: { fields: ctx.fields } });

	return {
		c() {
			form = element("form");
			create_component(field.$$.fragment);
			t0 = space();
			button = element("button");
			button.textContent = "Submit";
			attr(button, "class", "btn btn-primary");
			attr(button, "type", "submit");
			attr(form, "class", "custom-form svelte-59kba7");
			dispose = listen(form, "submit", prevent_default(onSubmit));
		},
		m(target, anchor) {
			insert(target, form, anchor);
			mount_component(field, form, null);
			append(form, t0);
			append(form, button);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(field.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(field.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(form);
			destroy_component(field);
			dispose();
		}
	};
}

function onSubmit() {
	const data = get_store_value(valuesForm);
	console.log("data.values", data.values);
}

function instance$9($$self) {
	const fields = [
		{
			type: "file",
			name: "file",
			id: "file",
			multiple: true,
			validation: ["file"],
			file: { types: ["png", "jpg"], maxsize: 0.5 }
		}
	];

	return { fields };
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-59kba7-style")) add_css$1();
		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});
	}
}

const target = document.createElement("div");
document.body.appendChild(target);

new Component({
  target,
  props: {}
});
