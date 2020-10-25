function main() {

    //graphics globals
    var fps = 30;
    var refresh = 1000 / fps;
    var speed = 1.0;
    var svg;

    //entity globals
    var comets = [];
    var stars = [];
    var cometID = 0;
    var starID = 0;
    var selectedStarID = -1;

    init();
    draw();
    //setInterval(draw, refresh);

    function init() {
        initCanvas();
        initHTML();
    }

    function initHTML() {

        $("#btn-clearComets").on("click", function () {
            comets = [];
        });

        $("#btn-clearStars").on("click", function () {
            stars = [];
            svg.selectAll("circle.star").remove();
        });

        $(".btn-cursor").on("click", function () {

            $(".btn-cursor").removeClass("rounded-outline");
            $(this).addClass("rounded-outline");

            switch ($(this).attr("id")) {
                case "btn-createComet":
                    svg.on('click', createComet);
                    $("#txt-mass").parent().addClass("hidden");
                    $("#txt-color").parent().removeClass("hidden");
                    break;
                case "btn-createStar":
                    svg.on('click', createStar);
                    $("#txt-mass").parent().removeClass("hidden");
                    $("#txt-color").parent().addClass("hidden");
                    break;
                case "btn-selectStar":
                    addStarClick();
                    svg.on('click', function () {
                        return 0;
                    })
                    $("#txt-mass").parent().removeClass("hidden");
                    $("#txt-color").parent().addClass("hidden");

                    $("#txt-mass").on("change", function () {
                        stars[selectedStarID].setMass(parseInt($("#txt-mass").val()));
                        $("#star-" + selectedStarID).attr("r", stars[selectedStarID].r);

                    });
                    break;
                default:
                    console.log("cursor button not supported");
            }
        })

        $(window).on("resize", function () {
            svg.attr("width", $(window).width())
                .attr("height", $(window).height());
        })

    }

    function initCanvas() {
        //Width and height
        var width = $(window).width();
        var height = $(window).height();
        //Create SVG element
        svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        comets.push(new Comet(cometID++, Date.now()/1000.0, 75, 75, "#ab2567", stars));
        stars.push(new Star(starID++, 300, 200, 1));
        stars.push(new Star(starID++, 400, 275, 2));

        stars.forEach(s => s.draw(svg));

        svg.on('click', createComet);
    }

    function draw() {

        let time = Date.now() / 1000.0;
        comets.forEach(c => c.timestep(time));

        svg.selectAll("circle.comet").remove();

        comets.forEach(c => c.draw(svg));
        
    }

    function createComet(e) {
        var coords = d3.pointer(e);
        comets.push(new Comet(cometID++, Date.now() / 1000.0, coords[0], coords[1], $('#txt-color').val(), stars));
        comets[comets.length - 1].draw(svg);

    }

    function createStar(e) {
        var coords = d3.pointer(e);
        stars.push(new Star(starID++, coords[0], coords[1], $('#txt-mass').val()));
        stars[stars.length - 1].draw(svg);
        
    }

    function addStarClick() {
        svg.selectAll("circle.star")
            .data(stars)
            .on("click", function (d) {
                $("#txt-mass").parent().removeClass("hidden");
                $("#txt-color").parent().addClass("hidden");
                $("#txt-mass").val(d.mass * 5);
                selectedStarID = d.id;
                d3.select(".star").style("stroke", "white");
                d3.select("#star-" + d.id).style("stroke", "black").style("stoke-width", "10px");
            })
    }


    // Create Event Handlers for mouse
    /*function handleMouseOver(d, i) {  // Add interactivity

      // Use D3 to select element, change color and size
      d3.select(this).attr({
        fill: "orange",
        r: d.r * 2
      });

    }

    function handleMouseOut(d, i) {
      // Use D3 to select element, change color back to normal
      d3.select(this).attr({
        fill: "black",
        r: d.r / 2
      });

    }*/
}

