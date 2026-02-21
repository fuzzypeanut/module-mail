var ni = Array.isArray, Ki = Array.prototype.indexOf, Xt = Array.prototype.includes, jn = Array.from, Zi = Object.defineProperty, Tn = Object.getOwnPropertyDescriptor, Ji = Object.prototype, Qi = Array.prototype, ea = Object.getPrototypeOf, Pr = Object.isExtensible;
const ta = () => {
};
function na(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function ri() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const le = 2, Wn = 4, Vn = 8, ii = 1 << 24, pt = 16, Qe = 32, Ut = 64, cr = 128, Ge = 512, ee = 1024, de = 2048, Je = 4096, ke = 8192, Tt = 16384, Ct = 32768, $t = 65536, Fr = 1 << 17, ai = 1 << 18, Qt = 1 << 19, ra = 1 << 20, gt = 1 << 25, Lt = 65536, dr = 1 << 21, wr = 1 << 22, bt = 1 << 23, er = /* @__PURE__ */ Symbol("$state"), Dt = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function ia(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function aa() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function sa(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function oa(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function la() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function fa(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function ua() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ca() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function da() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function pa() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ha() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const va = 1, _a = 2, ma = 16, ga = 2, oe = /* @__PURE__ */ Symbol(), Ea = "http://www.w3.org/1999/xhtml", Ta = "http://www.w3.org/2000/svg", ba = "http://www.w3.org/1998/Math/MathML";
function ya() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function si(e) {
  return e === this.v;
}
function wa(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function oi(e) {
  return !wa(e, this.v);
}
let Me = null;
function Kt(e) {
  Me = e;
}
function li(e, t = !1, n) {
  Me = {
    p: Me,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: null
  };
}
function fi(e) {
  var t = (
    /** @type {ComponentContext} */
    Me
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      Di(r);
  }
  return e !== void 0 && (t.x = e), t.i = !0, Me = t.p, e ?? /** @type {T} */
  {};
}
function ui() {
  return !0;
}
let It = [];
function ci() {
  var e = It;
  It = [], na(e);
}
function qt(e) {
  if (It.length === 0 && !bn) {
    var t = It;
    queueMicrotask(() => {
      t === It && ci();
    });
  }
  It.push(e);
}
function Aa() {
  for (; It.length > 0; )
    ci();
}
function di(e) {
  var t = k;
  if (t === null)
    return I.f |= bt, e;
  if ((t.f & Ct) === 0 && (t.f & Wn) === 0)
    throw e;
  Et(e, t);
}
function Et(e, t) {
  for (; t !== null; ) {
    if ((t.f & cr) !== 0) {
      if ((t.f & Ct) === 0)
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
const Sa = -7169;
function Y(e, t) {
  e.f = e.f & Sa | t;
}
function Ar(e) {
  (e.f & Ge) !== 0 || e.deps === null ? Y(e, ee) : Y(e, Je);
}
function pi(e) {
  if (e !== null)
    for (const t of e)
      (t.f & le) === 0 || (t.f & Lt) === 0 || (t.f ^= Lt, pi(
        /** @type {Derived} */
        t.deps
      ));
}
function hi(e, t, n) {
  (e.f & de) !== 0 ? t.add(e) : (e.f & Je) !== 0 && n.add(e), pi(e.deps), Y(e, ee);
}
const Pn = /* @__PURE__ */ new Set();
let C = null, pr = null, $e = null, ye = [], Yn = null, hr = !1, bn = !1;
class yt {
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
  #o = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #e = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #a = 0;
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
  #s = /* @__PURE__ */ new Set();
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
  #l = !1;
  #u() {
    return this.is_fork || this.#a > 0;
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
        Y(r, de), Ke(r);
      for (r of n.m)
        Y(r, Je), Ke(r);
    }
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    ye = [], this.apply();
    var n = [], r = [];
    for (const i of t)
      this.#f(i, n, r);
    if (this.#u()) {
      this.#c(r), this.#c(n);
      for (const [i, a] of this.#i)
        gi(i, a);
    } else {
      for (const i of this.#t) i();
      this.#t.clear(), this.#e === 0 && this.#p(), pr = this, C = null, Ur(r), Ur(n), pr = null, this.#n?.resolve();
    }
    $e = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #f(t, n, r) {
    t.f ^= ee;
    for (var i = t.first; i !== null; ) {
      var a = i.f, l = (a & (Qe | Ut)) !== 0, o = l && (a & ee) !== 0, u = o || (a & ke) !== 0 || this.#i.has(i);
      if (!u && i.fn !== null) {
        l ? i.f ^= ee : (a & Wn) !== 0 ? n.push(i) : Sn(i) && ((a & pt) !== 0 && this.#r.add(i), Jt(i));
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
      hi(t[n], this.#s, this.#r);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, n) {
    n !== oe && !this.previous.has(t) && this.previous.set(t, n), (t.f & bt) === 0 && (this.current.set(t, t.v), $e?.set(t, t.v));
  }
  activate() {
    C = this, this.apply();
  }
  deactivate() {
    C === this && (C = null, $e = null);
  }
  flush() {
    if (this.activate(), ye.length > 0) {
      if (vi(), C !== null && C !== this)
        return;
    } else this.#e === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#o) t(this);
    this.#o.clear();
  }
  #p() {
    if (Pn.size > 1) {
      this.previous.clear();
      var t = $e, n = !0;
      for (const i of Pn) {
        if (i === this) {
          n = !1;
          continue;
        }
        const a = [];
        for (const [o, u] of this.current) {
          if (i.current.has(o))
            if (n && u !== i.current.get(o))
              i.current.set(o, u);
            else
              continue;
          a.push(o);
        }
        if (a.length === 0)
          continue;
        const l = [...i.current.keys()].filter((o) => !this.current.has(o));
        if (l.length > 0) {
          var r = ye;
          ye = [];
          const o = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map();
          for (const f of a)
            _i(f, l, o, u);
          if (ye.length > 0) {
            C = i, i.apply();
            for (const f of ye)
              i.#f(f, [], []);
            i.deactivate();
          }
          ye = r;
        }
      }
      C = null, $e = t;
    }
    Pn.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#e += 1, t && (this.#a += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#e -= 1, t && (this.#a -= 1), !this.#l && (this.#l = !0, qt(() => {
      this.#l = !1, this.#u() ? ye.length > 0 && this.flush() : this.revive();
    }));
  }
  revive() {
    for (const t of this.#s)
      this.#r.delete(t), Y(t, de), Ke(t);
    for (const t of this.#r)
      Y(t, Je), Ke(t);
    this.flush();
  }
  /** @param {() => void} fn */
  oncommit(t) {
    this.#t.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#o.add(t);
  }
  settled() {
    return (this.#n ??= ri()).promise;
  }
  static ensure() {
    if (C === null) {
      const t = C = new yt();
      Pn.add(C), bn || qt(() => {
        C === t && t.flush();
      });
    }
    return C;
  }
  apply() {
  }
}
function xa(e) {
  var t = bn;
  bn = !0;
  try {
    for (var n; ; ) {
      if (Aa(), ye.length === 0 && (C?.flush(), ye.length === 0))
        return Yn = null, /** @type {T} */
        n;
      vi();
    }
  } finally {
    bn = t;
  }
}
function vi() {
  hr = !0;
  var e = null;
  try {
    for (var t = 0; ye.length > 0; ) {
      var n = yt.ensure();
      if (t++ > 1e3) {
        var r, i;
        Ra();
      }
      n.process(ye), wt.clear();
    }
  } finally {
    ye = [], hr = !1, Yn = null;
  }
}
function Ra() {
  try {
    ua();
  } catch (e) {
    Et(e, Yn);
  }
}
let dt = null;
function Ur(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (Tt | ke)) === 0 && Sn(r) && (dt = /* @__PURE__ */ new Set(), Jt(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Mi(r), dt?.size > 0)) {
        wt.clear();
        for (const i of dt) {
          if ((i.f & (Tt | ke)) !== 0) continue;
          const a = [i];
          let l = i.parent;
          for (; l !== null; )
            dt.has(l) && (dt.delete(l), a.push(l)), l = l.parent;
          for (let o = a.length - 1; o >= 0; o--) {
            const u = a[o];
            (u.f & (Tt | ke)) === 0 && Jt(u);
          }
        }
        dt.clear();
      }
    }
    dt = null;
  }
}
function _i(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const a = i.f;
      (a & le) !== 0 ? _i(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (a & (wr | pt)) !== 0 && (a & de) === 0 && mi(i, t, r) && (Y(i, de), Ke(
        /** @type {Effect} */
        i
      ));
    }
}
function mi(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Xt.call(t, i))
        return !0;
      if ((i.f & le) !== 0 && mi(
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
function Ke(e) {
  var t = Yn = e, n = t.b;
  if (n?.is_pending && (e.f & (Wn | Vn | ii)) !== 0 && (e.f & Ct) === 0) {
    n.defer_effect(e);
    return;
  }
  for (; t.parent !== null; ) {
    t = t.parent;
    var r = t.f;
    if (hr && t === k && (r & pt) !== 0 && (r & ai) === 0 && (r & Ct) !== 0)
      return;
    if ((r & (Ut | Qe)) !== 0) {
      if ((r & ee) === 0)
        return;
      t.f ^= ee;
    }
  }
  ye.push(t);
}
function gi(e, t) {
  if (!((e.f & Qe) !== 0 && (e.f & ee) !== 0)) {
    (e.f & de) !== 0 ? t.d.push(e) : (e.f & Je) !== 0 && t.m.push(e), Y(e, ee);
    for (var n = e.first; n !== null; )
      gi(n, t), n = n.next;
  }
}
function Da(e) {
  let t = 0, n = Pt(0), r;
  return () => {
    Dr() && (c(n), Ii(() => (t === 0 && (r = Mr(() => e(() => yn(n)))), t += 1, () => {
      qt(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, yn(n));
      });
    })));
  };
}
var Ia = $t | Qt;
function Oa(e, t, n, r) {
  new ka(e, t, n, r);
}
class ka {
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
  #o = null;
  /** @type {BoundaryProps} */
  #e;
  /** @type {((anchor: Node) => void)} */
  #a;
  /** @type {Effect} */
  #n;
  /** @type {Effect | null} */
  #s = null;
  /** @type {Effect | null} */
  #r = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {DocumentFragment | null} */
  #l = null;
  #u = 0;
  #f = 0;
  #c = !1;
  /** @type {Set<Effect>} */
  #p = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #h = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #d = null;
  #E = Da(() => (this.#d = Pt(this.#u), () => {
    this.#d = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, i) {
    this.#t = t, this.#e = n, this.#a = (a) => {
      var l = (
        /** @type {Effect} */
        k
      );
      l.b = this, l.f |= cr, r(a);
    }, this.parent = /** @type {Effect} */
    k.b, this.transform_error = i ?? this.parent?.transform_error ?? ((a) => a), this.#n = Ir(() => {
      this.#m();
    }, Ia);
  }
  #T() {
    try {
      this.#s = He(() => this.#a(this.#t));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #b(t) {
    const n = this.#e.failed;
    n && (this.#i = He(() => {
      n(
        this.#t,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #y() {
    const t = this.#e.pending;
    t && (this.is_pending = !0, this.#r = He(() => t(this.#t)), qt(() => {
      var n = this.#l = document.createDocumentFragment(), r = kt();
      n.append(r), this.#s = this.#_(() => (yt.ensure(), He(() => this.#a(r)))), this.#f === 0 && (this.#t.before(n), this.#l = null, Mt(
        /** @type {Effect} */
        this.#r,
        () => {
          this.#r = null;
        }
      ), this.#v());
    }));
  }
  #m() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#f = 0, this.#u = 0, this.#s = He(() => {
        this.#a(this.#t);
      }), this.#f > 0) {
        var t = this.#l = document.createDocumentFragment();
        Li(this.#s, t);
        const n = (
          /** @type {(anchor: Node) => void} */
          this.#e.pending
        );
        this.#r = He(() => n(this.#t));
      } else
        this.#v();
    } catch (n) {
      this.error(n);
    }
  }
  #v() {
    this.is_pending = !1;
    for (const t of this.#p)
      Y(t, de), Ke(t);
    for (const t of this.#h)
      Y(t, Je), Ke(t);
    this.#p.clear(), this.#h.clear();
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    hi(t, this.#p, this.#h);
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
  #_(t) {
    var n = k, r = I, i = Me;
    at(this.#n), We(this.#n), Kt(this.#n.ctx);
    try {
      return t();
    } catch (a) {
      return di(a), null;
    } finally {
      at(n), We(r), Kt(i);
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
    this.#f += t, this.#f === 0 && (this.#v(), this.#r && Mt(this.#r, () => {
      this.#r = null;
    }), this.#l && (this.#t.before(this.#l), this.#l = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#g(t), this.#u += t, !(!this.#d || this.#c) && (this.#c = !0, qt(() => {
      this.#c = !1, this.#d && Zt(this.#d, this.#u);
    }));
  }
  get_effect_pending() {
    return this.#E(), c(
      /** @type {Source<number>} */
      this.#d
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#e.onerror;
    let r = this.#e.failed;
    if (!n && !r)
      throw t;
    this.#s && (Ae(this.#s), this.#s = null), this.#r && (Ae(this.#r), this.#r = null), this.#i && (Ae(this.#i), this.#i = null);
    var i = !1, a = !1;
    const l = () => {
      if (i) {
        ya();
        return;
      }
      i = !0, a && ha(), this.#i !== null && Mt(this.#i, () => {
        this.#i = null;
      }), this.#_(() => {
        yt.ensure(), this.#m();
      });
    }, o = (u) => {
      try {
        a = !0, n?.(u, l), a = !1;
      } catch (f) {
        Et(f, this.#n && this.#n.parent);
      }
      r && (this.#i = this.#_(() => {
        yt.ensure();
        try {
          return He(() => {
            var f = (
              /** @type {Effect} */
              k
            );
            f.b = this, f.f |= cr, r(
              this.#t,
              () => u,
              () => l
            );
          });
        } catch (f) {
          return Et(
            f,
            /** @type {Effect} */
            this.#n.parent
          ), null;
        }
      }));
    };
    qt(() => {
      var u;
      try {
        u = this.transform_error(t);
      } catch (f) {
        Et(f, this.#n && this.#n.parent);
        return;
      }
      u !== null && typeof u == "object" && typeof /** @type {any} */
      u.then == "function" ? u.then(
        o,
        /** @param {unknown} e */
        (f) => Et(f, this.#n && this.#n.parent)
      ) : o(u);
    });
  }
}
function Ma(e, t, n, r) {
  const i = Sr;
  var a = e.filter((_) => !_.settled);
  if (n.length === 0 && a.length === 0) {
    r(t.map(i));
    return;
  }
  var l = (
    /** @type {Effect} */
    k
  ), o = Na(), u = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((_) => _.promise)) : null;
  function f(_) {
    o();
    try {
      r(_);
    } catch (g) {
      (l.f & Tt) === 0 && Et(g, l);
    }
    vr();
  }
  if (n.length === 0) {
    u.then(() => f(t.map(i)));
    return;
  }
  function v() {
    o(), Promise.all(n.map((_) => /* @__PURE__ */ La(_))).then((_) => f([...t.map(i), ..._])).catch((_) => Et(_, l));
  }
  u ? u.then(v) : v();
}
function Na() {
  var e = k, t = I, n = Me, r = C;
  return function(a = !0) {
    at(e), We(t), Kt(n), a && r?.activate();
  };
}
function vr(e = !0) {
  at(null), We(null), Kt(null), e && C?.deactivate();
}
function Ca() {
  var e = (
    /** @type {Boundary} */
    /** @type {Effect} */
    k.b
  ), t = (
    /** @type {Batch} */
    C
  ), n = e.is_rendered();
  return e.update_pending_count(1), t.increment(n), () => {
    e.update_pending_count(-1), t.decrement(n);
  };
}
// @__NO_SIDE_EFFECTS__
function Sr(e) {
  var t = le | de, n = I !== null && (I.f & le) !== 0 ? (
    /** @type {Derived} */
    I
  ) : null;
  return k !== null && (k.f |= Qt), {
    ctx: Me,
    deps: null,
    effects: null,
    equals: si,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      oe
    ),
    wv: 0,
    parent: n ?? k,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function La(e, t, n) {
  /** @type {Effect | null} */
  k === null && aa();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), a = Pt(
    /** @type {V} */
    oe
  ), l = !I, o = /* @__PURE__ */ new Map();
  return Za(() => {
    var u = ri();
    i = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, u.reject).finally(vr);
    } catch (g) {
      u.reject(g), vr();
    }
    var f = (
      /** @type {Batch} */
      C
    );
    if (l) {
      var v = Ca();
      o.get(f)?.reject(Dt), o.delete(f), o.set(f, u);
    }
    const _ = (g, y = void 0) => {
      if (f.activate(), y)
        y !== Dt && (a.f |= bt, Zt(a, y));
      else {
        (a.f & bt) !== 0 && (a.f ^= bt), Zt(a, g);
        for (const [d, A] of o) {
          if (o.delete(d), d === f) break;
          A.reject(Dt);
        }
      }
      v && v();
    };
    u.promise.then(_, (g) => _(null, g || "unknown"));
  }), Xa(() => {
    for (const u of o.values())
      u.reject(Dt);
  }), new Promise((u) => {
    function f(v) {
      function _() {
        v === i ? u(a) : f(i);
      }
      v.then(_, _);
    }
    f(i);
  });
}
// @__NO_SIDE_EFFECTS__
function ze(e) {
  const t = /* @__PURE__ */ Sr(e);
  return Pi(t), t;
}
// @__NO_SIDE_EFFECTS__
function Pa(e) {
  const t = /* @__PURE__ */ Sr(e);
  return t.equals = oi, t;
}
function Fa(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Ae(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Ua(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & le) === 0)
      return (t.f & Tt) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function xr(e) {
  var t, n = k;
  at(Ua(e));
  try {
    e.f &= ~Lt, Fa(e), t = Bi(e);
  } finally {
    at(n);
  }
  return t;
}
function Ei(e) {
  var t = xr(e);
  if (!e.equals(t) && (e.wv = Ui(), (!C?.is_fork || e.deps === null) && (e.v = t, e.deps === null))) {
    Y(e, ee);
    return;
  }
  Ft || ($e !== null ? (Dr() || C?.is_fork) && $e.set(e, t) : Ar(e));
}
function za(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Dt), t.teardown = ta, t.ac = null, An(t, 0), Or(t));
}
function Ti(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Jt(t);
}
let _r = /* @__PURE__ */ new Set();
const wt = /* @__PURE__ */ new Map();
let bi = !1;
function Pt(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: si,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function z(e, t) {
  const n = Pt(e);
  return Pi(n), n;
}
// @__NO_SIDE_EFFECTS__
function Ba(e, t = !1, n = !0) {
  const r = Pt(e);
  return t || (r.equals = oi), r;
}
function b(e, t, n = !1) {
  I !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Ze || (I.f & Fr) !== 0) && ui() && (I.f & (le | pt | wr | Fr)) !== 0 && (je === null || !Xt.call(je, e)) && pa();
  let r = n ? it(t) : t;
  return Zt(e, r);
}
function Zt(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Ft ? wt.set(e, t) : wt.set(e, n), e.v = t;
    var r = yt.ensure();
    if (r.capture(e, n), (e.f & le) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & de) !== 0 && xr(i), Ar(i);
    }
    e.wv = Ui(), yi(e, de), k !== null && (k.f & ee) !== 0 && (k.f & (Qe | Ut)) === 0 && (Be === null ? Qa([e]) : Be.push(e)), !r.is_fork && _r.size > 0 && !bi && Ha();
  }
  return t;
}
function Ha() {
  bi = !1;
  for (const e of _r)
    (e.f & ee) !== 0 && Y(e, Je), Sn(e) && Jt(e);
  _r.clear();
}
function yn(e) {
  b(e, e.v + 1);
}
function yi(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = n.length, i = 0; i < r; i++) {
      var a = n[i], l = a.f, o = (l & de) === 0;
      if (o && Y(a, t), (l & le) !== 0) {
        var u = (
          /** @type {Derived} */
          a
        );
        $e?.delete(u), (l & Lt) === 0 && (l & Ge && (a.f |= Lt), yi(u, Je));
      } else o && ((l & pt) !== 0 && dt !== null && dt.add(
        /** @type {Effect} */
        a
      ), Ke(
        /** @type {Effect} */
        a
      ));
    }
}
function it(e) {
  if (typeof e != "object" || e === null || er in e)
    return e;
  const t = ea(e);
  if (t !== Ji && t !== Qi)
    return e;
  var n = /* @__PURE__ */ new Map(), r = ni(e), i = /* @__PURE__ */ z(0), a = Nt, l = (o) => {
    if (Nt === a)
      return o();
    var u = I, f = Nt;
    We(null), Gr(a);
    var v = o();
    return We(u), Gr(f), v;
  };
  return r && n.set("length", /* @__PURE__ */ z(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, u, f) {
        (!("value" in f) || f.configurable === !1 || f.enumerable === !1 || f.writable === !1) && ca();
        var v = n.get(u);
        return v === void 0 ? l(() => {
          var _ = /* @__PURE__ */ z(f.value);
          return n.set(u, _), _;
        }) : b(v, f.value, !0), !0;
      },
      deleteProperty(o, u) {
        var f = n.get(u);
        if (f === void 0) {
          if (u in o) {
            const v = l(() => /* @__PURE__ */ z(oe));
            n.set(u, v), yn(i);
          }
        } else
          b(f, oe), yn(i);
        return !0;
      },
      get(o, u, f) {
        if (u === er)
          return e;
        var v = n.get(u), _ = u in o;
        if (v === void 0 && (!_ || Tn(o, u)?.writable) && (v = l(() => {
          var y = it(_ ? o[u] : oe), d = /* @__PURE__ */ z(y);
          return d;
        }), n.set(u, v)), v !== void 0) {
          var g = c(v);
          return g === oe ? void 0 : g;
        }
        return Reflect.get(o, u, f);
      },
      getOwnPropertyDescriptor(o, u) {
        var f = Reflect.getOwnPropertyDescriptor(o, u);
        if (f && "value" in f) {
          var v = n.get(u);
          v && (f.value = c(v));
        } else if (f === void 0) {
          var _ = n.get(u), g = _?.v;
          if (_ !== void 0 && g !== oe)
            return {
              enumerable: !0,
              configurable: !0,
              value: g,
              writable: !0
            };
        }
        return f;
      },
      has(o, u) {
        if (u === er)
          return !0;
        var f = n.get(u), v = f !== void 0 && f.v !== oe || Reflect.has(o, u);
        if (f !== void 0 || k !== null && (!v || Tn(o, u)?.writable)) {
          f === void 0 && (f = l(() => {
            var g = v ? it(o[u]) : oe, y = /* @__PURE__ */ z(g);
            return y;
          }), n.set(u, f));
          var _ = c(f);
          if (_ === oe)
            return !1;
        }
        return v;
      },
      set(o, u, f, v) {
        var _ = n.get(u), g = u in o;
        if (r && u === "length")
          for (var y = f; y < /** @type {Source<number>} */
          _.v; y += 1) {
            var d = n.get(y + "");
            d !== void 0 ? b(d, oe) : y in o && (d = l(() => /* @__PURE__ */ z(oe)), n.set(y + "", d));
          }
        if (_ === void 0)
          (!g || Tn(o, u)?.writable) && (_ = l(() => /* @__PURE__ */ z(void 0)), b(_, it(f)), n.set(u, _));
        else {
          g = _.v !== oe;
          var A = l(() => it(f));
          b(_, A);
        }
        var R = Reflect.getOwnPropertyDescriptor(o, u);
        if (R?.set && R.set.call(v, f), !g) {
          if (r && typeof u == "string") {
            var M = (
              /** @type {Source<number>} */
              n.get("length")
            ), O = Number(u);
            Number.isInteger(O) && O >= M.v && b(M, O + 1);
          }
          yn(i);
        }
        return !0;
      },
      ownKeys(o) {
        c(i);
        var u = Reflect.ownKeys(o).filter((_) => {
          var g = n.get(_);
          return g === void 0 || g.v !== oe;
        });
        for (var [f, v] of n)
          v.v !== oe && !(f in o) && u.push(f);
        return u;
      },
      setPrototypeOf() {
        da();
      }
    }
  );
}
var zr, wi, Ai, Si;
function Ga() {
  if (zr === void 0) {
    zr = window, wi = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    Ai = Tn(t, "firstChild").get, Si = Tn(t, "nextSibling").get, Pr(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), Pr(n) && (n.__t = void 0);
  }
}
function kt(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function wn(e) {
  return (
    /** @type {TemplateNode | null} */
    Ai.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function qn(e) {
  return (
    /** @type {TemplateNode | null} */
    Si.call(e)
  );
}
function x(e, t) {
  return /* @__PURE__ */ wn(e);
}
function P(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ qn(r);
  return r;
}
function ja(e) {
  e.textContent = "";
}
function xi() {
  return !1;
}
function Ri(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? Ea, e, void 0)
  );
}
let Br = !1;
function Wa() {
  Br || (Br = !0, document.addEventListener(
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
function Rr(e) {
  var t = I, n = k;
  We(null), at(null);
  try {
    return e();
  } finally {
    We(t), at(n);
  }
}
function Va(e, t, n, r = n) {
  e.addEventListener(t, () => Rr(n));
  const i = e.__on_r;
  i ? e.__on_r = () => {
    i(), r(!0);
  } : e.__on_r = () => r(!0), Wa();
}
function Ya(e) {
  k === null && (I === null && fa(), la()), Ft && oa();
}
function qa(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function St(e, t, n) {
  var r = k;
  r !== null && (r.f & ke) !== 0 && (e |= ke);
  var i = {
    ctx: Me,
    deps: null,
    nodes: null,
    f: e | de | Ge,
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
      Jt(i);
    } catch (o) {
      throw Ae(i), o;
    }
  else t !== null && Ke(i);
  var a = i;
  if (n && a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && // either `null`, or a singular child
  (a.f & Qt) === 0 && (a = a.first, (e & pt) !== 0 && (e & $t) !== 0 && a !== null && (a.f |= $t)), a !== null && (a.parent = r, r !== null && qa(a, r), I !== null && (I.f & le) !== 0 && (e & Ut) === 0)) {
    var l = (
      /** @type {Derived} */
      I
    );
    (l.effects ??= []).push(a);
  }
  return i;
}
function Dr() {
  return I !== null && !Ze;
}
function Xa(e) {
  const t = St(Vn, null, !1);
  return Y(t, ee), t.teardown = e, t;
}
function $a(e) {
  Ya();
  var t = (
    /** @type {Effect} */
    k.f
  ), n = !I && (t & Qe) !== 0 && (t & Ct) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      Me
    );
    (r.e ??= []).push(e);
  } else
    return Di(e);
}
function Di(e) {
  return St(Wn | ra, e, !1);
}
function Ka(e) {
  yt.ensure();
  const t = St(Ut | Qt, e, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? Mt(t, () => {
      Ae(t), r(void 0);
    }) : (Ae(t), r(void 0));
  });
}
function Za(e) {
  return St(wr | Qt, e, !0);
}
function Ii(e, t = 0) {
  return St(Vn | t, e, !0);
}
function Ie(e, t = [], n = [], r = []) {
  Ma(r, t, n, (i) => {
    St(Vn, () => e(...i.map(c)), !0);
  });
}
function Ir(e, t = 0) {
  var n = St(pt | t, e, !0);
  return n;
}
function He(e) {
  return St(Qe | Qt, e, !0);
}
function Oi(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Ft, r = I;
    Hr(!0), We(null);
    try {
      t.call(null);
    } finally {
      Hr(n), We(r);
    }
  }
}
function Or(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && Rr(() => {
      i.abort(Dt);
    });
    var r = n.next;
    (n.f & Ut) !== 0 ? n.parent = null : Ae(n, t), n = r;
  }
}
function Ja(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Qe) === 0 && Ae(t), t = n;
  }
}
function Ae(e, t = !0) {
  var n = !1;
  (t || (e.f & ai) !== 0) && e.nodes !== null && e.nodes.end !== null && (ki(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), Or(e, t && !n), An(e, 0), Y(e, Tt);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const a of r)
      a.stop();
  Oi(e);
  var i = e.parent;
  i !== null && i.first !== null && Mi(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function ki(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ qn(e);
    e.remove(), e = n;
  }
}
function Mi(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Mt(e, t, n = !0) {
  var r = [];
  Ni(e, r, !0);
  var i = () => {
    n && Ae(e), t && t();
  }, a = r.length;
  if (a > 0) {
    var l = () => --a || i();
    for (var o of r)
      o.out(l);
  } else
    i();
}
function Ni(e, t, n) {
  if ((e.f & ke) === 0) {
    e.f ^= ke;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const o of r)
        (o.is_global || n) && t.push(o);
    for (var i = e.first; i !== null; ) {
      var a = i.next, l = (i.f & $t) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (i.f & Qe) !== 0 && (e.f & pt) !== 0;
      Ni(i, t, l ? n : !1), i = a;
    }
  }
}
function kr(e) {
  Ci(e, !0);
}
function Ci(e, t) {
  if ((e.f & ke) !== 0) {
    e.f ^= ke, (e.f & ee) === 0 && (Y(e, de), Ke(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & $t) !== 0 || (n.f & Qe) !== 0;
      Ci(n, i ? t : !1), n = r;
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null)
      for (const l of a)
        (l.is_global || t) && l.in();
  }
}
function Li(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : /* @__PURE__ */ qn(n);
      t.append(n), n = i;
    }
}
let Hn = !1, Ft = !1;
function Hr(e) {
  Ft = e;
}
let I = null, Ze = !1;
function We(e) {
  I = e;
}
let k = null;
function at(e) {
  k = e;
}
let je = null;
function Pi(e) {
  I !== null && (je === null ? je = [e] : je.push(e));
}
let we = null, Oe = 0, Be = null;
function Qa(e) {
  Be = e;
}
let Fi = 1, Ot = 0, Nt = Ot;
function Gr(e) {
  Nt = e;
}
function Ui() {
  return ++Fi;
}
function Sn(e) {
  var t = e.f;
  if ((t & de) !== 0)
    return !0;
  if (t & le && (e.f &= ~Lt), (t & Je) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, i = 0; i < r; i++) {
      var a = n[i];
      if (Sn(
        /** @type {Derived} */
        a
      ) && Ei(
        /** @type {Derived} */
        a
      ), a.wv > e.wv)
        return !0;
    }
    (t & Ge) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    $e === null && Y(e, ee);
  }
  return !1;
}
function zi(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(je !== null && Xt.call(je, e)))
    for (var i = 0; i < r.length; i++) {
      var a = r[i];
      (a.f & le) !== 0 ? zi(
        /** @type {Derived} */
        a,
        t,
        !1
      ) : t === a && (n ? Y(a, de) : (a.f & ee) !== 0 && Y(a, Je), Ke(
        /** @type {Effect} */
        a
      ));
    }
}
function Bi(e) {
  var t = we, n = Oe, r = Be, i = I, a = je, l = Me, o = Ze, u = Nt, f = e.f;
  we = /** @type {null | Value[]} */
  null, Oe = 0, Be = null, I = (f & (Qe | Ut)) === 0 ? e : null, je = null, Kt(e.ctx), Ze = !1, Nt = ++Ot, e.ac !== null && (Rr(() => {
    e.ac.abort(Dt);
  }), e.ac = null);
  try {
    e.f |= dr;
    var v = (
      /** @type {Function} */
      e.fn
    ), _ = v();
    e.f |= Ct;
    var g = e.deps, y = C?.is_fork;
    if (we !== null) {
      var d;
      if (y || An(e, Oe), g !== null && Oe > 0)
        for (g.length = Oe + we.length, d = 0; d < we.length; d++)
          g[Oe + d] = we[d];
      else
        e.deps = g = we;
      if (Dr() && (e.f & Ge) !== 0)
        for (d = Oe; d < g.length; d++)
          (g[d].reactions ??= []).push(e);
    } else !y && g !== null && Oe < g.length && (An(e, Oe), g.length = Oe);
    if (ui() && Be !== null && !Ze && g !== null && (e.f & (le | Je | de)) === 0)
      for (d = 0; d < /** @type {Source[]} */
      Be.length; d++)
        zi(
          Be[d],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (Ot++, i.deps !== null)
        for (let A = 0; A < n; A += 1)
          i.deps[A].rv = Ot;
      if (t !== null)
        for (const A of t)
          A.rv = Ot;
      Be !== null && (r === null ? r = Be : r.push(.../** @type {Source[]} */
      Be));
    }
    return (e.f & bt) !== 0 && (e.f ^= bt), _;
  } catch (A) {
    return di(A);
  } finally {
    e.f ^= dr, we = t, Oe = n, Be = r, I = i, je = a, Kt(l), Ze = o, Nt = u;
  }
}
function es(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = Ki.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  if (n === null && (t.f & le) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (we === null || !Xt.call(we, t))) {
    var a = (
      /** @type {Derived} */
      t
    );
    (a.f & Ge) !== 0 && (a.f ^= Ge, a.f &= ~Lt), Ar(a), za(a), An(a, 0);
  }
}
function An(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      es(e, n[r]);
}
function Jt(e) {
  var t = e.f;
  if ((t & Tt) === 0) {
    Y(e, ee);
    var n = k, r = Hn;
    k = e, Hn = !0;
    try {
      (t & (pt | ii)) !== 0 ? Ja(e) : Or(e), Oi(e);
      var i = Bi(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = Fi;
      var a;
    } finally {
      Hn = r, k = n;
    }
  }
}
async function ts() {
  await Promise.resolve(), xa();
}
function c(e) {
  var t = e.f, n = (t & le) !== 0;
  if (I !== null && !Ze) {
    var r = k !== null && (k.f & Tt) !== 0;
    if (!r && (je === null || !Xt.call(je, e))) {
      var i = I.deps;
      if ((I.f & dr) !== 0)
        e.rv < Ot && (e.rv = Ot, we === null && i !== null && i[Oe] === e ? Oe++ : we === null ? we = [e] : we.push(e));
      else {
        (I.deps ??= []).push(e);
        var a = e.reactions;
        a === null ? e.reactions = [I] : Xt.call(a, I) || a.push(I);
      }
    }
  }
  if (Ft && wt.has(e))
    return wt.get(e);
  if (n) {
    var l = (
      /** @type {Derived} */
      e
    );
    if (Ft) {
      var o = l.v;
      return ((l.f & ee) === 0 && l.reactions !== null || Gi(l)) && (o = xr(l)), wt.set(l, o), o;
    }
    var u = (l.f & Ge) === 0 && !Ze && I !== null && (Hn || (I.f & Ge) !== 0), f = (l.f & Ct) === 0;
    Sn(l) && (u && (l.f |= Ge), Ei(l)), u && !f && (Ti(l), Hi(l));
  }
  if ($e?.has(e))
    return $e.get(e);
  if ((e.f & bt) !== 0)
    throw e.v;
  return e.v;
}
function Hi(e) {
  if (e.f |= Ge, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & le) !== 0 && (t.f & Ge) === 0 && (Ti(
        /** @type {Derived} */
        t
      ), Hi(
        /** @type {Derived} */
        t
      ));
}
function Gi(e) {
  if (e.v === oe) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (wt.has(t) || (t.f & le) !== 0 && Gi(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function Mr(e) {
  var t = Ze;
  try {
    return Ze = !0, e();
  } finally {
    Ze = t;
  }
}
const ns = ["touchstart", "touchmove"];
function rs(e) {
  return ns.includes(e);
}
const mn = /* @__PURE__ */ Symbol("events"), ji = /* @__PURE__ */ new Set(), mr = /* @__PURE__ */ new Set();
function Re(e, t, n) {
  (t[mn] ??= {})[e] = n;
}
function is(e) {
  for (var t = 0; t < e.length; t++)
    ji.add(e[t]);
  for (var n of mr)
    n(e);
}
let jr = null;
function Wr(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], a = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  jr = e;
  var l = 0, o = jr === e && e[mn];
  if (o) {
    var u = i.indexOf(o);
    if (u !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[mn] = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    u <= f && (l = u);
  }
  if (a = /** @type {Element} */
  i[l] || e.target, a !== t) {
    Zi(e, "currentTarget", {
      configurable: !0,
      get() {
        return a || n;
      }
    });
    var v = I, _ = k;
    We(null), at(null);
    try {
      for (var g, y = []; a !== null; ) {
        var d = a.assignedSlot || a.parentNode || /** @type {any} */
        a.host || null;
        try {
          var A = a[mn]?.[r];
          A != null && (!/** @type {any} */
          a.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === a) && A.call(a, e);
        } catch (R) {
          g ? y.push(R) : g = R;
        }
        if (e.cancelBubble || d === t || d === null)
          break;
        a = d;
      }
      if (g) {
        for (let R of y)
          queueMicrotask(() => {
            throw R;
          });
        throw g;
      }
    } finally {
      e[mn] = t, delete e.currentTarget, We(v), at(_);
    }
  }
}
const as = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function ss(e) {
  return (
    /** @type {string} */
    as?.createHTML(e) ?? e
  );
}
function os(e) {
  var t = Ri("template");
  return t.innerHTML = ss(e.replaceAll("<!>", "<!---->")), t.content;
}
function Wi(e, t) {
  var n = (
    /** @type {Effect} */
    k
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
  var n = (t & ga) !== 0, r, i = !e.startsWith("<!>");
  return () => {
    r === void 0 && (r = os(i ? e : "<!>" + e), r = /** @type {TemplateNode} */
    /* @__PURE__ */ wn(r));
    var a = (
      /** @type {TemplateNode} */
      n || wi ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return Wi(a, a), a;
  };
}
function F(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function se(e, t) {
  var n = t == null ? "" : typeof t == "object" ? t + "" : t;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = n + "");
}
function ls(e, t) {
  return fs(e, t);
}
const Fn = /* @__PURE__ */ new Map();
function fs(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: l = !0, transformError: o }) {
  Ga();
  var u = void 0, f = Ka(() => {
    var v = n ?? t.appendChild(kt());
    Oa(
      /** @type {TemplateNode} */
      v,
      {
        pending: () => {
        }
      },
      (y) => {
        li({});
        var d = (
          /** @type {ComponentContext} */
          Me
        );
        a && (d.c = a), i && (r.$$events = i), u = e(y, r) || {}, fi();
      },
      o
    );
    var _ = /* @__PURE__ */ new Set(), g = (y) => {
      for (var d = 0; d < y.length; d++) {
        var A = y[d];
        if (!_.has(A)) {
          _.add(A);
          var R = rs(A);
          for (const K of [t, document]) {
            var M = Fn.get(K);
            M === void 0 && (M = /* @__PURE__ */ new Map(), Fn.set(K, M));
            var O = M.get(A);
            O === void 0 ? (K.addEventListener(A, Wr, { passive: R }), M.set(A, 1)) : M.set(A, O + 1);
          }
        }
      }
    };
    return g(jn(ji)), mr.add(g), () => {
      for (var y of _)
        for (const R of [t, document]) {
          var d = (
            /** @type {Map<string, number>} */
            Fn.get(R)
          ), A = (
            /** @type {number} */
            d.get(y)
          );
          --A == 0 ? (R.removeEventListener(y, Wr), d.delete(y), d.size === 0 && Fn.delete(R)) : d.set(y, A);
        }
      mr.delete(g), v !== n && v.parentNode?.removeChild(v);
    };
  });
  return gr.set(u, f), u;
}
let gr = /* @__PURE__ */ new WeakMap();
function us(e, t) {
  const n = gr.get(e);
  return n ? (gr.delete(e), n(t)) : Promise.resolve();
}
class cs {
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
  #o = /* @__PURE__ */ new Map();
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
  #a = /* @__PURE__ */ new Set();
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
  #s = () => {
    var t = (
      /** @type {Batch} */
      C
    );
    if (this.#t.has(t)) {
      var n = (
        /** @type {Key} */
        this.#t.get(t)
      ), r = this.#o.get(n);
      if (r)
        kr(r), this.#a.delete(n);
      else {
        var i = this.#e.get(n);
        i && (this.#o.set(n, i.effect), this.#e.delete(n), i.fragment.lastChild.remove(), this.anchor.before(i.fragment), r = i.effect);
      }
      for (const [a, l] of this.#t) {
        if (this.#t.delete(a), a === t)
          break;
        const o = this.#e.get(l);
        o && (Ae(o.effect), this.#e.delete(l));
      }
      for (const [a, l] of this.#o) {
        if (a === n || this.#a.has(a)) continue;
        const o = () => {
          if (Array.from(this.#t.values()).includes(a)) {
            var f = document.createDocumentFragment();
            Li(l, f), f.append(kt()), this.#e.set(a, { effect: l, fragment: f });
          } else
            Ae(l);
          this.#a.delete(a), this.#o.delete(a);
        };
        this.#n || !r ? (this.#a.add(a), Mt(l, o, !1)) : o();
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
      n.includes(r) || (Ae(i.effect), this.#e.delete(r));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      C
    ), i = xi();
    if (n && !this.#o.has(t) && !this.#e.has(t))
      if (i) {
        var a = document.createDocumentFragment(), l = kt();
        a.append(l), this.#e.set(t, {
          effect: He(() => n(l)),
          fragment: a
        });
      } else
        this.#o.set(
          t,
          He(() => n(this.anchor))
        );
    if (this.#t.set(r, t), i) {
      for (const [o, u] of this.#o)
        o === t ? r.unskip_effect(u) : r.skip_effect(u);
      for (const [o, u] of this.#e)
        o === t ? r.unskip_effect(u.effect) : r.skip_effect(u.effect);
      r.oncommit(this.#s), r.ondiscard(this.#r);
    } else
      this.#s();
  }
}
function De(e, t, n = !1) {
  var r = new cs(e), i = n ? $t : 0;
  function a(l, o) {
    r.ensure(l, o);
  }
  Ir(() => {
    var l = !1;
    t((o, u = 0) => {
      l = !0, a(u, o);
    }), l || a(!1, null);
  }, i);
}
function ds(e, t) {
  return t;
}
function ps(e, t, n) {
  for (var r = [], i = t.length, a, l = t.length, o = 0; o < i; o++) {
    let _ = t[o];
    Mt(
      _,
      () => {
        if (a) {
          if (a.pending.delete(_), a.done.add(_), a.pending.size === 0) {
            var g = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Er(jn(a.done)), g.delete(a), g.size === 0 && (e.outrogroups = null);
          }
        } else
          l -= 1;
      },
      !1
    );
  }
  if (l === 0) {
    var u = r.length === 0 && n !== null;
    if (u) {
      var f = (
        /** @type {Element} */
        n
      ), v = (
        /** @type {Element} */
        f.parentNode
      );
      ja(v), v.append(f), e.items.clear();
    }
    Er(t, !u);
  } else
    a = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Er(e, t = !0) {
  for (var n = 0; n < e.length; n++)
    Ae(e[n], t);
}
var Vr;
function un(e, t, n, r, i, a = null) {
  var l = e, o = /* @__PURE__ */ new Map();
  {
    var u = (
      /** @type {Element} */
      e
    );
    l = u.appendChild(kt());
  }
  var f = null, v = /* @__PURE__ */ Pa(() => {
    var R = n();
    return ni(R) ? R : R == null ? [] : jn(R);
  }), _, g = !0;
  function y() {
    A.fallback = f, hs(A, _, l, t, r), f !== null && (_.length === 0 ? (f.f & gt) === 0 ? kr(f) : (f.f ^= gt, gn(f, null, l)) : Mt(f, () => {
      f = null;
    }));
  }
  var d = Ir(() => {
    _ = /** @type {V[]} */
    c(v);
    for (var R = _.length, M = /* @__PURE__ */ new Set(), O = (
      /** @type {Batch} */
      C
    ), K = xi(), N = 0; N < R; N += 1) {
      var fe = _[N], Se = r(fe, N), pe = g ? null : o.get(Se);
      pe ? (pe.v && Zt(pe.v, fe), pe.i && Zt(pe.i, N), K && O.unskip_effect(pe.e)) : (pe = vs(
        o,
        g ? l : Vr ??= kt(),
        fe,
        Se,
        N,
        i,
        t,
        n
      ), g || (pe.e.f |= gt), o.set(Se, pe)), M.add(Se);
    }
    if (R === 0 && a && !f && (g ? f = He(() => a(l)) : (f = He(() => a(Vr ??= kt())), f.f |= gt)), R > M.size && sa(), !g)
      if (K) {
        for (const [Ne, en] of o)
          M.has(Ne) || O.skip_effect(en.e);
        O.oncommit(y), O.ondiscard(() => {
        });
      } else
        y();
    c(v);
  }), A = { effect: d, items: o, outrogroups: null, fallback: f };
  g = !1;
}
function cn(e) {
  for (; e !== null && (e.f & Qe) === 0; )
    e = e.next;
  return e;
}
function hs(e, t, n, r, i) {
  var a = t.length, l = e.items, o = cn(e.effect.first), u, f = null, v = [], _ = [], g, y, d, A;
  for (A = 0; A < a; A += 1) {
    if (g = t[A], y = i(g, A), d = /** @type {EachItem} */
    l.get(y).e, e.outrogroups !== null)
      for (const Ne of e.outrogroups)
        Ne.pending.delete(d), Ne.done.delete(d);
    if ((d.f & gt) !== 0)
      if (d.f ^= gt, d === o)
        gn(d, null, n);
      else {
        var R = f ? f.next : o;
        d === e.effect.last && (e.effect.last = d.prev), d.prev && (d.prev.next = d.next), d.next && (d.next.prev = d.prev), mt(e, f, d), mt(e, d, R), gn(d, R, n), f = d, v = [], _ = [], o = cn(f.next);
        continue;
      }
    if ((d.f & ke) !== 0 && kr(d), d !== o) {
      if (u !== void 0 && u.has(d)) {
        if (v.length < _.length) {
          var M = _[0], O;
          f = M.prev;
          var K = v[0], N = v[v.length - 1];
          for (O = 0; O < v.length; O += 1)
            gn(v[O], M, n);
          for (O = 0; O < _.length; O += 1)
            u.delete(_[O]);
          mt(e, K.prev, N.next), mt(e, f, K), mt(e, N, M), o = M, f = N, A -= 1, v = [], _ = [];
        } else
          u.delete(d), gn(d, o, n), mt(e, d.prev, d.next), mt(e, d, f === null ? e.effect.first : f.next), mt(e, f, d), f = d;
        continue;
      }
      for (v = [], _ = []; o !== null && o !== d; )
        (u ??= /* @__PURE__ */ new Set()).add(o), _.push(o), o = cn(o.next);
      if (o === null)
        continue;
    }
    (d.f & gt) === 0 && v.push(d), f = d, o = cn(d.next);
  }
  if (e.outrogroups !== null) {
    for (const Ne of e.outrogroups)
      Ne.pending.size === 0 && (Er(jn(Ne.done)), e.outrogroups?.delete(Ne));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (o !== null || u !== void 0) {
    var fe = [];
    if (u !== void 0)
      for (d of u)
        (d.f & ke) === 0 && fe.push(d);
    for (; o !== null; )
      (o.f & ke) === 0 && o !== e.fallback && fe.push(o), o = cn(o.next);
    var Se = fe.length;
    if (Se > 0) {
      var pe = a === 0 ? n : null;
      ps(e, fe, pe);
    }
  }
}
function vs(e, t, n, r, i, a, l, o) {
  var u = (l & va) !== 0 ? (l & ma) === 0 ? /* @__PURE__ */ Ba(n, !1, !1) : Pt(n) : null, f = (l & _a) !== 0 ? Pt(i) : null;
  return {
    v: u,
    i: f,
    e: He(() => (a(t, u ?? n, f ?? i, o), () => {
      e.delete(r);
    }))
  };
}
function gn(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, i = e.nodes.end, a = t && (t.f & gt) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ qn(r)
      );
      if (a.before(r), r === i)
        return;
      r = l;
    }
}
function mt(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function _s(e, t, n = !1, r = !1, i = !1) {
  var a = e, l = "";
  Ie(() => {
    var o = (
      /** @type {Effect} */
      k
    );
    if (l !== (l = t() ?? "") && (o.nodes !== null && (ki(
      o.nodes.start,
      /** @type {TemplateNode} */
      o.nodes.end
    ), o.nodes = null), l !== "")) {
      var u = n ? Ta : r ? ba : void 0, f = (
        /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
        Ri(n ? "svg" : r ? "math" : "template", u)
      );
      f.innerHTML = /** @type {any} */
      l;
      var v = n || r ? f : (
        /** @type {HTMLTemplateElement} */
        f.content
      );
      if (Wi(
        /** @type {TemplateNode} */
        /* @__PURE__ */ wn(v),
        /** @type {TemplateNode} */
        v.lastChild
      ), n || r)
        for (; /* @__PURE__ */ wn(v); )
          a.before(
            /** @type {TemplateNode} */
            /* @__PURE__ */ wn(v)
          );
      else
        a.before(v);
    }
  });
}
const Yr = [...` 	
\r\f \v\uFEFF`];
function ms(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (n) {
    for (var i of Object.keys(n))
      if (n[i])
        r = r ? r + " " + i : i;
      else if (r.length)
        for (var a = i.length, l = 0; (l = r.indexOf(i, l)) >= 0; ) {
          var o = l + a;
          (l === 0 || Yr.includes(r[l - 1])) && (o === r.length || Yr.includes(r[o])) ? r = (l === 0 ? "" : r.substring(0, l)) + r.substring(o + 1) : l = o;
        }
  }
  return r === "" ? null : r;
}
function tr(e, t, n, r, i, a) {
  var l = e.__className;
  if (l !== n || l === void 0) {
    var o = ms(n, r, a);
    o == null ? e.removeAttribute("class") : e.className = o, e.__className = n;
  } else if (a && i !== a)
    for (var u in a) {
      var f = !!a[u];
      (i == null || f !== !!i[u]) && e.classList.toggle(u, f);
    }
  return a;
}
function nr(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet();
  Va(e, "input", async (i) => {
    var a = i ? e.defaultValue : e.value;
    if (a = rr(e) ? ir(a) : a, n(a), C !== null && r.add(C), await ts(), a !== (a = t())) {
      var l = e.selectionStart, o = e.selectionEnd, u = e.value.length;
      if (e.value = a ?? "", o !== null) {
        var f = e.value.length;
        l === o && o === u && f > u ? (e.selectionStart = f, e.selectionEnd = f) : (e.selectionStart = l, e.selectionEnd = Math.min(o, f));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  Mr(t) == null && e.value && (n(rr(e) ? ir(e.value) : e.value), C !== null && r.add(C)), Ii(() => {
    var i = t();
    if (e === document.activeElement) {
      var a = (
        /** @type {Batch} */
        pr ?? C
      );
      if (r.has(a))
        return;
    }
    rr(e) && i === ir(e.value) || e.type === "date" && !i && !e.value || i !== e.value && (e.value = i ?? "");
  });
}
function rr(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function ir(e) {
  return e === "" ? null : +e;
}
function gs(e) {
  Me === null && ia(), $a(() => {
    const t = Mr(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
const Es = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(Es);
const {
  entries: Vi,
  setPrototypeOf: qr,
  isFrozen: Ts,
  getPrototypeOf: bs,
  getOwnPropertyDescriptor: ys
} = Object;
let {
  freeze: me,
  seal: Ve,
  create: Tr
} = Object, {
  apply: br,
  construct: yr
} = typeof Reflect < "u" && Reflect;
me || (me = function(t) {
  return t;
});
Ve || (Ve = function(t) {
  return t;
});
br || (br = function(t, n) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++)
    i[a - 2] = arguments[a];
  return t.apply(n, i);
});
yr || (yr = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
    r[i - 1] = arguments[i];
  return new t(...r);
});
const Un = ge(Array.prototype.forEach), ws = ge(Array.prototype.lastIndexOf), Xr = ge(Array.prototype.pop), dn = ge(Array.prototype.push), As = ge(Array.prototype.splice), Gn = ge(String.prototype.toLowerCase), ar = ge(String.prototype.toString), sr = ge(String.prototype.match), pn = ge(String.prototype.replace), Ss = ge(String.prototype.indexOf), xs = ge(String.prototype.trim), Xe = ge(Object.prototype.hasOwnProperty), _e = ge(RegExp.prototype.test), hn = Rs(TypeError);
function ge(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
      r[i - 1] = arguments[i];
    return br(e, t, r);
  };
}
function Rs(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    return yr(e, n);
  };
}
function S(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Gn;
  qr && qr(e, null);
  let r = t.length;
  for (; r--; ) {
    let i = t[r];
    if (typeof i == "string") {
      const a = n(i);
      a !== i && (Ts(t) || (t[r] = a), i = a);
    }
    e[i] = !0;
  }
  return e;
}
function Ds(e) {
  for (let t = 0; t < e.length; t++)
    Xe(e, t) || (e[t] = null);
  return e;
}
function nt(e) {
  const t = Tr(null);
  for (const [n, r] of Vi(e))
    Xe(e, n) && (Array.isArray(r) ? t[n] = Ds(r) : r && typeof r == "object" && r.constructor === Object ? t[n] = nt(r) : t[n] = r);
  return t;
}
function vn(e, t) {
  for (; e !== null; ) {
    const r = ys(e, t);
    if (r) {
      if (r.get)
        return ge(r.get);
      if (typeof r.value == "function")
        return ge(r.value);
    }
    e = bs(e);
  }
  function n() {
    return null;
  }
  return n;
}
const $r = me(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), or = me(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), lr = me(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Is = me(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), fr = me(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Os = me(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Kr = me(["#text"]), Zr = me(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ur = me(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Jr = me(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), zn = me(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), ks = Ve(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Ms = Ve(/<%[\w\W]*|[\w\W]*%>/gm), Ns = Ve(/\$\{[\w\W]*/gm), Cs = Ve(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ls = Ve(/^aria-[\-\w]+$/), Yi = Ve(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ps = Ve(/^(?:\w+script|data):/i), Fs = Ve(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), qi = Ve(/^html$/i), Us = Ve(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Qr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Ls,
  ATTR_WHITESPACE: Fs,
  CUSTOM_ELEMENT: Us,
  DATA_ATTR: Cs,
  DOCTYPE_NAME: qi,
  ERB_EXPR: Ms,
  IS_ALLOWED_URI: Yi,
  IS_SCRIPT_OR_DATA: Ps,
  MUSTACHE_EXPR: ks,
  TMPLIT_EXPR: Ns
});
const _n = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, zs = function() {
  return typeof window > "u" ? null : window;
}, Bs = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let r = null;
  const i = "data-tt-policy-suffix";
  n && n.hasAttribute(i) && (r = n.getAttribute(i));
  const a = "dompurify" + (r ? "#" + r : "");
  try {
    return t.createPolicy(a, {
      createHTML(l) {
        return l;
      },
      createScriptURL(l) {
        return l;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, ei = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Xi() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : zs();
  const t = (T) => Xi(T);
  if (t.version = "3.3.1", t.removed = [], !e || !e.document || e.document.nodeType !== _n.document || !e.Element)
    return t.isSupported = !1, t;
  let {
    document: n
  } = e;
  const r = n, i = r.currentScript, {
    DocumentFragment: a,
    HTMLTemplateElement: l,
    Node: o,
    Element: u,
    NodeFilter: f,
    NamedNodeMap: v = e.NamedNodeMap || e.MozNamedAttrMap,
    HTMLFormElement: _,
    DOMParser: g,
    trustedTypes: y
  } = e, d = u.prototype, A = vn(d, "cloneNode"), R = vn(d, "remove"), M = vn(d, "nextSibling"), O = vn(d, "childNodes"), K = vn(d, "parentNode");
  if (typeof l == "function") {
    const T = n.createElement("template");
    T.content && T.content.ownerDocument && (n = T.content.ownerDocument);
  }
  let N, fe = "";
  const {
    implementation: Se,
    createNodeIterator: pe,
    createDocumentFragment: Ne,
    getElementsByTagName: en
  } = n, {
    importNode: Xn
  } = r;
  let Z = ei();
  t.isSupported = typeof Vi == "function" && typeof K == "function" && Se && Se.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: zt,
    ERB_EXPR: tn,
    TMPLIT_EXPR: xt,
    DATA_ATTR: xn,
    ARIA_ATTR: $n,
    IS_SCRIPT_OR_DATA: Kn,
    ATTR_WHITESPACE: Rt,
    CUSTOM_ELEMENT: Zn
  } = Qr;
  let {
    IS_ALLOWED_URI: Rn
  } = Qr, q = null;
  const nn = S({}, [...$r, ...or, ...lr, ...fr, ...Kr]);
  let X = null;
  const Dn = S({}, [...Zr, ...ur, ...Jr, ...zn]);
  let G = Object.seal(Tr(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), ht = null, Bt = null;
  const st = Object.seal(Tr(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let In = !0, rn = !0, On = !1, an = !0, vt = !1, Ht = !0, ot = !1, sn = !1, on = !1, _t = !1, Gt = !1, jt = !1, h = !0, m = !1;
  const w = "user-content-";
  let D = !0, te = !1, ne = {}, W = null;
  const Ce = S({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Le = null;
  const re = S({}, ["audio", "video", "img", "source", "image", "track"]);
  let ie = null;
  const Ee = S({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), j = "http://www.w3.org/1998/Math/MathML", Pe = "http://www.w3.org/2000/svg", he = "http://www.w3.org/1999/xhtml";
  let Fe = he, Te = !1, et = null;
  const tt = S({}, [j, Pe, he], ar);
  let Q = S({}, ["mi", "mo", "mn", "ms", "mtext"]), xe = S({}, ["annotation-xml"]);
  const L = S({}, ["title", "style", "font", "a", "script"]);
  let J = null;
  const lt = ["application/xhtml+xml", "text/html"], Wt = "text/html";
  let B = null, Ye = null;
  const qe = n.createElement("form"), ft = function(s) {
    return s instanceof RegExp || s instanceof Function;
  }, Vt = function() {
    let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ye && Ye === s)) {
      if ((!s || typeof s != "object") && (s = {}), s = nt(s), J = // eslint-disable-next-line unicorn/prefer-includes
      lt.indexOf(s.PARSER_MEDIA_TYPE) === -1 ? Wt : s.PARSER_MEDIA_TYPE, B = J === "application/xhtml+xml" ? ar : Gn, q = Xe(s, "ALLOWED_TAGS") ? S({}, s.ALLOWED_TAGS, B) : nn, X = Xe(s, "ALLOWED_ATTR") ? S({}, s.ALLOWED_ATTR, B) : Dn, et = Xe(s, "ALLOWED_NAMESPACES") ? S({}, s.ALLOWED_NAMESPACES, ar) : tt, ie = Xe(s, "ADD_URI_SAFE_ATTR") ? S(nt(Ee), s.ADD_URI_SAFE_ATTR, B) : Ee, Le = Xe(s, "ADD_DATA_URI_TAGS") ? S(nt(re), s.ADD_DATA_URI_TAGS, B) : re, W = Xe(s, "FORBID_CONTENTS") ? S({}, s.FORBID_CONTENTS, B) : Ce, ht = Xe(s, "FORBID_TAGS") ? S({}, s.FORBID_TAGS, B) : nt({}), Bt = Xe(s, "FORBID_ATTR") ? S({}, s.FORBID_ATTR, B) : nt({}), ne = Xe(s, "USE_PROFILES") ? s.USE_PROFILES : !1, In = s.ALLOW_ARIA_ATTR !== !1, rn = s.ALLOW_DATA_ATTR !== !1, On = s.ALLOW_UNKNOWN_PROTOCOLS || !1, an = s.ALLOW_SELF_CLOSE_IN_ATTR !== !1, vt = s.SAFE_FOR_TEMPLATES || !1, Ht = s.SAFE_FOR_XML !== !1, ot = s.WHOLE_DOCUMENT || !1, _t = s.RETURN_DOM || !1, Gt = s.RETURN_DOM_FRAGMENT || !1, jt = s.RETURN_TRUSTED_TYPE || !1, on = s.FORCE_BODY || !1, h = s.SANITIZE_DOM !== !1, m = s.SANITIZE_NAMED_PROPS || !1, D = s.KEEP_CONTENT !== !1, te = s.IN_PLACE || !1, Rn = s.ALLOWED_URI_REGEXP || Yi, Fe = s.NAMESPACE || he, Q = s.MATHML_TEXT_INTEGRATION_POINTS || Q, xe = s.HTML_INTEGRATION_POINTS || xe, G = s.CUSTOM_ELEMENT_HANDLING || {}, s.CUSTOM_ELEMENT_HANDLING && ft(s.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (G.tagNameCheck = s.CUSTOM_ELEMENT_HANDLING.tagNameCheck), s.CUSTOM_ELEMENT_HANDLING && ft(s.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (G.attributeNameCheck = s.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), s.CUSTOM_ELEMENT_HANDLING && typeof s.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (G.allowCustomizedBuiltInElements = s.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), vt && (rn = !1), Gt && (_t = !0), ne && (q = S({}, Kr), X = [], ne.html === !0 && (S(q, $r), S(X, Zr)), ne.svg === !0 && (S(q, or), S(X, ur), S(X, zn)), ne.svgFilters === !0 && (S(q, lr), S(X, ur), S(X, zn)), ne.mathMl === !0 && (S(q, fr), S(X, Jr), S(X, zn))), s.ADD_TAGS && (typeof s.ADD_TAGS == "function" ? st.tagCheck = s.ADD_TAGS : (q === nn && (q = nt(q)), S(q, s.ADD_TAGS, B))), s.ADD_ATTR && (typeof s.ADD_ATTR == "function" ? st.attributeCheck = s.ADD_ATTR : (X === Dn && (X = nt(X)), S(X, s.ADD_ATTR, B))), s.ADD_URI_SAFE_ATTR && S(ie, s.ADD_URI_SAFE_ATTR, B), s.FORBID_CONTENTS && (W === Ce && (W = nt(W)), S(W, s.FORBID_CONTENTS, B)), s.ADD_FORBID_CONTENTS && (W === Ce && (W = nt(W)), S(W, s.ADD_FORBID_CONTENTS, B)), D && (q["#text"] = !0), ot && S(q, ["html", "head", "body"]), q.table && (S(q, ["tbody"]), delete ht.tbody), s.TRUSTED_TYPES_POLICY) {
        if (typeof s.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw hn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof s.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw hn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        N = s.TRUSTED_TYPES_POLICY, fe = N.createHTML("");
      } else
        N === void 0 && (N = Bs(y, i)), N !== null && typeof fe == "string" && (fe = N.createHTML(""));
      me && me(s), Ye = s;
    }
  }, kn = S({}, [...or, ...lr, ...Is]), ln = S({}, [...fr, ...Os]), Jn = function(s) {
    let p = K(s);
    (!p || !p.tagName) && (p = {
      namespaceURI: Fe,
      tagName: "template"
    });
    const E = Gn(s.tagName), H = Gn(p.tagName);
    return et[s.namespaceURI] ? s.namespaceURI === Pe ? p.namespaceURI === he ? E === "svg" : p.namespaceURI === j ? E === "svg" && (H === "annotation-xml" || Q[H]) : !!kn[E] : s.namespaceURI === j ? p.namespaceURI === he ? E === "math" : p.namespaceURI === Pe ? E === "math" && xe[H] : !!ln[E] : s.namespaceURI === he ? p.namespaceURI === Pe && !xe[H] || p.namespaceURI === j && !Q[H] ? !1 : !ln[E] && (L[E] || !kn[E]) : !!(J === "application/xhtml+xml" && et[s.namespaceURI]) : !1;
  }, Ue = function(s) {
    dn(t.removed, {
      element: s
    });
    try {
      K(s).removeChild(s);
    } catch {
      R(s);
    }
  }, ut = function(s, p) {
    try {
      dn(t.removed, {
        attribute: p.getAttributeNode(s),
        from: p
      });
    } catch {
      dn(t.removed, {
        attribute: null,
        from: p
      });
    }
    if (p.removeAttribute(s), s === "is")
      if (_t || Gt)
        try {
          Ue(p);
        } catch {
        }
      else
        try {
          p.setAttribute(s, "");
        } catch {
        }
  }, Mn = function(s) {
    let p = null, E = null;
    if (on)
      s = "<remove></remove>" + s;
    else {
      const $ = sr(s, /^[\r\n\t ]+/);
      E = $ && $[0];
    }
    J === "application/xhtml+xml" && Fe === he && (s = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + s + "</body></html>");
    const H = N ? N.createHTML(s) : s;
    if (Fe === he)
      try {
        p = new g().parseFromString(H, J);
      } catch {
      }
    if (!p || !p.documentElement) {
      p = Se.createDocument(Fe, "template", null);
      try {
        p.documentElement.innerHTML = Te ? fe : H;
      } catch {
      }
    }
    const ce = p.body || p.documentElement;
    return s && E && ce.insertBefore(n.createTextNode(E), ce.childNodes[0] || null), Fe === he ? en.call(p, ot ? "html" : "body")[0] : ot ? p.documentElement : ce;
  }, Nn = function(s) {
    return pe.call(
      s.ownerDocument || s,
      s,
      // eslint-disable-next-line no-bitwise
      f.SHOW_ELEMENT | f.SHOW_COMMENT | f.SHOW_TEXT | f.SHOW_PROCESSING_INSTRUCTION | f.SHOW_CDATA_SECTION,
      null
    );
  }, V = function(s) {
    return s instanceof _ && (typeof s.nodeName != "string" || typeof s.textContent != "string" || typeof s.removeChild != "function" || !(s.attributes instanceof v) || typeof s.removeAttribute != "function" || typeof s.setAttribute != "function" || typeof s.namespaceURI != "string" || typeof s.insertBefore != "function" || typeof s.hasChildNodes != "function");
  }, ue = function(s) {
    return typeof o == "function" && s instanceof o;
  };
  function ve(T, s, p) {
    Un(T, (E) => {
      E.call(t, s, p, Ye);
    });
  }
  const Cn = function(s) {
    let p = null;
    if (ve(Z.beforeSanitizeElements, s, null), V(s))
      return Ue(s), !0;
    const E = B(s.nodeName);
    if (ve(Z.uponSanitizeElement, s, {
      tagName: E,
      allowedTags: q
    }), Ht && s.hasChildNodes() && !ue(s.firstElementChild) && _e(/<[/\w!]/g, s.innerHTML) && _e(/<[/\w!]/g, s.textContent) || s.nodeType === _n.progressingInstruction || Ht && s.nodeType === _n.comment && _e(/<[/\w]/g, s.data))
      return Ue(s), !0;
    if (!(st.tagCheck instanceof Function && st.tagCheck(E)) && (!q[E] || ht[E])) {
      if (!ht[E] && Ln(E) && (G.tagNameCheck instanceof RegExp && _e(G.tagNameCheck, E) || G.tagNameCheck instanceof Function && G.tagNameCheck(E)))
        return !1;
      if (D && !W[E]) {
        const H = K(s) || s.parentNode, ce = O(s) || s.childNodes;
        if (ce && H) {
          const $ = ce.length;
          for (let be = $ - 1; be >= 0; --be) {
            const ct = A(ce[be], !0);
            ct.__removalCount = (s.__removalCount || 0) + 1, H.insertBefore(ct, M(s));
          }
        }
      }
      return Ue(s), !0;
    }
    return s instanceof u && !Jn(s) || (E === "noscript" || E === "noembed" || E === "noframes") && _e(/<\/no(script|embed|frames)/i, s.innerHTML) ? (Ue(s), !0) : (vt && s.nodeType === _n.text && (p = s.textContent, Un([zt, tn, xt], (H) => {
      p = pn(p, H, " ");
    }), s.textContent !== p && (dn(t.removed, {
      element: s.cloneNode()
    }), s.textContent = p)), ve(Z.afterSanitizeElements, s, null), !1);
  }, fn = function(s, p, E) {
    if (h && (p === "id" || p === "name") && (E in n || E in qe))
      return !1;
    if (!(rn && !Bt[p] && _e(xn, p))) {
      if (!(In && _e($n, p))) {
        if (!(st.attributeCheck instanceof Function && st.attributeCheck(p, s))) {
          if (!X[p] || Bt[p]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(Ln(s) && (G.tagNameCheck instanceof RegExp && _e(G.tagNameCheck, s) || G.tagNameCheck instanceof Function && G.tagNameCheck(s)) && (G.attributeNameCheck instanceof RegExp && _e(G.attributeNameCheck, p) || G.attributeNameCheck instanceof Function && G.attributeNameCheck(p, s)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              p === "is" && G.allowCustomizedBuiltInElements && (G.tagNameCheck instanceof RegExp && _e(G.tagNameCheck, E) || G.tagNameCheck instanceof Function && G.tagNameCheck(E)))
            ) return !1;
          } else if (!ie[p]) {
            if (!_e(Rn, pn(E, Rt, ""))) {
              if (!((p === "src" || p === "xlink:href" || p === "href") && s !== "script" && Ss(E, "data:") === 0 && Le[s])) {
                if (!(On && !_e(Kn, pn(E, Rt, "")))) {
                  if (E)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, Ln = function(s) {
    return s !== "annotation-xml" && sr(s, Zn);
  }, Nr = function(s) {
    ve(Z.beforeSanitizeAttributes, s, null);
    const {
      attributes: p
    } = s;
    if (!p || V(s))
      return;
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: X,
      forceKeepAttr: void 0
    };
    let H = p.length;
    for (; H--; ) {
      const ce = p[H], {
        name: $,
        namespaceURI: be,
        value: ct
      } = ce, Yt = B($), Qn = ct;
      let ae = $ === "value" ? Qn : xs(Qn);
      if (E.attrName = Yt, E.attrValue = ae, E.keepAttr = !0, E.forceKeepAttr = void 0, ve(Z.uponSanitizeAttribute, s, E), ae = E.attrValue, m && (Yt === "id" || Yt === "name") && (ut($, s), ae = w + ae), Ht && _e(/((--!?|])>)|<\/(style|title|textarea)/i, ae)) {
        ut($, s);
        continue;
      }
      if (Yt === "attributename" && sr(ae, "href")) {
        ut($, s);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        ut($, s);
        continue;
      }
      if (!an && _e(/\/>/i, ae)) {
        ut($, s);
        continue;
      }
      vt && Un([zt, tn, xt], (Lr) => {
        ae = pn(ae, Lr, " ");
      });
      const Cr = B(s.nodeName);
      if (!fn(Cr, Yt, ae)) {
        ut($, s);
        continue;
      }
      if (N && typeof y == "object" && typeof y.getAttributeType == "function" && !be)
        switch (y.getAttributeType(Cr, Yt)) {
          case "TrustedHTML": {
            ae = N.createHTML(ae);
            break;
          }
          case "TrustedScriptURL": {
            ae = N.createScriptURL(ae);
            break;
          }
        }
      if (ae !== Qn)
        try {
          be ? s.setAttributeNS(be, $, ae) : s.setAttribute($, ae), V(s) ? Ue(s) : Xr(t.removed);
        } catch {
          ut($, s);
        }
    }
    ve(Z.afterSanitizeAttributes, s, null);
  }, $i = function T(s) {
    let p = null;
    const E = Nn(s);
    for (ve(Z.beforeSanitizeShadowDOM, s, null); p = E.nextNode(); )
      ve(Z.uponSanitizeShadowNode, p, null), Cn(p), Nr(p), p.content instanceof a && T(p.content);
    ve(Z.afterSanitizeShadowDOM, s, null);
  };
  return t.sanitize = function(T) {
    let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, p = null, E = null, H = null, ce = null;
    if (Te = !T, Te && (T = "<!-->"), typeof T != "string" && !ue(T))
      if (typeof T.toString == "function") {
        if (T = T.toString(), typeof T != "string")
          throw hn("dirty is not a string, aborting");
      } else
        throw hn("toString is not a function");
    if (!t.isSupported)
      return T;
    if (sn || Vt(s), t.removed = [], typeof T == "string" && (te = !1), te) {
      if (T.nodeName) {
        const ct = B(T.nodeName);
        if (!q[ct] || ht[ct])
          throw hn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (T instanceof o)
      p = Mn("<!---->"), E = p.ownerDocument.importNode(T, !0), E.nodeType === _n.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? p = E : p.appendChild(E);
    else {
      if (!_t && !vt && !ot && // eslint-disable-next-line unicorn/prefer-includes
      T.indexOf("<") === -1)
        return N && jt ? N.createHTML(T) : T;
      if (p = Mn(T), !p)
        return _t ? null : jt ? fe : "";
    }
    p && on && Ue(p.firstChild);
    const $ = Nn(te ? T : p);
    for (; H = $.nextNode(); )
      Cn(H), Nr(H), H.content instanceof a && $i(H.content);
    if (te)
      return T;
    if (_t) {
      if (Gt)
        for (ce = Ne.call(p.ownerDocument); p.firstChild; )
          ce.appendChild(p.firstChild);
      else
        ce = p;
      return (X.shadowroot || X.shadowrootmode) && (ce = Xn.call(r, ce, !0)), ce;
    }
    let be = ot ? p.outerHTML : p.innerHTML;
    return ot && q["!doctype"] && p.ownerDocument && p.ownerDocument.doctype && p.ownerDocument.doctype.name && _e(qi, p.ownerDocument.doctype.name) && (be = "<!DOCTYPE " + p.ownerDocument.doctype.name + `>
` + be), vt && Un([zt, tn, xt], (ct) => {
      be = pn(be, ct, " ");
    }), N && jt ? N.createHTML(be) : be;
  }, t.setConfig = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Vt(T), sn = !0;
  }, t.clearConfig = function() {
    Ye = null, sn = !1;
  }, t.isValidAttribute = function(T, s, p) {
    Ye || Vt({});
    const E = B(T), H = B(s);
    return fn(E, H, p);
  }, t.addHook = function(T, s) {
    typeof s == "function" && dn(Z[T], s);
  }, t.removeHook = function(T, s) {
    if (s !== void 0) {
      const p = ws(Z[T], s);
      return p === -1 ? void 0 : As(Z[T], p, 1)[0];
    }
    return Xr(Z[T]);
  }, t.removeHooks = function(T) {
    Z[T] = [];
  }, t.removeAllHooks = function() {
    Z = ei();
  }, t;
}
var Hs = Xi();
const Gs = "__fuzzyPeanutSDK";
let Bn;
function rt() {
  if (Bn)
    return Bn;
  if (typeof window < "u") {
    const e = window[Gs];
    if (e)
      return Bn = e, Bn;
  }
  throw new Error("[FuzzyPeanut] SDK not initialized. Ensure this module is running inside the FuzzyPeanut shell.");
}
const js = "http://localhost:8080";
let En = null;
async function Ws() {
  if (En) return En;
  const e = await rt().auth.getToken(), t = await fetch(`${js}/.well-known/jmap`, {
    headers: { Authorization: `Bearer ${e}` }
  });
  if (!t.ok) throw new Error(`JMAP session error: ${t.status}`);
  return En = await t.json(), En;
}
function Vs() {
  En = null;
}
async function At(e) {
  const [t, n] = await Promise.all([rt().auth.getToken(), Ws()]), r = n.primaryAccounts["urn:ietf:params:jmap:mail"];
  if (!r) throw new Error("No JMAP mail account in session");
  const i = await fetch(n.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`
    },
    body: JSON.stringify({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: e.map(([l, o, u]) => [l, { accountId: r, ...o }, u])
    })
  });
  if (!i.ok) throw new Error(`JMAP request failed: ${i.status}`);
  return (await i.json()).methodResponses;
}
async function Ys() {
  const [[, e]] = await At([["Mailbox/get", { ids: null }, "a"]]);
  return e.list;
}
async function qs(e, t = 100) {
  const n = await At([
    [
      "Email/query",
      {
        filter: { inMailbox: e },
        sort: [{ property: "receivedAt", isAscending: !1 }],
        limit: t
      },
      "q"
    ],
    [
      "Email/get",
      {
        "#ids": { resultOf: "q", name: "Email/query", path: "/ids" },
        properties: ["id", "threadId", "subject", "from", "receivedAt", "preview", "keywords"]
      },
      "g"
    ]
  ]), [, r] = n[1];
  return r.list;
}
async function Xs(e) {
  const t = await At([
    ["Thread/get", { ids: [e] }, "t"],
    [
      "Email/get",
      {
        "#ids": { resultOf: "t", name: "Thread/get", path: "/list/0/emailIds" },
        properties: [
          "id",
          "threadId",
          "subject",
          "from",
          "to",
          "cc",
          "receivedAt",
          "preview",
          "keywords",
          "htmlBody",
          "textBody",
          "bodyValues",
          "hasAttachment",
          "attachments"
        ],
        fetchAllBodyValues: !0
      },
      "g"
    ]
  ]), [, n] = t[1];
  return n.list.map($s);
}
function $s(e) {
  const t = e.htmlBody?.[0]?.partId, n = e.textBody?.[0]?.partId;
  return {
    id: e.id,
    threadId: e.threadId,
    subject: e.subject,
    from: e.from,
    to: e.to ?? [],
    cc: e.cc ?? [],
    receivedAt: e.receivedAt,
    preview: e.preview,
    keywords: e.keywords,
    hasAttachment: e.hasAttachment,
    attachments: e.attachments ?? [],
    htmlBody: t ? e.bodyValues?.[t]?.value ?? null : null,
    textBody: n ? e.bodyValues?.[n]?.value ?? null : null
  };
}
async function Ks(e) {
  if (!e.length) return;
  const t = {};
  for (const n of e)
    t[n] = { "keywords/$seen": !0 };
  await At([["Email/set", { update: t }, "a"]]);
}
async function Zs(e, t, n, r, i) {
  if (i)
    return await At([
      [
        "Email/set",
        {
          update: {
            [i]: {
              to: t ? [{ email: t }] : [],
              subject: n || "(no subject)",
              textBody: [{ partId: "1", type: "text/plain" }],
              bodyValues: { 1: { value: r } }
            }
          }
        },
        "a"
      ]
    ]), i;
  const [[, a]] = await At([
    [
      "Email/set",
      {
        create: {
          draft: {
            mailboxIds: { [e]: !0 },
            keywords: { $draft: !0 },
            to: t ? [{ email: t }] : [],
            subject: n || "(no subject)",
            textBody: [{ partId: "1", type: "text/plain" }],
            bodyValues: { 1: { value: r } }
          }
        }
      },
      "a"
    ]
  ]), o = a.created?.draft;
  if (!o) throw new Error("Draft creation failed");
  return o.id;
}
async function ti(e) {
  await At([["Email/set", { destroy: [e] }, "a"]]);
}
async function Js(e, t, n) {
  await At([
    [
      "Email/set",
      {
        create: {
          outgoing: {
            mailboxIds: {},
            to: [{ email: e }],
            subject: t,
            textBody: [{ partId: "1", type: "text/plain" }],
            bodyValues: { 1: { value: n } }
          }
        }
      },
      "e"
    ],
    [
      "EmailSubmission/set",
      {
        create: {
          sub: {
            emailId: "#outgoing",
            envelope: { mailFrom: { email: "" }, rcptTo: [{ email: e }] }
          }
        }
      },
      "s"
    ]
  ]);
}
var Qs = /* @__PURE__ */ U('<span class="unread-badge svelte-crc88l"> </span>'), eo = /* @__PURE__ */ U('<li><button><span class="mailbox-name"> </span> <!></button></li>'), to = /* @__PURE__ */ U('<div class="error-banner svelte-crc88l"> </div>'), no = /* @__PURE__ */ U('<button class="picker-btn svelte-crc88l" aria-label="Pick contact">👤</button>'), ro = /* @__PURE__ */ U('<span class="attachment-chip svelte-crc88l"> <button class="attachment-remove svelte-crc88l" aria-label="Remove attachment">✕</button></span>'), io = /* @__PURE__ */ U('<div class="attachment-list svelte-crc88l"></div>'), ao = /* @__PURE__ */ U('<div class="send-error svelte-crc88l"> </div>'), so = /* @__PURE__ */ U('<button class="attach-btn svelte-crc88l">📎 Attach from Files</button>'), oo = /* @__PURE__ */ U('<div class="compose-pane svelte-crc88l"><div class="compose-header svelte-crc88l"><h2 class="svelte-crc88l">New Message</h2> <button class="close-btn svelte-crc88l" aria-label="Discard">✕</button></div> <div class="compose-field svelte-crc88l"><label for="compose-to" class="svelte-crc88l">To</label> <input id="compose-to" type="email" placeholder="recipient@example.com" class="svelte-crc88l"/> <!></div> <div class="compose-field svelte-crc88l"><label for="compose-subject" class="svelte-crc88l">Subject</label> <input id="compose-subject" type="text" placeholder="Subject" class="svelte-crc88l"/></div> <textarea placeholder="Write your message…" class="svelte-crc88l"></textarea> <!> <!> <div class="compose-actions svelte-crc88l"><button class="send-btn svelte-crc88l"> </button> <!> <button class="discard-btn svelte-crc88l">Discard</button></div></div>'), lo = /* @__PURE__ */ U('<div class="loading-state svelte-crc88l"><span class="spinner svelte-crc88l"></span></div>'), fo = /* @__PURE__ */ U('<button class="calendar-action svelte-crc88l">📅 Add to Calendar</button>'), uo = /* @__PURE__ */ U('<div class="email-html-body svelte-crc88l"><!></div>'), co = /* @__PURE__ */ U('<pre class="email-text-body svelte-crc88l"> </pre>'), po = /* @__PURE__ */ U('<p class="empty-body svelte-crc88l">(no body)</p>'), ho = /* @__PURE__ */ U('<span class="attachment-chip svelte-crc88l"> </span>'), vo = /* @__PURE__ */ U('<div class="attachment-list svelte-crc88l"></div>'), _o = /* @__PURE__ */ U('<div class="thread-email-body svelte-crc88l"><!> <!> <!></div>'), mo = /* @__PURE__ */ U('<div><button class="thread-email-header svelte-crc88l"><span class="email-from svelte-crc88l"> </span> <span class="email-date svelte-crc88l"> </span> <span class="expand-icon svelte-crc88l"> </span></button> <!></div>'), go = /* @__PURE__ */ U('<div class="thread-emails svelte-crc88l"></div>'), Eo = /* @__PURE__ */ U('<div class="thread-pane svelte-crc88l"><div class="thread-header svelte-crc88l"><button class="back-btn svelte-crc88l">← Back</button> <h2 class="thread-subject svelte-crc88l"> </h2></div> <!></div>'), To = /* @__PURE__ */ U('<div class="loading-state svelte-crc88l"><span class="spinner svelte-crc88l"></span></div>'), bo = /* @__PURE__ */ U('<div class="empty-state svelte-crc88l">No messages</div>'), yo = /* @__PURE__ */ U('<span class="thread-count svelte-crc88l"> </span>'), wo = /* @__PURE__ */ U('<li role="button" tabindex="0"><div class="email-from svelte-crc88l"> </div> <div class="email-meta svelte-crc88l"><span class="email-subject svelte-crc88l"> <!></span> <span class="email-preview svelte-crc88l"> </span></div> <div class="email-date svelte-crc88l"> </div></li>'), Ao = /* @__PURE__ */ U('<ul class="email-list svelte-crc88l"></ul>'), So = /* @__PURE__ */ U('<div class="mail-app svelte-crc88l"><aside class="mailbox-list svelte-crc88l"><div class="mailbox-header svelte-crc88l"><button class="compose-btn svelte-crc88l">+ Compose</button></div> <ul class="svelte-crc88l"></ul></aside> <main class="mail-main svelte-crc88l"><!> <!></main></div>');
function xo(e, t) {
  li(t, !0);
  let n = /* @__PURE__ */ z(it([])), r = /* @__PURE__ */ z(it([])), i = /* @__PURE__ */ z(null), a = /* @__PURE__ */ z(!0), l = /* @__PURE__ */ z(null), o = /* @__PURE__ */ z("inbox"), u = /* @__PURE__ */ z(null), f = /* @__PURE__ */ z(it([])), v = /* @__PURE__ */ z(!1), _ = /* @__PURE__ */ z(it(/* @__PURE__ */ new Set())), g = /* @__PURE__ */ z(""), y = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(""), A = /* @__PURE__ */ z(!1), R = /* @__PURE__ */ z(null), M = /* @__PURE__ */ z(it([])), O = /* @__PURE__ */ z(null), K = null, N = /* @__PURE__ */ ze(() => () => {
    const h = /* @__PURE__ */ new Set(), m = [];
    for (const w of c(r))
      h.has(w.threadId) || (h.add(w.threadId), m.push(w));
    return m;
  }), fe = /* @__PURE__ */ ze(() => () => {
    const h = /* @__PURE__ */ new Map();
    for (const m of c(r))
      h.set(m.threadId, (h.get(m.threadId) ?? 0) + 1);
    return h;
  }), Se = /* @__PURE__ */ ze(() => () => c(n).find((h) => h.role === "drafts")?.id ?? ""), pe = /* @__PURE__ */ ze(() => () => rt().registry.getModules().some((h) => h.id === "fuzzypeanut-files")), Ne = /* @__PURE__ */ ze(() => () => rt().registry.getModules().some((h) => h.id === "fuzzypeanut-contacts")), en = /* @__PURE__ */ ze(() => () => rt().registry.getModules().some((h) => h.id === "fuzzypeanut-calendar"));
  gs(async () => {
    await Xn();
    const h = rt();
    h.events.on("mail:compose", (m) => {
      const w = m;
      xt(w?.to ?? "", w?.subject ?? "", w?.body ?? "");
    }), h.events.on("mail:compose-with-files", (m) => {
      const w = m;
      b(M, (w?.fileIds ?? []).map((D) => ({ id: D, name: D })), !0), xt(w?.to ?? "", w?.subject ?? "", "");
    }), h.events.on("mail:files-picked", (m) => {
      const w = m;
      w?.files && b(M, [...c(M), ...w.files], !0);
    }), h.auth.onAuthChange(() => {
      Vs();
    });
  });
  async function Xn() {
    b(a, !0), b(l, null);
    try {
      b(n, await Ys(), !0), c(n).sort((m, w) => m.sortOrder - w.sortOrder);
      const h = c(n).find((m) => m.role === "inbox") ?? c(n)[0];
      h && (b(i, h.id, !0), await Z(h.id));
    } catch (h) {
      b(l, h instanceof Error ? h.message : "Failed to load mail", !0);
    }
    b(a, !1);
  }
  async function Z(h) {
    b(a, !0), b(l, null);
    try {
      b(r, await qs(h), !0);
    } catch (m) {
      b(l, m instanceof Error ? m.message : "Failed to load emails", !0);
    }
    b(a, !1);
  }
  async function zt(h) {
    b(o, "thread"), b(u, h.threadId, !0), b(f, [], !0), b(v, !0), b(_, /* @__PURE__ */ new Set(), !0);
    try {
      const m = await Xs(h.threadId);
      b(f, m.sort((D, te) => new Date(D.receivedAt).getTime() - new Date(te.receivedAt).getTime()), !0), c(f).length && b(_, /* @__PURE__ */ new Set([c(f)[c(f).length - 1].id]), !0);
      const w = m.filter((D) => !D.keywords.$seen).map((D) => D.id);
      if (w.length) {
        await Ks(w);
        for (const D of c(r))
          w.includes(D.id) && (D.keywords = { ...D.keywords, $seen: !0 });
      }
    } catch (m) {
      b(l, m instanceof Error ? m.message : "Failed to load thread", !0);
    }
    b(v, !1);
  }
  function tn(h) {
    const m = new Set(c(_));
    m.has(h) ? m.delete(h) : m.add(h), b(_, m, !0);
  }
  function xt(h = "", m = "", w = "") {
    b(g, h, !0), b(y, m, !0), b(d, w, !0), b(R, null), b(M, [], !0), b(O, null), b(o, "compose"), Kn();
  }
  function xn() {
    Rt(), c(O) && (ti(c(O)).catch(() => {
    }), b(O, null)), b(o, "inbox");
  }
  async function $n() {
    if (!c(g).trim()) {
      b(R, "Please enter a recipient.");
      return;
    }
    b(A, !0), b(R, null);
    try {
      await Js(c(g).trim(), c(y), c(d)), Rt(), c(O) && (ti(c(O)).catch(() => {
      }), b(O, null)), b(o, "inbox"), await Z(c(i));
    } catch (h) {
      b(R, h instanceof Error ? h.message : "Send failed", !0);
    }
    b(A, !1);
  }
  function Kn() {
    Rt(), K = setInterval(
      async () => {
        if (!(!c(Se) || !c(g) && !c(y) && !c(d)))
          try {
            b(O, await Zs(c(Se), c(g), c(y), c(d), c(O) ?? void 0), !0);
          } catch {
          }
      },
      3e4
    );
  }
  function Rt() {
    K !== null && (clearInterval(K), K = null);
  }
  function Zn() {
    rt().events.emit("files:pick", { returnEvent: "mail:files-picked", multiple: !0 });
  }
  function Rn() {
    rt().events.emit("contacts:pick", { returnEvent: "mail:contact-picked", multiple: !1 });
    const h = rt().events.on("mail:contact-picked", (m) => {
      const w = m;
      w?.contacts?.[0] && b(g, w.contacts[0].email, !0), h();
    });
  }
  function q(h) {
    rt().events.emit("calendar:add-event", {
      summary: h.subject,
      description: h.textBody ?? void 0,
      icsData: void 0
      // full ICS parsing is a future enhancement
    });
  }
  function nn(h) {
    const m = new Date(h), w = /* @__PURE__ */ new Date();
    return m.toDateString() === w.toDateString() ? m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : m.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  function X(h) {
    const m = h[0];
    return m ? m.name || m.email : "?";
  }
  function Dn(h) {
    return Hs.sanitize(h, {
      FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
      FORBID_ATTR: ["onerror", "onload", "onclick"]
    });
  }
  var G = { stopAutosave: Rt }, ht = So(), Bt = x(ht), st = x(Bt), In = x(st), rn = P(st, 2);
  un(rn, 21, () => c(n), (h) => h.id, (h, m) => {
    var w = eo(), D = x(w);
    let te;
    var ne = x(D), W = x(ne), Ce = P(ne, 2);
    {
      var Le = (re) => {
        var ie = Qs(), Ee = x(ie);
        Ie(() => se(Ee, c(m).unreadEmails)), F(re, ie);
      };
      De(Ce, (re) => {
        c(m).unreadEmails > 0 && re(Le);
      });
    }
    Ie(() => {
      te = tr(D, 1, "mailbox-item svelte-crc88l", null, te, { active: c(i) === c(m).id }), se(W, c(m).name);
    }), Re("click", D, async () => {
      b(i, c(m).id, !0), b(o, "inbox"), await Z(c(m).id);
    }), F(h, w);
  });
  var On = P(Bt, 2), an = x(On);
  {
    var vt = (h) => {
      var m = to(), w = x(m);
      Ie(() => se(w, c(l))), F(h, m);
    };
    De(an, (h) => {
      c(l) && h(vt);
    });
  }
  var Ht = P(an, 2);
  {
    var ot = (h) => {
      var m = oo(), w = x(m), D = P(x(w), 2), te = P(w, 2), ne = P(x(te), 2), W = P(ne, 2);
      {
        var Ce = (L) => {
          var J = no();
          Re("click", J, Rn), F(L, J);
        };
        De(W, (L) => {
          c(Ne) && L(Ce);
        });
      }
      var Le = P(te, 2), re = P(x(Le), 2), ie = P(Le, 2), Ee = P(ie, 2);
      {
        var j = (L) => {
          var J = io();
          un(J, 21, () => c(M), (lt) => lt.id, (lt, Wt) => {
            var B = ro(), Ye = x(B), qe = P(Ye);
            Ie(() => se(Ye, `📎 ${c(Wt).name ?? ""} `)), Re("click", qe, () => {
              b(M, c(M).filter((ft) => ft.id !== c(Wt).id), !0);
            }), F(lt, B);
          }), F(L, J);
        };
        De(Ee, (L) => {
          c(M).length > 0 && L(j);
        });
      }
      var Pe = P(Ee, 2);
      {
        var he = (L) => {
          var J = ao(), lt = x(J);
          Ie(() => se(lt, c(R))), F(L, J);
        };
        De(Pe, (L) => {
          c(R) && L(he);
        });
      }
      var Fe = P(Pe, 2), Te = x(Fe), et = x(Te), tt = P(Te, 2);
      {
        var Q = (L) => {
          var J = so();
          Re("click", J, Zn), F(L, J);
        };
        De(tt, (L) => {
          c(pe) && L(Q);
        });
      }
      var xe = P(tt, 2);
      Ie(() => {
        Te.disabled = c(A), se(et, c(A) ? "Sending…" : "Send");
      }), Re("click", D, xn), nr(ne, () => c(g), (L) => b(g, L)), nr(re, () => c(y), (L) => b(y, L)), nr(ie, () => c(d), (L) => b(d, L)), Re("click", Te, $n), Re("click", xe, xn), F(h, m);
    }, sn = (h) => {
      var m = Eo(), w = x(m), D = x(w), te = P(D, 2), ne = x(te), W = P(w, 2);
      {
        var Ce = (re) => {
          var ie = lo();
          F(re, ie);
        }, Le = (re) => {
          var ie = go();
          un(ie, 21, () => c(f), (Ee) => Ee.id, (Ee, j) => {
            const Pe = /* @__PURE__ */ ze(() => c(_).has(c(j).id)), he = /* @__PURE__ */ ze(() => !c(j).keywords.$seen), Fe = /* @__PURE__ */ ze(() => c(j).attachments.some((qe) => qe.type === "text/calendar"));
            var Te = mo();
            let et;
            var tt = x(Te), Q = x(tt), xe = x(Q), L = P(Q, 2), J = x(L), lt = P(L, 2), Wt = x(lt), B = P(tt, 2);
            {
              var Ye = (qe) => {
                var ft = _o(), Vt = x(ft);
                {
                  var kn = (V) => {
                    var ue = fo();
                    Re("click", ue, () => q(c(j))), F(V, ue);
                  };
                  De(Vt, (V) => {
                    c(Fe) && c(en) && V(kn);
                  });
                }
                var ln = P(Vt, 2);
                {
                  var Jn = (V) => {
                    var ue = uo(), ve = x(ue);
                    _s(ve, () => Dn(c(j).htmlBody)), F(V, ue);
                  }, Ue = (V) => {
                    var ue = co(), ve = x(ue);
                    Ie(() => se(ve, c(j).textBody)), F(V, ue);
                  }, ut = (V) => {
                    var ue = po();
                    F(V, ue);
                  };
                  De(ln, (V) => {
                    c(j).htmlBody ? V(Jn) : c(j).textBody ? V(Ue, 1) : V(ut, !1);
                  });
                }
                var Mn = P(ln, 2);
                {
                  var Nn = (V) => {
                    var ue = vo();
                    un(ue, 21, () => c(j).attachments, ds, (ve, Cn) => {
                      var fn = ho(), Ln = x(fn);
                      Ie(() => se(Ln, `📎 ${c(Cn).name ?? ""}`)), F(ve, fn);
                    }), F(V, ue);
                  };
                  De(Mn, (V) => {
                    c(j).attachments.length > 0 && V(Nn);
                  });
                }
                F(qe, ft);
              };
              De(B, (qe) => {
                c(Pe) && qe(Ye);
              });
            }
            Ie(
              (qe, ft) => {
                et = tr(Te, 1, "thread-email svelte-crc88l", null, et, { unread: c(he) }), se(xe, qe), se(J, ft), se(Wt, c(Pe) ? "▲" : "▼");
              },
              [
                () => X(c(j).from),
                () => nn(c(j).receivedAt)
              ]
            ), Re("click", tt, () => tn(c(j).id)), F(Ee, Te);
          }), F(re, ie);
        };
        De(W, (re) => {
          c(v) ? re(Ce) : re(Le, !1);
        });
      }
      Ie(() => se(ne, c(f)[0]?.subject ?? "")), Re("click", D, () => {
        b(o, "inbox");
      }), F(h, m);
    }, on = (h) => {
      var m = To();
      F(h, m);
    }, _t = (h) => {
      var m = bo();
      F(h, m);
    }, Gt = /* @__PURE__ */ ze(() => c(N)().length === 0), jt = (h) => {
      var m = Ao();
      un(m, 21, () => c(N)(), (w) => w.threadId, (w, D) => {
        const te = /* @__PURE__ */ ze(() => !c(D).keywords.$seen), ne = /* @__PURE__ */ ze(() => c(fe)().get(c(D).threadId) ?? 1);
        var W = wo();
        let Ce;
        var Le = x(W), re = x(Le), ie = P(Le, 2), Ee = x(ie), j = x(Ee), Pe = P(j);
        {
          var he = (Q) => {
            var xe = yo(), L = x(xe);
            Ie(() => se(L, c(ne))), F(Q, xe);
          };
          De(Pe, (Q) => {
            c(ne) > 1 && Q(he);
          });
        }
        var Fe = P(Ee, 2), Te = x(Fe), et = P(ie, 2), tt = x(et);
        Ie(
          (Q, xe) => {
            Ce = tr(W, 1, "email-item svelte-crc88l", null, Ce, { unread: c(te) }), se(re, Q), se(j, `${c(D).subject ?? ""} `), se(Te, c(D).preview), se(tt, xe);
          },
          [
            () => X(c(D).from),
            () => nn(c(D).receivedAt)
          ]
        ), Re("click", W, () => zt(c(D))), Re("keydown", W, (Q) => {
          (Q.key === "Enter" || Q.key === " ") && zt(c(D));
        }), F(w, W);
      }), F(h, m);
    };
    De(Ht, (h) => {
      c(o) === "compose" ? h(ot) : c(o) === "thread" ? h(sn, 1) : c(a) ? h(on, 2) : c(Gt) ? h(_t, 3) : h(jt, !1);
    });
  }
  return Re("click", In, () => xt()), F(e, ht), fi(G);
}
is(["click", "keydown"]);
const Do = {
  mount(e, t = {}) {
    return ls(xo, { target: e, props: t });
  },
  unmount(e) {
    us(e);
  },
  onInactive(e) {
    e.stopAutosave?.();
  }
};
export {
  Do as default
};
