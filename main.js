function main() {

    //graphics globals
    var fps = 30;
    var refresh = 1000.0 / fps;
    var speed = 250.0;
    var timeMultiplier = speed / 1000.0;
    var svg;

    //entity globals
    var comets = [];
    var starContainer = {stars: []}; //allows stars to be passed by reference to comet
    var cometID = 0;
    var starID = 0;
    var selectedStarID = -1;

    init();
    setInterval(draw, refresh);

    function init() {
        initCanvas();
        initHTML();
    }

    function initHTML() {

        $("#btn-clearComets").on("click", function () {
            comets = [];
            cometID = 0;
        });

        $("#btn-clearStars").on("click", function () {
            starContainer.stars = [];
            starID = 0;
            selectedStarID = -1;
            svg.selectAll("circle.star").remove();
        });

        $(".btn-cursor").on("click", function () {

            $(".btn-cursor").removeClass("rounded-outline");
            $(this).addClass("rounded-outline");

            switch ($(this).attr("id")) {
                case "btn-createComet":
                    svg.on('click', createComet);
                    $("#txt-mass").parent().hide();
                    $("#txt-color").parent().show();
                    $("#mass-hint").hide();
                    starContainer.stars.forEach((s) => s.removeInteraction(svg));
                    break;
                case "btn-createStar":
                    svg.on('click', createStar);
                    $("#txt-mass").parent().show();
                    $("#txt-color").parent().hide();
                    $("#mass-hint").hide();
                    starContainer.stars.forEach((s) => s.removeInteraction(svg));
                    break;
                case "btn-selectStar":

                    svg.on('click', function () {
                        return 0;
                    })
                    $("#txt-mass").parent().show();
                    $("#txt-color").parent().hide();
                    $("#mass-hint").show();
                    starContainer.stars.forEach((s) => s.makeInteractive(svg));
                    $("#txt-mass").on("change", function () {

                        let mass = parseFloat($("#txt-mass").val());
                        starContainer.stars.forEach((s) => {
                            if (s.selected) { s.setMass(mass); s.redraw(svg);}
                        });

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

        comets.push(new Comet(cometID++, getSystemTime(), width / 4.0, height / 4.0, $('#txt-color').val(), starContainer));
        starContainer.stars.push(new Star(starID++, width/2.8, height/2.7, 1));
        starContainer.stars.push(new Star(starID++, width/1.8, height/1.8, 3));

        starContainer.stars.forEach(s => s.draw(svg));

        svg.on('click', createComet);
    }

    function draw() {

        let time = getSystemTime();
        comets.forEach(c => c.timestep(time));

        svg.selectAll("circle.comet").remove();

        comets.forEach(c => c.draw(svg));
        
    }

    function createComet(e) {
        var coords = d3.pointer(e);
        comets.push(new Comet(cometID++, getSystemTime(), coords[0], coords[1], $('#txt-color').val(), starContainer));
        comets[comets.length - 1].draw(svg);

    }

    function createStar(e) {
        var coords = d3.pointer(e);
        starContainer.stars.push(new Star(starID++, coords[0], coords[1], $('#txt-mass').val()));
        starContainer.stars[starContainer.stars.length - 1].draw(svg);
        
    }

    function getSystemTime(){
        return Date.now() * timeMultiplier;
    }

}

