$(document).ready(function () {

    //Handle Scrape button
    $(".scrape-new").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            console.log(data)
            window.location = "/"
        })
    });

    // //Set clicked nav option to active
    // $(".navbar-nav li").click(function () {
    //     $(".navbar-nav li").removeClass("active");
    //     $(this).addClass("active");
    // });

    //Handle Save Article button
    $(".save").on("click", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/articles/save/" + thisId
        }).done(function (data) {
            window.location = "/"
        })
    });

    // Whenever someone clicks a p tag
    $(document).on("click", ".addNote", function () {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/save" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
        });

});
