class Star{
    constructor(id, x, y, mass){
        this.id = id;
        this.x = x;
        this.y = y;
        this.mass = mass/5;
        this.r = 10.0 * Math.sqrt(mass / Math.PI);
    }

    setMass(mass){
      this.mass = mass/5;
      this.r = 10.0 * Math.sqrt(mass / Math.PI);
    }

    draw(svg) {

        svg.append("circle")
            .attr("class", "star")
            .attr("id", "star-" + this.id)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.r)
            .style("fill", "blue");

                //.on("mouseover", handleMouseOver)
        //.on("mouseout", handleMouseOut);
    }

}
