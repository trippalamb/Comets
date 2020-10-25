var gravConst = 1;

class Comet extends RK.ODESystem {
    constructor(id, t, x, y, color, stars) {

        super();
        this.id = id;
        this.color = color;
        this.stars = stars;

        this.t = t;
        this.px = new RK.Pointer(x);
        this.py = new RK.Pointer(y);
        this.vx = new RK.Pointer(0.0);
        this.vy = new RK.Pointer(0.0);
        this.ax = new RK.Pointer(0.0);
        this.ay = new RK.Pointer(0.0);

        this.rk = new RK.RK(4, RK.Methods.Midpoint, { minDh: 0.1 });
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
        var ga = calcGrav(this.px.val, this.py.val, this.stars);
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

class State {
    constructor(x, y) {
        this.px = new Field(x);
        this.py = new Field(y);
        this.vx = new Field(0.1);
        this.vy = new Field(0.1);
        this.ax = new Field(0.0);
        this.ay = new Field(0.0);
    }

    propagate(dt, stars) {
        var accGrav = this.calcGrav(stars);
        var accDrag = this.calcDrag();

        this.px.val += this.vx.val * dt + .5 * this.ax.val * dt * dt;
        this.py.val += this.vy.val * dt + .5 * this.ay.val * dt * dt;
        this.vx.val += this.ax.val * dt;
        this.vy.val += this.ay.val * dt;
        this.ax.val = accGrav.x + accDrag.x;
        this.ay.val = accGrav.y + accDrag.y;

    }

    calcDrag() {
        var acc = {};
        var vel = [this.vx.val, this.vy.val];
        var velUnit = unit(vel);
        var mag = magnitude(vel);
        var temp = velUnit.multiply(-mag * mag * .0005);
        acc.x = temp[0];
        acc.y = temp[1];
        return acc;
    }

    
}


