function* mux(a,b) {
  var c = Math.random() > 0.5 ? a : b;
  while(true) {
    if (yield c) c = (c==a) ? b : a;
  }
}
function* freq(f1, f2, p, n) {
  var m = mux(f1, f2);
  while(1) {
    yield m.next(Math.random() < p ? true : false).value
  }
}

function* smooth(iter, n) {
  var x = iter.next().value
  while (1) {
    yield x;
    x += (iter.next().value - x) / n;
  }
}

// p: Exchange probability per unit time.
function* gen(f1, f2, p, ts) {
  var f = smooth(freq(f1, f2, p * ts), 1 / (4 * p * ts));
  // var f = freq(f1, f2, p * ts);
  var ph = 2*Math.PI*Math.random(), n = 0;
  while(1) {
    yield Math.sin(ph);
    ph += ts*f.next().value;
    n++;
  }
}

// take populates array d with data points from generator g
// If d is not specified returns a new array.
function take(g, N, d) {
  var data = (d ? d : new Array(N));
  for (var n = 0; n < N; n++) {
    data[n] = g.next().value;
  }
  // while(n++ < N) {
  //
  // }
  // for (var point of g) {
  //   if (n < N) {
  //     data[n++] = point;
  //     continue;
  //   }
  //   break;
  // }
  return data;
}

function* repeat(val) {
  while(true) yield val;
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

function* add() {
  while(true) {
    var sum = 0;
    for (var g of arguments) {
      sum += g.next().value;
    }
    yield sum;
  }
}
