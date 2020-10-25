var gravConst = 1;

class Comet extends RK.ODESystem {
    constructor(id, t, x, y, color, starContainer) {

        super();
        this.id = id;
        this.color = color;
        this.starContainer = starContainer;

        this.t = t;
        this.px = new RK.Pointer(x);
        this.py = new RK.Pointer(y);
        this.vx = new RK.Pointer(0.01); //in the case of a single star this helps the comet to not hit a singularity
        this.vy = new RK.Pointer(0.01); //in the case of a single star this helps the comet to not hit a singularity
        this.ax = new RK.Pointer(0.0);
        this.ay = new RK.Pointer(0.0);

        this.rk = new RK.RK(4, RK.Methods.Midpoint, { minDh: 1.0 });
        //this.rk = new RK.RK(4, RK.Methods.Euler, { minDh: 1.0 });
        this.odeSetup();
    }

    timestep(targetTime) {
        this.t = this.rk.motion(this, this.t, targetTime);
    }

    odeSetup() {
        this.rk.odes[0].connect(this.px, this.vx, "x position");
        this.rk.odes[1].connect(this.vx, this.ax, "x velocity");
        this.rk.odes[2].connect(this.py, this.vy, "y position");
        this.rk.odes[3].connect(this.vy, this.ay, "y velocity");
    }

    updateODEs() {
        var ga = calcGrav(this.px.val, this.py.val, this.starContainer.stars);
        //var da = calcDrag(this.vx.val, this.vy.val);
        this.ax.val = ga.x;
        this.ay.val = ga.y;

    }

    draw(svg) {
        svg.append("circle")
            .attr("class", "comet")
            .attr("id", "comet-" + this.id)
            .attr("cx", this.px.val)
            .attr("cy", this.py.val)
            .attr("r", 4)
            .style("fill", this.color);
    }
}

function calcGrav(x, y, stars) {
    var acc = {};
    acc.x = 0;
    acc.y = 0;

    for (var i = 0; i < stars.length; i++) {
        var xDiff = stars[i].x - x;
        var yDiff = stars[i].y - y;
        var distance = magnitude([xDiff, yDiff]);
        var magAcc = gravConst * stars[i].mass / distance;
        var distanceUnit = unit([xDiff, yDiff]);
        acc.x += magAcc * distanceUnit[0];
        acc.y += magAcc * distanceUnit[1];
    }

    return acc;
}

function calcDrag(vx, vy) {
    var acc = {};
    var vel = [vx, vy];
    var velUnit = unit(vel);
    var mag = magnitude(vel);
    var temp = velUnit.multiply(-mag * mag * .000005);
    acc.x = temp[0];
    acc.y = temp[1];
    return acc;
}

