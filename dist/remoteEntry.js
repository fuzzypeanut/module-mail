var Jt = Array.isArray, Hn = Array.prototype.indexOf, qe = Array.prototype.includes, lt = Array.from, Kn = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, Yn = Object.prototype, Wn = Array.prototype, Gn = Object.getPrototypeOf, It = Object.isExtensible;
const Jn = () => {
};
function Xn(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Xt() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const C = 2, at = 4, ft = 8, Zt = 1 << 24, le = 16, ee = 32, Oe = 64, mt = 128, Y = 512, D = 1024, F = 2048, Q = 4096, V = 8192, _e = 16384, Re = 32768, ze = 65536, jt = 1 << 17, $t = 1 << 18, He = 1 << 19, Zn = 1 << 20, de = 1 << 25, Ce = 65536, gt = 1 << 21, Tt = 1 << 22, pe = 1 << 23, vt = /* @__PURE__ */ Symbol("$state"), ke = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function $n(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Qn() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function er(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function tr(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function nr() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function rr(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function ir() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function sr() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function lr() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function ar() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function fr() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const or = 1, ur = 2, cr = 16, vr = 2, N = /* @__PURE__ */ Symbol(), dr = "http://www.w3.org/1999/xhtml";
function hr() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Qt(e) {
  return e === this.v;
}
function _r(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function en(e) {
  return !_r(e, this.v);
}
let B = null;
function Ve(e) {
  B = e;
}
function tn(e, t = !1, n) {
  B = {
    p: B,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: null
  };
}
function nn(e) {
  var t = (
    /** @type {ComponentContext} */
    B
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      En(r);
  }
  return t.i = !0, B = t.p, /** @type {T} */
  {};
}
function rn() {
  return !0;
}
let Se = [];
function sn() {
  var e = Se;
  Se = [], Xn(e);
}
function Le(e) {
  if (Se.length === 0 && !Ze) {
    var t = Se;
    queueMicrotask(() => {
      t === Se && sn();
    });
  }
  Se.push(e);
}
function pr() {
  for (; Se.length > 0; )
    sn();
}
function ln(e) {
  var t = w;
  if (t === null)
    return g.f |= pe, e;
  if ((t.f & Re) === 0 && (t.f & at) === 0)
    throw e;
  he(e, t);
}
function he(e, t) {
  for (; t !== null; ) {
    if ((t.f & mt) !== 0) {
      if ((t.f & Re) === 0)
        throw e;
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    }
    t = t.parent;
  }
  throw e;
}
const mr = -7169;
function S(e, t) {
  e.f = e.f & mr | t;
}
function At(e) {
  (e.f & Y) !== 0 || e.deps === null ? S(e, D) : S(e, Q);
}
function an(e) {
  if (e !== null)
    for (const t of e)
      (t.f & C) === 0 || (t.f & Ce) === 0 || (t.f ^= Ce, an(
        /** @type {Derived} */
        t.deps
      ));
}
function fn(e, t, n) {
  (e.f & F) !== 0 ? t.add(e) : (e.f & Q) !== 0 && n.add(e), an(e.deps), S(e, D);
}
const tt = /* @__PURE__ */ new Set();
let b = null, wt = null, X = null, O = [], ot = null, bt = !1, Ze = !1;
class me {
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #t = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #a = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #e = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #s = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #n = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #l = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #r = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #i = /* @__PURE__ */ new Map();
  is_fork = !1;
  #f = !1;
  #u() {
    return this.is_fork || this.#s > 0;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    this.#i.has(t) || this.#i.set(t, { d: [], m: [] });
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   */
  unskip_effect(t) {
    var n = this.#i.get(t);
    if (n) {
      this.#i.delete(t);
      for (var r of n.d)
        S(r, F), Z(r);
      for (r of n.m)
        S(r, Q), Z(r);
    }
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    O = [], this.apply();
    var n = [], r = [];
    for (const i of t)
      this.#o(i, n, r);
    if (this.#u()) {
      this.#c(r), this.#c(n);
      for (const [i, s] of this.#i)
        vn(i, s);
    } else {
      for (const i of this.#t) i();
      this.#t.clear(), this.#e === 0 && this.#d(), wt = this, b = null, Lt(r), Lt(n), wt = null, this.#n?.resolve();
    }
    X = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #o(t, n, r) {
    t.f ^= D;
    for (var i = t.first; i !== null; ) {
      var s = i.f, o = (s & (ee | Oe)) !== 0, l = o && (s & D) !== 0, a = l || (s & V) !== 0 || this.#i.has(i);
      if (!a && i.fn !== null) {
        o ? i.f ^= D : (s & at) !== 0 ? n.push(i) : et(i) && ((s & le) !== 0 && this.#r.add(i), Ue(i));
        var f = i.first;
        if (f !== null) {
          i = f;
          continue;
        }
      }
      for (; i !== null; ) {
        var v = i.next;
        if (v !== null) {
          i = v;
          break;
        }
        i = i.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #c(t) {
    for (var n = 0; n < t.length; n += 1)
      fn(t[n], this.#l, this.#r);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, n) {
    n !== N && !this.previous.has(t) && this.previous.set(t, n), (t.f & pe) === 0 && (this.current.set(t, t.v), X?.set(t, t.v));
  }
  activate() {
    b = this, this.apply();
  }
  deactivate() {
    b === this && (b = null, X = null);
  }
  flush() {
    if (this.activate(), O.length > 0) {
      if (on(), b !== null && b !== this)
        return;
    } else this.#e === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#a) t(this);
    this.#a.clear();
  }
  #d() {
    if (tt.size > 1) {
      this.previous.clear();
      var t = X, n = !0;
      for (const i of tt) {
        if (i === this) {
          n = !1;
          continue;
        }
        const s = [];
        for (const [l, a] of this.current) {
          if (i.current.has(l))
            if (n && a !== i.current.get(l))
              i.current.set(l, a);
            else
              continue;
          s.push(l);
        }
        if (s.length === 0)
          continue;
        const o = [...i.current.keys()].filter((l) => !this.current.has(l));
        if (o.length > 0) {
          var r = O;
          O = [];
          const l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
          for (const f of s)
            un(f, o, l, a);
          if (O.length > 0) {
            b = i, i.apply();
            for (const f of O)
              i.#o(f, [], []);
            i.deactivate();
          }
          O = r;
        }
      }
      b = null, X = t;
    }
    tt.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#e += 1, t && (this.#s += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#e -= 1, t && (this.#s -= 1), !this.#f && (this.#f = !0, Le(() => {
      this.#f = !1, this.#u() ? O.length > 0 && this.flush() : this.revive();
    }));
  }
  revive() {
    for (const t of this.#l)
      this.#r.delete(t), S(t, F), Z(t);
    for (const t of this.#r)
      S(t, Q), Z(t);
    this.flush();
  }
  /** @param {() => void} fn */
  oncommit(t) {
    this.#t.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#a.add(t);
  }
  settled() {
    return (this.#n ??= Xt()).promise;
  }
  static ensure() {
    if (b === null) {
      const t = b = new me();
      tt.add(b), Ze || Le(() => {
        b === t && t.flush();
      });
    }
    return b;
  }
  apply() {
  }
}
function gr(e) {
  var t = Ze;
  Ze = !0;
  try {
    for (var n; ; ) {
      if (pr(), O.length === 0 && (b?.flush(), O.length === 0))
        return ot = null, /** @type {T} */
        n;
      on();
    }
  } finally {
    Ze = t;
  }
}
function on() {
  bt = !0;
  var e = null;
  try {
    for (var t = 0; O.length > 0; ) {
      var n = me.ensure();
      if (t++ > 1e3) {
        var r, i;
        wr();
      }
      n.process(O), ge.clear();
    }
  } finally {
    O = [], bt = !1, ot = null;
  }
}
function wr() {
  try {
    ir();
  } catch (e) {
    he(e, ot);
  }
}
let se = null;
function Lt(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (_e | V)) === 0 && et(r) && (se = /* @__PURE__ */ new Set(), Ue(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Sn(r), se?.size > 0)) {
        ge.clear();
        for (const i of se) {
          if ((i.f & (_e | V)) !== 0) continue;
          const s = [i];
          let o = i.parent;
          for (; o !== null; )
            se.has(o) && (se.delete(o), s.push(o)), o = o.parent;
          for (let l = s.length - 1; l >= 0; l--) {
            const a = s[l];
            (a.f & (_e | V)) === 0 && Ue(a);
          }
        }
        se.clear();
      }
    }
    se = null;
  }
}
function un(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const s = i.f;
      (s & C) !== 0 ? un(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (s & (Tt | le)) !== 0 && (s & F) === 0 && cn(i, t, r) && (S(i, F), Z(
        /** @type {Effect} */
        i
      ));
    }
}
function cn(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (qe.call(t, i))
        return !0;
      if ((i.f & C) !== 0 && cn(
        /** @type {Derived} */
        i,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Z(e) {
  var t = ot = e, n = t.b;
  if (n?.is_pending && (e.f & (at | ft | Zt)) !== 0 && (e.f & Re) === 0) {
    n.defer_effect(e);
    return;
  }
  for (; t.parent !== null; ) {
    t = t.parent;
    var r = t.f;
    if (bt && t === w && (r & le) !== 0 && (r & $t) === 0 && (r & Re) !== 0)
      return;
    if ((r & (Oe | ee)) !== 0) {
      if ((r & D) === 0)
        return;
      t.f ^= D;
    }
  }
  O.push(t);
}
function vn(e, t) {
  if (!((e.f & ee) !== 0 && (e.f & D) !== 0)) {
    (e.f & F) !== 0 ? t.d.push(e) : (e.f & Q) !== 0 && t.m.push(e), S(e, D);
    for (var n = e.first; n !== null; )
      vn(n, t), n = n.next;
  }
}
function br(e) {
  let t = 0, n = Fe(0), r;
  return () => {
    Rt() && (m(n), xn(() => (t === 0 && (r = Ot(() => e(() => $e(n)))), t += 1, () => {
      Le(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, $e(n));
      });
    })));
  };
}
var yr = ze | He;
function Er(e, t, n, r) {
  new xr(e, t, n, r);
}
class xr {
  /** @type {Boundary | null} */
  parent;
  is_pending = !1;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #t;
  /** @type {TemplateNode | null} */
  #a = null;
  /** @type {BoundaryProps} */
  #e;
  /** @type {((anchor: Node) => void)} */
  #s;
  /** @type {Effect} */
  #n;
  /** @type {Effect | null} */
  #l = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {DocumentFragment | null} */
  #f = null;
  #u = 0;
  #o = 0;
  #c = !1;
  /** @type {Set<Effect>} */
  #d = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #h = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #v = null;
  #w = br(() => (this.#v = Fe(this.#u), () => {
    this.#v = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, i) {
    this.#t = t, this.#e = n, this.#s = (s) => {
      var o = (
        /** @type {Effect} */
        w
      );
      o.b = this, o.f |= mt, r(s);
    }, this.parent = /** @type {Effect} */
    w.b, this.transform_error = i ?? this.parent?.transform_error ?? ((s) => s), this.#n = Ct(() => {
      this.#m();
    }, yr);
  }
  #b() {
    try {
      this.#l = K(() => this.#s(this.#t));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #y(t) {
    const n = this.#e.failed;
    n && (this.#i = K(() => {
      n(
        this.#t,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #E() {
    const t = this.#e.pending;
    t && (this.is_pending = !0, this.#r = K(() => t(this.#t)), Le(() => {
      var n = this.#f = document.createDocumentFragment(), r = Me();
      n.append(r), this.#l = this.#p(() => (me.ensure(), K(() => this.#s(r)))), this.#o === 0 && (this.#t.before(n), this.#f = null, De(
        /** @type {Effect} */
        this.#r,
        () => {
          this.#r = null;
        }
      ), this.#_());
    }));
  }
  #m() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#o = 0, this.#u = 0, this.#l = K(() => {
        this.#s(this.#t);
      }), this.#o > 0) {
        var t = this.#f = document.createDocumentFragment();
        Mn(this.#l, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#e.pending
        );
        this.#r = K(() => n(this.#t));
      } else
        this.#_();
    } catch (n) {
      this.error(n);
    }
  }
  #_() {
    this.is_pending = !1;
    for (const t of this.#d)
      S(t, F), Z(t);
    for (const t of this.#h)
      S(t, Q), Z(t);
    this.#d.clear(), this.#h.clear();
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    fn(t, this.#d, this.#h);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#e.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #p(t) {
    var n = w, r = g, i = B;
    re(this.#n), G(this.#n), Ve(this.#n.ctx);
    try {
      return t();
    } catch (s) {
      return ln(s), null;
    } finally {
      re(n), G(r), Ve(i);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #g(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#g(t);
      return;
    }
    this.#o += t, this.#o === 0 && (this.#_(), this.#r && De(this.#r, () => {
      this.#r = null;
    }), this.#f && (this.#t.before(this.#f), this.#f = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#g(t), this.#u += t, !(!this.#v || this.#c) && (this.#c = !0, Le(() => {
      this.#c = !1, this.#v && Be(this.#v, this.#u);
    }));
  }
  get_effect_pending() {
    return this.#w(), m(
      /** @type {Source<number>} */
      this.#v
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#e.onerror;
    let r = this.#e.failed;
    if (!n && !r)
      throw t;
    this.#l && (j(this.#l), this.#l = null), this.#r && (j(this.#r), this.#r = null), this.#i && (j(this.#i), this.#i = null);
    var i = !1, s = !1;
    const o = () => {
      if (i) {
        hr();
        return;
      }
      i = !0, s && fr(), this.#i !== null && De(this.#i, () => {
        this.#i = null;
      }), this.#p(() => {
        me.ensure(), this.#m();
      });
    }, l = (a) => {
      try {
        s = !0, n?.(a, o), s = !1;
      } catch (f) {
        he(f, this.#n && this.#n.parent);
      }
      r && (this.#i = this.#p(() => {
        me.ensure();
        try {
          return K(() => {
            var f = (
              /** @type {Effect} */
              w
            );
            f.b = this, f.f |= mt, r(
              this.#t,
              () => a,
              () => o
            );
          });
        } catch (f) {
          return he(
            f,
            /** @type {Effect} */
            this.#n.parent
          ), null;
        }
      }));
    };
    Le(() => {
      var a;
      try {
        a = this.transform_error(t);
      } catch (f) {
        he(f, this.#n && this.#n.parent);
        return;
      }
      a !== null && typeof a == "object" && typeof /** @type {any} */
      a.then == "function" ? a.then(
        l,
        /** @param {unknown} e */
        (f) => he(f, this.#n && this.#n.parent)
      ) : l(a);
    });
  }
}
function kr(e, t, n, r) {
  const i = Mt;
  var s = e.filter((c) => !c.settled);
  if (n.length === 0 && s.length === 0) {
    r(t.map(i));
    return;
  }
  var o = (
    /** @type {Effect} */
    w
  ), l = Sr(), a = s.length === 1 ? s[0].promise : s.length > 1 ? Promise.all(s.map((c) => c.promise)) : null;
  function f(c) {
    l();
    try {
      r(c);
    } catch (d) {
      (o.f & _e) === 0 && he(d, o);
    }
    yt();
  }
  if (n.length === 0) {
    a.then(() => f(t.map(i)));
    return;
  }
  function v() {
    l(), Promise.all(n.map((c) => /* @__PURE__ */ Ar(c))).then((c) => f([...t.map(i), ...c])).catch((c) => he(c, o));
  }
  a ? a.then(v) : v();
}
function Sr() {
  var e = w, t = g, n = B, r = b;
  return function(s = !0) {
    re(e), G(t), Ve(n), s && r?.activate();
  };
}
function yt(e = !0) {
  re(null), G(null), Ve(null), e && b?.deactivate();
}
function Tr() {
  var e = (
    /** @type {Boundary} */
    /** @type {Effect} */
    w.b
  ), t = (
    /** @type {Batch} */
    b
  ), n = e.is_rendered();
  return e.update_pending_count(1), t.increment(n), () => {
    e.update_pending_count(-1), t.decrement(n);
  };
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
  var t = C | F, n = g !== null && (g.f & C) !== 0 ? (
    /** @type {Derived} */
    g
  ) : null;
  return w !== null && (w.f |= He), {
    ctx: B,
    deps: null,
    effects: null,
    equals: Qt,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      N
    ),
    wv: 0,
    parent: n ?? w,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function Ar(e, t, n) {
  /** @type {Effect | null} */
  w === null && Qn();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = Fe(
    /** @type {V} */
    N
  ), o = !g, l = /* @__PURE__ */ new Map();
  return Kr(() => {
    var a = Xt();
    i = a.promise;
    try {
      Promise.resolve(e()).then(a.resolve, a.reject).finally(yt);
    } catch (d) {
      a.reject(d), yt();
    }
    var f = (
      /** @type {Batch} */
      b
    );
    if (o) {
      var v = Tr();
      l.get(f)?.reject(ke), l.delete(f), l.set(f, a);
    }
    const c = (d, _ = void 0) => {
      if (f.activate(), _)
        _ !== ke && (s.f |= pe, Be(s, _));
      else {
        (s.f & pe) !== 0 && (s.f ^= pe), Be(s, d);
        for (const [u, h] of l) {
          if (l.delete(u), u === f) break;
          h.reject(ke);
        }
      }
      v && v();
    };
    a.promise.then(c, (d) => c(null, d || "unknown"));
  }), Br(() => {
    for (const a of l.values())
      a.reject(ke);
  }), new Promise((a) => {
    function f(v) {
      function c() {
        v === i ? a(s) : f(i);
      }
      v.then(c, c);
    }
    f(i);
  });
}
// @__NO_SIDE_EFFECTS__
function Mr(e) {
  const t = /* @__PURE__ */ Mt(e);
  return Dn(t), t;
}
// @__NO_SIDE_EFFECTS__
function Dr(e) {
  const t = /* @__PURE__ */ Mt(e);
  return t.equals = en, t;
}
function Nr(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      j(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Rr(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & C) === 0)
      return (t.f & _e) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function Dt(e) {
  var t, n = w;
  re(Rr(e));
  try {
    e.f &= ~Ce, Nr(e), t = Fn(e);
  } finally {
    re(n);
  }
  return t;
}
function dn(e) {
  var t = Dt(e);
  if (!e.equals(t) && (e.wv = Rn(), (!b?.is_fork || e.deps === null) && (e.v = t, e.deps === null))) {
    S(e, D);
    return;
  }
  Pe || (X !== null ? (Rt() || b?.is_fork) && X.set(e, t) : At(e));
}
function Cr(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(ke), t.teardown = Jn, t.ac = null, Qe(t, 0), Ft(t));
}
function hn(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Ue(t);
}
let Et = /* @__PURE__ */ new Set();
const ge = /* @__PURE__ */ new Map();
let _n = !1;
function Fe(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Qt,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function R(e, t) {
  const n = Fe(e);
  return Dn(n), n;
}
// @__NO_SIDE_EFFECTS__
function Fr(e, t = !1, n = !0) {
  const r = Fe(e);
  return t || (r.equals = en), r;
}
function x(e, t, n = !1) {
  g !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!$ || (g.f & jt) !== 0) && rn() && (g.f & (C | le | Tt | jt)) !== 0 && (W === null || !qe.call(W, e)) && ar();
  let r = n ? Te(t) : t;
  return Be(e, r);
}
function Be(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Pe ? ge.set(e, t) : ge.set(e, n), e.v = t;
    var r = me.ensure();
    if (r.capture(e, n), (e.f & C) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & F) !== 0 && Dt(i), At(i);
    }
    e.wv = Rn(), pn(e, F), w !== null && (w.f & D) !== 0 && (w.f & (ee | Oe)) === 0 && (H === null ? Gr([e]) : H.push(e)), !r.is_fork && Et.size > 0 && !_n && Pr();
  }
  return t;
}
function Pr() {
  _n = !1;
  for (const e of Et)
    (e.f & D) !== 0 && S(e, Q), et(e) && Ue(e);
  Et.clear();
}
function $e(e) {
  x(e, e.v + 1);
}
function pn(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = n.length, i = 0; i < r; i++) {
      var s = n[i], o = s.f, l = (o & F) === 0;
      if (l && S(s, t), (o & C) !== 0) {
        var a = (
          /** @type {Derived} */
          s
        );
        X?.delete(a), (o & Ce) === 0 && (o & Y && (s.f |= Ce), pn(a, Q));
      } else l && ((o & le) !== 0 && se !== null && se.add(
        /** @type {Effect} */
        s
      ), Z(
        /** @type {Effect} */
        s
      ));
    }
}
function Te(e) {
  if (typeof e != "object" || e === null || vt in e)
    return e;
  const t = Gn(e);
  if (t !== Yn && t !== Wn)
    return e;
  var n = /* @__PURE__ */ new Map(), r = Jt(e), i = /* @__PURE__ */ R(0), s = Ne, o = (l) => {
    if (Ne === s)
      return l();
    var a = g, f = Ne;
    G(null), Bt(s);
    var v = l();
    return G(a), Bt(f), v;
  };
  return r && n.set("length", /* @__PURE__ */ R(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, f) {
        (!("value" in f) || f.configurable === !1 || f.enumerable === !1 || f.writable === !1) && sr();
        var v = n.get(a);
        return v === void 0 ? o(() => {
          var c = /* @__PURE__ */ R(f.value);
          return n.set(a, c), c;
        }) : x(v, f.value, !0), !0;
      },
      deleteProperty(l, a) {
        var f = n.get(a);
        if (f === void 0) {
          if (a in l) {
            const v = o(() => /* @__PURE__ */ R(N));
            n.set(a, v), $e(i);
          }
        } else
          x(f, N), $e(i);
        return !0;
      },
      get(l, a, f) {
        if (a === vt)
          return e;
        var v = n.get(a), c = a in l;
        if (v === void 0 && (!c || Xe(l, a)?.writable) && (v = o(() => {
          var _ = Te(c ? l[a] : N), u = /* @__PURE__ */ R(_);
          return u;
        }), n.set(a, v)), v !== void 0) {
          var d = m(v);
          return d === N ? void 0 : d;
        }
        return Reflect.get(l, a, f);
      },
      getOwnPropertyDescriptor(l, a) {
        var f = Reflect.getOwnPropertyDescriptor(l, a);
        if (f && "value" in f) {
          var v = n.get(a);
          v && (f.value = m(v));
        } else if (f === void 0) {
          var c = n.get(a), d = c?.v;
          if (c !== void 0 && d !== N)
            return {
              enumerable: !0,
              configurable: !0,
              value: d,
              writable: !0
            };
        }
        return f;
      },
      has(l, a) {
        if (a === vt)
          return !0;
        var f = n.get(a), v = f !== void 0 && f.v !== N || Reflect.has(l, a);
        if (f !== void 0 || w !== null && (!v || Xe(l, a)?.writable)) {
          f === void 0 && (f = o(() => {
            var d = v ? Te(l[a]) : N, _ = /* @__PURE__ */ R(d);
            return _;
          }), n.set(a, f));
          var c = m(f);
          if (c === N)
            return !1;
        }
        return v;
      },
      set(l, a, f, v) {
        var c = n.get(a), d = a in l;
        if (r && a === "length")
          for (var _ = f; _ < /** @type {Source<number>} */
          c.v; _ += 1) {
            var u = n.get(_ + "");
            u !== void 0 ? x(u, N) : _ in l && (u = o(() => /* @__PURE__ */ R(N)), n.set(_ + "", u));
          }
        if (c === void 0)
          (!d || Xe(l, a)?.writable) && (c = o(() => /* @__PURE__ */ R(void 0)), x(c, Te(f)), n.set(a, c));
        else {
          d = c.v !== N;
          var h = o(() => Te(f));
          x(c, h);
        }
        var y = Reflect.getOwnPropertyDescriptor(l, a);
        if (y?.set && y.set.call(v, f), !d) {
          if (r && typeof a == "string") {
            var T = (
              /** @type {Source<number>} */
              n.get("length")
            ), k = Number(a);
            Number.isInteger(k) && k >= T.v && x(T, k + 1);
          }
          $e(i);
        }
        return !0;
      },
      ownKeys(l) {
        m(i);
        var a = Reflect.ownKeys(l).filter((c) => {
          var d = n.get(c);
          return d === void 0 || d.v !== N;
        });
        for (var [f, v] of n)
          v.v !== N && !(f in l) && a.push(f);
        return a;
      },
      setPrototypeOf() {
        lr();
      }
    }
  );
}
var qt, mn, gn, wn;
function Or() {
  if (qt === void 0) {
    qt = window, mn = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    gn = Xe(t, "firstChild").get, wn = Xe(t, "nextSibling").get, It(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), It(n) && (n.__t = void 0);
  }
}
function Me(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function bn(e) {
  return (
    /** @type {TemplateNode | null} */
    gn.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function ut(e) {
  return (
    /** @type {TemplateNode | null} */
    wn.call(e)
  );
}
function A(e, t) {
  return /* @__PURE__ */ bn(e);
}
function P(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ ut(r);
  return r;
}
function Ir(e) {
  e.textContent = "";
}
function yn() {
  return !1;
}
function jr(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(dr, e, void 0)
  );
}
let zt = !1;
function Lr() {
  zt || (zt = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t.__on_r?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function Nt(e) {
  var t = g, n = w;
  G(null), re(null);
  try {
    return e();
  } finally {
    G(t), re(n);
  }
}
function qr(e, t, n, r = n) {
  e.addEventListener(t, () => Nt(n));
  const i = e.__on_r;
  i ? e.__on_r = () => {
    i(), r(!0);
  } : e.__on_r = () => r(!0), Lr();
}
function zr(e) {
  w === null && (g === null && rr(), nr()), Pe && tr();
}
function Vr(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function we(e, t, n) {
  var r = w;
  r !== null && (r.f & V) !== 0 && (e |= V);
  var i = {
    ctx: B,
    deps: null,
    nodes: null,
    f: e | F | Y,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (n)
    try {
      Ue(i);
    } catch (l) {
      throw j(i), l;
    }
  else t !== null && Z(i);
  var s = i;
  if (n && s.deps === null && s.teardown === null && s.nodes === null && s.first === s.last && // either `null`, or a singular child
  (s.f & He) === 0 && (s = s.first, (e & le) !== 0 && (e & ze) !== 0 && s !== null && (s.f |= ze)), s !== null && (s.parent = r, r !== null && Vr(s, r), g !== null && (g.f & C) !== 0 && (e & Oe) === 0)) {
    var o = (
      /** @type {Derived} */
      g
    );
    (o.effects ??= []).push(s);
  }
  return i;
}
function Rt() {
  return g !== null && !$;
}
function Br(e) {
  const t = we(ft, null, !1);
  return S(t, D), t.teardown = e, t;
}
function Ur(e) {
  zr();
  var t = (
    /** @type {Effect} */
    w.f
  ), n = !g && (t & ee) !== 0 && (t & Re) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      B
    );
    (r.e ??= []).push(e);
  } else
    return En(e);
}
function En(e) {
  return we(at | Zn, e, !1);
}
function Hr(e) {
  me.ensure();
  const t = we(Oe | He, e, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? De(t, () => {
      j(t), r(void 0);
    }) : (j(t), r(void 0));
  });
}
function Kr(e) {
  return we(Tt | He, e, !0);
}
function xn(e, t = 0) {
  return we(ft | t, e, !0);
}
function nt(e, t = [], n = [], r = []) {
  kr(r, t, n, (i) => {
    we(ft, () => e(...i.map(m)), !0);
  });
}
function Ct(e, t = 0) {
  var n = we(le | t, e, !0);
  return n;
}
function K(e) {
  return we(ee | He, e, !0);
}
function kn(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Pe, r = g;
    Vt(!0), G(null);
    try {
      t.call(null);
    } finally {
      Vt(n), G(r);
    }
  }
}
function Ft(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && Nt(() => {
      i.abort(ke);
    });
    var r = n.next;
    (n.f & Oe) !== 0 ? n.parent = null : j(n, t), n = r;
  }
}
function Yr(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & ee) === 0 && j(t), t = n;
  }
}
function j(e, t = !0) {
  var n = !1;
  (t || (e.f & $t) !== 0) && e.nodes !== null && e.nodes.end !== null && (Wr(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), Ft(e, t && !n), Qe(e, 0), S(e, _e);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const s of r)
      s.stop();
  kn(e);
  var i = e.parent;
  i !== null && i.first !== null && Sn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function Wr(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ ut(e);
    e.remove(), e = n;
  }
}
function Sn(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function De(e, t, n = !0) {
  var r = [];
  Tn(e, r, !0);
  var i = () => {
    n && j(e), t && t();
  }, s = r.length;
  if (s > 0) {
    var o = () => --s || i();
    for (var l of r)
      l.out(o);
  } else
    i();
}
function Tn(e, t, n) {
  if ((e.f & V) === 0) {
    e.f ^= V;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const l of r)
        (l.is_global || n) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var s = i.next, o = (i.f & ze) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (i.f & ee) !== 0 && (e.f & le) !== 0;
      Tn(i, t, o ? n : !1), i = s;
    }
  }
}
function Pt(e) {
  An(e, !0);
}
function An(e, t) {
  if ((e.f & V) !== 0) {
    e.f ^= V, (e.f & D) === 0 && (S(e, F), Z(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & ze) !== 0 || (n.f & ee) !== 0;
      An(n, i ? t : !1), n = r;
    }
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const o of s)
        (o.is_global || t) && o.in();
  }
}
function Mn(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ ut(n);
      t.append(n), n = i;
    }
}
let st = !1, Pe = !1;
function Vt(e) {
  Pe = e;
}
let g = null, $ = !1;
function G(e) {
  g = e;
}
let w = null;
function re(e) {
  w = e;
}
let W = null;
function Dn(e) {
  g !== null && (W === null ? W = [e] : W.push(e));
}
let I = null, z = 0, H = null;
function Gr(e) {
  H = e;
}
let Nn = 1, Ae = 0, Ne = Ae;
function Bt(e) {
  Ne = e;
}
function Rn() {
  return ++Nn;
}
function et(e) {
  var t = e.f;
  if ((t & F) !== 0)
    return !0;
  if (t & C && (e.f &= ~Ce), (t & Q) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var s = n[i];
      if (et(
        /** @type {Derived} */
        s
      ) && dn(
        /** @type {Derived} */
        s
      ), s.wv > e.wv)
        return !0;
    }
    (t & Y) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    X === null && S(e, D);
  }
  return !1;
}
function Cn(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(W !== null && qe.call(W, e)))
    for (var i = 0; i < r.length; i++) {
      var s = r[i];
      (s.f & C) !== 0 ? Cn(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (n ? S(s, F) : (s.f & D) !== 0 && S(s, Q), Z(
        /** @type {Effect} */
        s
      ));
    }
}
function Fn(e) {
  var t = I, n = z, r = H, i = g, s = W, o = B, l = $, a = Ne, f = e.f;
  I = /** @type {null | Value[]} */
  null, z = 0, H = null, g = (f & (ee | Oe)) === 0 ? e : null, W = null, Ve(e.ctx), $ = !1, Ne = ++Ae, e.ac !== null && (Nt(() => {
    e.ac.abort(ke);
  }), e.ac = null);
  try {
    e.f |= gt;
    var v = (
      /** @type {Function} */
      e.fn
    ), c = v();
    e.f |= Re;
    var d = e.deps, _ = b?.is_fork;
    if (I !== null) {
      var u;
      if (_ || Qe(e, z), d !== null && z > 0)
        for (d.length = z + I.length, u = 0; u < I.length; u++)
          d[z + u] = I[u];
      else
        e.deps = d = I;
      if (Rt() && (e.f & Y) !== 0)
        for (u = z; u < d.length; u++)
          (d[u].reactions ??= []).push(e);
    } else !_ && d !== null && z < d.length && (Qe(e, z), d.length = z);
    if (rn() && H !== null && !$ && d !== null && (e.f & (C | Q | F)) === 0)
      for (u = 0; u < /** @type {Source[]} */
      H.length; u++)
        Cn(
          H[u],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (Ae++, i.deps !== null)
        for (let h = 0; h < n; h += 1)
          i.deps[h].rv = Ae;
      if (t !== null)
        for (const h of t)
          h.rv = Ae;
      H !== null && (r === null ? r = H : r.push(.../** @type {Source[]} */
      H));
    }
    return (e.f & pe) !== 0 && (e.f ^= pe), c;
  } catch (h) {
    return ln(h);
  } finally {
    e.f ^= gt, I = t, z = n, H = r, g = i, W = s, Ve(o), $ = l, Ne = a;
  }
}
function Jr(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = Hn.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & C) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (I === null || !qe.call(I, t))) {
    var s = (
      /** @type {Derived} */
      t
    );
    (s.f & Y) !== 0 && (s.f ^= Y, s.f &= ~Ce), At(s), Cr(s), Qe(s, 0);
  }
}
function Qe(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Jr(e, n[r]);
}
function Ue(e) {
  var t = e.f;
  if ((t & _e) === 0) {
    S(e, D);
    var n = w, r = st;
    w = e, st = !0;
    try {
      (t & (le | Zt)) !== 0 ? Yr(e) : Ft(e), kn(e);
      var i = Fn(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Nn;
      var s;
    } finally {
      st = r, w = n;
    }
  }
}
async function Xr() {
  await Promise.resolve(), gr();
}
function m(e) {
  var t = e.f, n = (t & C) !== 0;
  if (g !== null && !$) {
    var r = w !== null && (w.f & _e) !== 0;
    if (!r && (W === null || !qe.call(W, e))) {
      var i = g.deps;
      if ((g.f & gt) !== 0)
        e.rv < Ae && (e.rv = Ae, I === null && i !== null && i[z] === e ? z++ : I === null ? I = [e] : I.push(e));
      else {
        (g.deps ??= []).push(e);
        var s = e.reactions;
        s === null ? e.reactions = [g] : qe.call(s, g) || s.push(g);
      }
    }
  }
  if (Pe && ge.has(e))
    return ge.get(e);
  if (n) {
    var o = (
      /** @type {Derived} */
      e
    );
    if (Pe) {
      var l = o.v;
      return ((o.f & D) === 0 && o.reactions !== null || On(o)) && (l = Dt(o)), ge.set(o, l), l;
    }
    var a = (o.f & Y) === 0 && !$ && g !== null && (st || (g.f & Y) !== 0), f = (o.f & Re) === 0;
    et(o) && (a && (o.f |= Y), dn(o)), a && !f && (hn(o), Pn(o));
  }
  if (X?.has(e))
    return X.get(e);
  if ((e.f & pe) !== 0)
    throw e.v;
  return e.v;
}
function Pn(e) {
  if (e.f |= Y, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & C) !== 0 && (t.f & Y) === 0 && (hn(
        /** @type {Derived} */
        t
      ), Pn(
        /** @type {Derived} */
        t
      ));
}
function On(e) {
  if (e.v === N) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (ge.has(t) || (t.f & C) !== 0 && On(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Ot(e) {
  var t = $;
  try {
    return $ = !0, e();
  } finally {
    $ = t;
  }
}
const Zr = ["touchstart", "touchmove"];
function $r(e) {
  return Zr.includes(e);
}
const Ge = /* @__PURE__ */ Symbol("events"), In = /* @__PURE__ */ new Set(), xt = /* @__PURE__ */ new Set();
function Ye(e, t, n) {
  (t[Ge] ??= {})[e] = n;
}
function Qr(e) {
  for (var t = 0; t < e.length; t++)
    In.add(e[t]);
  for (var n of xt)
    n(e);
}
let Ut = null;
function Ht(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], s = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  Ut = e;
  var o = 0, l = Ut === e && e[Ge];
  if (l) {
    var a = i.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Ge] = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    a <= f && (o = a);
  }
  if (s = /** @type {Element} */
  i[o] || e.target, s !== t) {
    Kn(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      }
    });
    var v = g, c = w;
    G(null), re(null);
    try {
      for (var d, _ = []; s !== null; ) {
        var u = s.assignedSlot || s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var h = s[Ge]?.[r];
          h != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && h.call(s, e);
        } catch (y) {
          d ? _.push(y) : d = y;
        }
        if (e.cancelBubble || u === t || u === null)
          break;
        s = u;
      }
      if (d) {
        for (let y of _)
          queueMicrotask(() => {
            throw y;
          });
        throw d;
      }
    } finally {
      e[Ge] = t, delete e.currentTarget, G(v), re(c);
    }
  }
}
const ei = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function ti(e) {
  return (
    /** @type {string} */
    ei?.createHTML(e) ?? e
  );
}
function ni(e) {
  var t = jr("template");
  return t.innerHTML = ti(e.replaceAll("<!>", "<!---->")), t.content;
}
function ri(e, t) {
  var n = (
    /** @type {Effect} */
    w
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function ae(e, t) {
  var n = (t & vr) !== 0, r, i = !e.startsWith("<!>");
  return () => {
    r === void 0 && (r = ni(i ? e : "<!>" + e), r = /** @type {TemplateNode} */
    /* @__PURE__ */ bn(r));
    var s = (
      /** @type {TemplateNode} */
      n || mn ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return ri(s, s), s;
  };
}
function ie(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function xe(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function ii(e, t) {
  return si(e, t);
}
const rt = /* @__PURE__ */ new Map();
function si(e, { target: t, anchor: n, props: r = {}, events: i, context: s, intro: o = !0, transformError: l }) {
  Or();
  var a = void 0, f = Hr(() => {
    var v = n ?? t.appendChild(Me());
    Er(
      /** @type {TemplateNode} */
      v,
      {
        pending: () => {
        }
      },
      (_) => {
        tn({});
        var u = (
          /** @type {ComponentContext} */
          B
        );
        s && (u.c = s), i && (r.$$events = i), a = e(_, r) || {}, nn();
      },
      l
    );
    var c = /* @__PURE__ */ new Set(), d = (_) => {
      for (var u = 0; u < _.length; u++) {
        var h = _[u];
        if (!c.has(h)) {
          c.add(h);
          var y = $r(h);
          for (const J of [t, document]) {
            var T = rt.get(J);
            T === void 0 && (T = /* @__PURE__ */ new Map(), rt.set(J, T));
            var k = T.get(h);
            k === void 0 ? (J.addEventListener(h, Ht, { passive: y }), T.set(h, 1)) : T.set(h, k + 1);
          }
        }
      }
    };
    return d(lt(In)), xt.add(d), () => {
      for (var _ of c)
        for (const y of [t, document]) {
          var u = (
            /** @type {Map<string, number>} */
            rt.get(y)
          ), h = (
            /** @type {number} */
            u.get(_)
          );
          --h == 0 ? (y.removeEventListener(_, Ht), u.delete(_), u.size === 0 && rt.delete(y)) : u.set(_, h);
        }
      xt.delete(d), v !== n && v.parentNode?.removeChild(v);
    };
  });
  return kt.set(a, f), a;
}
let kt = /* @__PURE__ */ new WeakMap();
function li(e, t) {
  const n = kt.get(e);
  return n ? (kt.delete(e), n(t)) : Promise.resolve();
}
class ai {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #t = /* @__PURE__ */ new Map();
  /**
   * Map of keys to effects that are currently rendered in the DOM.
   * These effects are visible and actively part of the document tree.
   * Example:
   * ```
   * {#if condition}
   * 	foo
   * {:else}
   * 	bar
   * {/if}
   * ```
   * Can result in the entries `true->Effect` and `false->Effect`
   * @type {Map<Key, Effect>}
   */
  #a = /* @__PURE__ */ new Map();
  /**
   * Similar to #onscreen with respect to the keys, but contains branches that are not yet
   * in the DOM, because their insertion is deferred.
   * @type {Map<Key, Branch>}
   */
  #e = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #s = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #n = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#n = n;
  }
  #l = () => {
    var t = (
      /** @type {Batch} */
      b
    );
    if (this.#t.has(t)) {
      var n = (
        /** @type {Key} */
        this.#t.get(t)
      ), r = this.#a.get(n);
      if (r)
        Pt(r), this.#s.delete(n);
      else {
        var i = this.#e.get(n);
        i && (this.#a.set(n, i.effect), this.#e.delete(n), i.fragment.lastChild.remove(), this.anchor.before(i.fragment), r = i.effect);
      }
      for (const [s, o] of this.#t) {
        if (this.#t.delete(s), s === t)
          break;
        const l = this.#e.get(o);
        l && (j(l.effect), this.#e.delete(o));
      }
      for (const [s, o] of this.#a) {
        if (s === n || this.#s.has(s)) continue;
        const l = () => {
          if (Array.from(this.#t.values()).includes(s)) {
            var f = document.createDocumentFragment();
            Mn(o, f), f.append(Me()), this.#e.set(s, { effect: o, fragment: f });
          } else
            j(o);
          this.#s.delete(s), this.#a.delete(s);
        };
        this.#n || !r ? (this.#s.add(s), De(o, l, !1)) : l();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #r = (t) => {
    this.#t.delete(t);
    const n = Array.from(this.#t.values());
    for (const [r, i] of this.#e)
      n.includes(r) || (j(i.effect), this.#e.delete(r));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      b
    ), i = yn();
    if (n && !this.#a.has(t) && !this.#e.has(t))
      if (i) {
        var s = document.createDocumentFragment(), o = Me();
        s.append(o), this.#e.set(t, {
          effect: K(() => n(o)),
          fragment: s
        });
      } else
        this.#a.set(
          t,
          K(() => n(this.anchor))
        );
    if (this.#t.set(r, t), i) {
      for (const [l, a] of this.#a)
        l === t ? r.unskip_effect(a) : r.skip_effect(a);
      for (const [l, a] of this.#e)
        l === t ? r.unskip_effect(a.effect) : r.skip_effect(a.effect);
      r.oncommit(this.#l), r.ondiscard(this.#r);
    } else
      this.#l();
  }
}
function dt(e, t, n = !1) {
  var r = new ai(e), i = n ? ze : 0;
  function s(o, l) {
    r.ensure(o, l);
  }
  Ct(() => {
    var o = !1;
    t((l, a = 0) => {
      o = !0, s(a, l);
    }), o || s(!1, null);
  }, i);
}
function fi(e, t, n) {
  for (var r = [], i = t.length, s, o = t.length, l = 0; l < i; l++) {
    let c = t[l];
    De(
      c,
      () => {
        if (s) {
          if (s.pending.delete(c), s.done.add(c), s.pending.size === 0) {
            var d = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            St(lt(s.done)), d.delete(s), d.size === 0 && (e.outrogroups = null);
          }
        } else
          o -= 1;
      },
      !1
    );
  }
  if (o === 0) {
    var a = r.length === 0 && n !== null;
    if (a) {
      var f = (
        /** @type {Element} */
        n
      ), v = (
        /** @type {Element} */
        f.parentNode
      );
      Ir(v), v.append(f), e.items.clear();
    }
    St(t, !a);
  } else
    s = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(s);
}
function St(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    j(e[n], t);
}
var Kt;
function Yt(e, t, n, r, i, s = null) {
  var o = e, l = /* @__PURE__ */ new Map();
  {
    var a = (
      /** @type {Element} */
      e
    );
    o = a.appendChild(Me());
  }
  var f = null, v = /* @__PURE__ */ Dr(() => {
    var y = n();
    return Jt(y) ? y : y == null ? [] : lt(y);
  }), c, d = !0;
  function _() {
    h.fallback = f, oi(h, c, o, t, r), f !== null && (c.length === 0 ? (f.f & de) === 0 ? Pt(f) : (f.f ^= de, Je(f, null, o)) : De(f, () => {
      f = null;
    }));
  }
  var u = Ct(() => {
    c = /** @type {V[]} */
    m(v);
    for (var y = c.length, T = /* @__PURE__ */ new Set(), k = (
      /** @type {Batch} */
      b
    ), J = yn(), L = 0; L < y; L += 1) {
      var te = c[L], fe = r(te, L), q = d ? null : l.get(fe);
      q ? (q.v && Be(q.v, te), q.i && Be(q.i, L), J && k.unskip_effect(q.e)) : (q = ui(
        l,
        d ? o : Kt ??= Me(),
        te,
        fe,
        L,
        i,
        t,
        n
      ), d || (q.e.f |= de), l.set(fe, q)), T.add(fe);
    }
    if (y === 0 && s && !f && (d ? f = K(() => s(o)) : (f = K(() => s(Kt ??= Me())), f.f |= de)), y > T.size && er(), !d)
      if (J) {
        for (const [ne, ct] of l)
          T.has(ne) || k.skip_effect(ct.e);
        k.oncommit(_), k.ondiscard(() => {
        });
      } else
        _();
    m(v);
  }), h = { effect: u, items: l, outrogroups: null, fallback: f };
  d = !1;
}
function We(e) {
  for (; e !== null && (e.f & ee) === 0; )
    e = e.next;
  return e;
}
function oi(e, t, n, r, i) {
  var s = t.length, o = e.items, l = We(e.effect.first), a, f = null, v = [], c = [], d, _, u, h;
  for (h = 0; h < s; h += 1) {
    if (d = t[h], _ = i(d, h), u = /** @type {EachItem} */
    o.get(_).e, e.outrogroups !== null)
      for (const ne of e.outrogroups)
        ne.pending.delete(u), ne.done.delete(u);
    if ((u.f & de) !== 0)
      if (u.f ^= de, u === l)
        Je(u, null, n);
      else {
        var y = f ? f.next : l;
        u === e.effect.last && (e.effect.last = u.prev), u.prev && (u.prev.next = u.next), u.next && (u.next.prev = u.prev), ve(e, f, u), ve(e, u, y), Je(u, y, n), f = u, v = [], c = [], l = We(f.next);
        continue;
      }
    if ((u.f & V) !== 0 && Pt(u), u !== l) {
      if (a !== void 0 && a.has(u)) {
        if (v.length < c.length) {
          var T = c[0], k;
          f = T.prev;
          var J = v[0], L = v[v.length - 1];
          for (k = 0; k < v.length; k += 1)
            Je(v[k], T, n);
          for (k = 0; k < c.length; k += 1)
            a.delete(c[k]);
          ve(e, J.prev, L.next), ve(e, f, J), ve(e, L, T), l = T, f = L, h -= 1, v = [], c = [];
        } else
          a.delete(u), Je(u, l, n), ve(e, u.prev, u.next), ve(e, u, f === null ? e.effect.first : f.next), ve(e, f, u), f = u;
        continue;
      }
      for (v = [], c = []; l !== null && l !== u; )
        (a ??= /* @__PURE__ */ new Set()).add(l), c.push(l), l = We(l.next);
      if (l === null)
        continue;
    }
    (u.f & de) === 0 && v.push(u), f = u, l = We(u.next);
  }
  if (e.outrogroups !== null) {
    for (const ne of e.outrogroups)
      ne.pending.size === 0 && (St(lt(ne.done)), e.outrogroups?.delete(ne));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || a !== void 0) {
    var te = [];
    if (a !== void 0)
      for (u of a)
        (u.f & V) === 0 && te.push(u);
    for (; l !== null; )
      (l.f & V) === 0 && l !== e.fallback && te.push(l), l = We(l.next);
    var fe = te.length;
    if (fe > 0) {
      var q = s === 0 ? n : null;
      fi(e, te, q);
    }
  }
}
function ui(e, t, n, r, i, s, o, l) {
  var a = (o & or) !== 0 ? (o & cr) === 0 ? /* @__PURE__ */ Fr(n, !1, !1) : Fe(n) : null, f = (o & ur) !== 0 ? Fe(i) : null;
  return {
    v: a,
    i: f,
    e: K(() => (s(t, a ?? n, f ?? i, l), () => {
      e.delete(r);
    }))
  };
}
function Je(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, i = e.nodes.end, s = t && (t.f & de) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ ut(r)
      );
      if (s.before(r), r === i)
        return;
      r = o;
    }
}
function ve(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
const Wt = [...` 	
\r\f \v\uFEFF`];
function ci(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (n) {
    for (var i of Object.keys(n))
      if (n[i])
        r = r ? r + " " + i : i;
      else if (r.length)
        for (var s = i.length, o = 0; (o = r.indexOf(i, o)) >= 0; ) {
          var l = o + s;
          (o === 0 || Wt.includes(r[o - 1])) && (l === r.length || Wt.includes(r[l])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(l + 1) : o = l;
        }
  }
  return r === "" ? null : r;
}
function Gt(e, t, n, r, i, s) {
  var o = e.__className;
  if (o !== n || o === void 0) {
    var l = ci(n, r, s);
    l == null ? e.removeAttribute("class") : e.className = l, e.__className = n;
  } else if (s && i !== s)
    for (var a in s) {
      var f = !!s[a];
      (i == null || f !== !!i[a]) && e.classList.toggle(a, f);
    }
  return s;
}
function ht(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet();
  qr(e, "input", async (i) => {
    var s = i ? e.defaultValue : e.value;
    if (s = _t(e) ? pt(s) : s, n(s), b !== null && r.add(b), await Xr(), s !== (s = t())) {
      var o = e.selectionStart, l = e.selectionEnd, a = e.value.length;
      if (e.value = s ?? "", l !== null) {
        var f = e.value.length;
        o === l && l === a && f > a ? (e.selectionStart = f, e.selectionEnd = f) : (e.selectionStart = o, e.selectionEnd = Math.min(l, f));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  Ot(t) == null && e.value && (n(_t(e) ? pt(e.value) : e.value), b !== null && r.add(b)), xn(() => {
    var i = t();
    if (e === document.activeElement) {
      var s = (
        /** @type {Batch} */
        wt ?? b
      );
      if (r.has(s))
        return;
    }
    _t(e) && i === pt(e.value) || e.type === "date" && !i && !e.value || i !== e.value && (e.value = i ?? "");
  });
}
function _t(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function pt(e) {
  return e === "" ? null : +e;
}
function vi(e) {
  B === null && $n(), Ur(() => {
    const t = Ot(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
const di = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(di);
const hi = "__fuzzyPeanutSDK";
let it;
function jn() {
  if (it)
    return it;
  if (typeof window < "u") {
    const e = window[hi];
    if (e)
      return it = e, it;
  }
  throw new Error("[FuzzyPeanut] SDK not initialized. Ensure this module is running inside the FuzzyPeanut shell.");
}
const _i = "http://localhost:8080/jmap";
async function Ln(e) {
  const t = await jn().auth.getToken(), n = await fetch(_i, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`
    },
    body: JSON.stringify({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: e
    })
  });
  if (!n.ok) throw new Error(`JMAP ${n.status}`);
  return (await n.json()).methodResponses;
}
async function pi() {
  const [[, e]] = await Ln([
    ["Mailbox/get", { accountId: null, ids: null }, "a"]
  ]);
  return e.list;
}
async function mi(e, t = 50) {
  const [, [, n]] = await Ln([
    [
      "Email/query",
      {
        accountId: null,
        filter: { inMailbox: e },
        sort: [{ property: "receivedAt", isAscending: !1 }],
        limit: t
      },
      "a"
    ],
    [
      "Email/get",
      {
        accountId: null,
        "#ids": { resultOf: "a", name: "Email/query", path: "/ids" },
        properties: ["id", "subject", "from", "receivedAt", "preview", "keywords"]
      },
      "b"
    ]
  ]);
  return n.list;
}
var gi = /* @__PURE__ */ ae('<span class="unread-badge svelte-crc88l"> </span>'), wi = /* @__PURE__ */ ae('<li><button><span class="mailbox-name"> </span> <!></button></li>'), bi = /* @__PURE__ */ ae('<div class="error-banner svelte-crc88l"> </div>'), yi = /* @__PURE__ */ ae('<div class="compose-pane svelte-crc88l"><div class="compose-header svelte-crc88l"><h2 class="svelte-crc88l">New Message</h2> <button class="close-btn svelte-crc88l">✕</button></div> <div class="compose-field svelte-crc88l"><label for="compose-to" class="svelte-crc88l">To</label> <input id="compose-to" type="email" placeholder="recipient@example.com" class="svelte-crc88l"/></div> <div class="compose-field svelte-crc88l"><label for="compose-subject" class="svelte-crc88l">Subject</label> <input id="compose-subject" type="text" placeholder="Subject" class="svelte-crc88l"/></div> <textarea placeholder="Write your message…" class="svelte-crc88l"></textarea> <div class="compose-actions svelte-crc88l"><button class="send-btn svelte-crc88l">Send</button> <button class="discard-btn svelte-crc88l">Discard</button></div></div>'), Ei = /* @__PURE__ */ ae('<div class="loading-state svelte-crc88l"><span class="spinner svelte-crc88l"></span></div>'), xi = /* @__PURE__ */ ae('<div class="empty-state svelte-crc88l">No messages</div>'), ki = /* @__PURE__ */ ae('<li><div class="email-from svelte-crc88l"> </div> <div class="email-meta svelte-crc88l"><span class="email-subject svelte-crc88l"> </span> <span class="email-preview svelte-crc88l"> </span></div> <div class="email-date svelte-crc88l"> </div></li>'), Si = /* @__PURE__ */ ae('<ul class="email-list svelte-crc88l"></ul>'), Ti = /* @__PURE__ */ ae('<div class="mail-app svelte-crc88l"><aside class="mailbox-list svelte-crc88l"><div class="mailbox-header svelte-crc88l"><button class="compose-btn svelte-crc88l">+ Compose</button></div> <ul class="svelte-crc88l"></ul></aside> <main class="mail-main svelte-crc88l"><!> <!></main></div>');
function Ai(e, t) {
  tn(t, !0);
  let n = /* @__PURE__ */ R(Te([])), r = /* @__PURE__ */ R(Te([])), i = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!0), o = /* @__PURE__ */ R(null), l = /* @__PURE__ */ R("inbox"), a = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R(""), v = /* @__PURE__ */ R("");
  vi(async () => {
    try {
      x(n, await pi(), !0);
      const p = m(n).find((M) => M.role === "inbox") ?? m(n)[0];
      p && (x(i, p.id, !0), await c(p.id));
    } catch (p) {
      x(o, p instanceof Error ? p.message : "Failed to load mail", !0);
    }
    x(s, !1), jn().events.on("mail:compose", (p) => {
      const M = p;
      x(a, M?.to ?? "", !0), x(f, M?.subject ?? "", !0), x(v, ""), x(l, "compose");
    });
  });
  async function c(E) {
    x(s, !0);
    try {
      x(r, await mi(E), !0);
    } catch (p) {
      x(o, p instanceof Error ? p.message : "Failed to load emails", !0);
    }
    x(s, !1);
  }
  async function d(E) {
    x(i, E, !0), await c(E);
  }
  function _(E) {
    const p = new Date(E), M = /* @__PURE__ */ new Date();
    return p.toDateString() === M.toDateString() ? p.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : p.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  var u = Ti(), h = A(u), y = A(h), T = A(y), k = P(y, 2);
  Yt(k, 21, () => m(n), (E) => E.id, (E, p) => {
    var M = wi(), U = A(M);
    let be;
    var oe = A(U), ye = A(oe), Ie = P(oe, 2);
    {
      var je = (ue) => {
        var ce = gi(), Ke = A(ce);
        nt(() => xe(Ke, m(p).unreadEmails)), ie(ue, ce);
      };
      dt(Ie, (ue) => {
        m(p).unreadEmails > 0 && ue(je);
      });
    }
    nt(() => {
      be = Gt(U, 1, "mailbox-item svelte-crc88l", null, be, { active: m(i) === m(p).id }), xe(ye, m(p).name);
    }), Ye("click", U, () => {
      d(m(p).id), x(l, "inbox");
    }), ie(E, M);
  });
  var J = P(h, 2), L = A(J);
  {
    var te = (E) => {
      var p = bi(), M = A(p);
      nt(() => xe(M, m(o))), ie(E, p);
    };
    dt(L, (E) => {
      m(o) && E(te);
    });
  }
  var fe = P(L, 2);
  {
    var q = (E) => {
      var p = yi(), M = A(p), U = P(A(M), 2), be = P(M, 2), oe = P(A(be), 2), ye = P(be, 2), Ie = P(A(ye), 2), je = P(ye, 2), ue = P(je, 2), ce = A(ue), Ke = P(ce, 2);
      Ye("click", U, () => {
        x(l, "inbox");
      }), ht(oe, () => m(a), (Ee) => x(a, Ee)), ht(Ie, () => m(f), (Ee) => x(f, Ee)), ht(je, () => m(v), (Ee) => x(v, Ee)), Ye("click", ce, () => {
        x(l, "inbox");
      }), Ye("click", Ke, () => {
        x(l, "inbox");
      }), ie(E, p);
    }, ne = (E) => {
      var p = Ei();
      ie(E, p);
    }, ct = (E) => {
      var p = xi();
      ie(E, p);
    }, qn = (E) => {
      var p = Si();
      Yt(p, 21, () => m(r), (M) => M.id, (M, U) => {
        const be = /* @__PURE__ */ Mr(() => !m(U).keywords.$seen);
        var oe = ki();
        let ye;
        var Ie = A(oe), je = A(Ie), ue = P(Ie, 2), ce = A(ue), Ke = A(ce), Ee = P(ce, 2), zn = A(Ee), Vn = P(ue, 2), Bn = A(Vn);
        nt(
          (Un) => {
            ye = Gt(oe, 1, "email-item svelte-crc88l", null, ye, { unread: m(be) }), xe(je, m(U).from[0]?.name ?? m(U).from[0]?.email ?? "?"), xe(Ke, m(U).subject), xe(zn, m(U).preview), xe(Bn, Un);
          },
          [() => _(m(U).receivedAt)]
        ), ie(M, oe);
      }), ie(E, p);
    };
    dt(fe, (E) => {
      m(l) === "compose" ? E(q) : m(s) ? E(ne, 1) : m(r).length === 0 ? E(ct, 2) : E(qn, !1);
    });
  }
  Ye("click", T, () => {
    x(l, "compose");
  }), ie(e, u), nn();
}
Qr(["click"]);
const Di = {
  mount(e, t = {}) {
    return ii(Ai, { target: e, props: t });
  },
  unmount(e) {
    li(e);
  }
};
export {
  Di as default
};
