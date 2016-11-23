let N = 2048;
let spins = [];
let ps = [];
for (var i = 0; i < 32; i++) {
    ps.push(constg(1.0e-4));
    spins.push(osc(cum(pmux(2, 16, ps[i]), 0.01, Math.random() * 2 * Math.PI)));
}

function update(newp) {
    for (var p of ps) {
        p.next(Math.pow(10, parseFloat(newp)));
    }
    document.getElementById("p").innerHTML = newp;
}

var a = axes("n", "fft_mag", true);
var g = map(spec(pad(every(continuous(add(spins), N, true), 16), 0.0, 7 * N), 8 * N),
    function (a) { return a.slice(0, N / 4); });
// var g = map(continuous(add.apply(null, spins), N), function(a) { return a.slice(0, N/2); });
console.log("Done");
monitor(g, a, 30);