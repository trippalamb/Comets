class Star{
    constructor(id, x, y, mass){
        this.id = id;
        this.x = x;
        this.y = y;
        this.mass = mass / 5.0;
        this.color = "#1A239C";
        this.highlightColor = "orange";
        this.r = 10.0 * Math.sqrt(mass / Math.PI);
        this.selected = false;


    }

    setMass(mass){
      this.mass = mass/5.0;
      this.r = 10.0 * Math.sqrt(mass / Math.PI);
    }

    redraw(svg) {
        svg.select("#star-" + this.id).remove();
        this.selected = false;
        this.draw(svg);
        this.makeInteractive(svg);
    }

    draw(svg) {

        svg.append("circle")
            .attr("class", "star")
            .attr("id", "star-" + this.id)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.r)
            .style("fill", this.color);

            

    }

    makeInteractive(svg) {
        svg.select("#star-" + this.id)
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget)
                    .attr("r", this.r * 2)
                    .style("fill", this.highlightColor);
            })
            .on("mouseout", (event, d) => {
                if (!this.selected) {
                    d3.select(event.currentTarget)
                        .attr("r", this.r)
                        .style("stroke-width", 0)
                        .style("fill", this.color);
                }
            })
            .on("click", (event, d) => {
                this.selected = (this.selected) ? false : true;
                if (this.selected) {
                    d3.select(event.currentTarget)
                        .style("stroke-width", 2);
                }
                else {
                    d3.select(event.currentTarget)
                        .style("stroke-width", 0);
                }

                return false;
            });
    }

    removeInteraction(svg) {

        this.selected = false;


        svg.select("#star-" + this.id)
            .attr("r", this.r)
            .style("fill", this.color)
            .style("cursor", "default")
            .on("mouseover", (event, d) => {
                return false;
            })
            .on("mouseout", (event, d) => {
                return false;
            })
            .on("click", (event, d) => {
                return false;
            });
    }

}
