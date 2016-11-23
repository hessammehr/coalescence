function* mux(a, b) {
  var c = Math.random() > 0.5 ? a : b;
  while(true) {
    if (yield c) c = (c==a) ? b : a;
  }
}

function* pswitch(p) {
  while(true) {
    yield (Math.random() < p.next().value) ? true : false;
  }
}

function* pmux(a, b, p) {
  var s = pswitch(p), m = mux(a, b);
  while (true) {
    yield m.next(s.next().value).value;
  }
}

function* constg(x) {
  var y;
  while (true) {
    if (y = yield(x)) x = y;
  }
}

function* smooth(g, n) {
  var x = g.next().value
  while (1) {
    yield x;
    x += (g.next().value - x) / n;
  }
}

function* cum(f, ts, initial) {
  var c = initial ? initial : 0.0;
  while(true) {
    c += f.next().value * ts;
    yield c;
  }
}

// p: Exchange probability per unit time.
function* osc(phase) {
  while(true) {
    yield Math.sin(phase.next().value);
  }
}

// take populates array d with data points from generator g
// If d is not specified returns a new array.
function take(g, N, d) {
  var data = (d ? d : new Array(N));
  for (var n = 0; n < N; n++) {
    data[n] = g.next().value;
  }

  return data;
}

function* continuous(g, N, preload) {
  var buff = take(preload ? g : repeat(0), N);
  var x = 0;
  while(true) {
    if (x == N) x = 0;
    buff[x] = g.next().value;
    yield buff.slice(x + 1, N).concat(buff.slice(0, x + 1));
    x++;
  }
}

function* every(g, N) {
  var res;
  while (true) {
    for (var x = 0; x < N; x++)
      res = g.next();
    yield res.value;
  }
}

function* pad(g, c, N) {
  var m = take(constg(c), N);
  while(true) {
    yield g.next().value.concat(m);
  }
}

function* spec(g, N) {
  var fftasm = new FftModule(N, true);

  for (var real of g) {
    var imag = new Float64Array(N);
    fftasm.fftmag(real, imag);
    yield real;
  }
}

function* map(g, f) {
  for (var point of g) {
    yield f(point);
  }
}

// add takes an iterable of generators and returns a
// the point-by-point sum of their values as a generator
function* add(gs) {
  while(true) {
    var sum = 0;
    for (var g of gs) {
      sum += g.next().value;
    }
    yield sum;
  }
}
