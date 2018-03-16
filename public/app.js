$(document).ready(function () {


// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $("#articles").prepend("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
//     }
// });


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function () {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//     })
//         // With that done, add the note information to the page
//         .then(function (data) {
//             console.log(data);
//             // The title of the article
//             $("#notes").prepend("<h2>" + data.title + "</h2>");
//             // An input to enter a new title
//             $("#notes").prepend("<input id='titleinput' name='title' >");
//             // A textarea to add a new note body
//             $("#notes").prepend("<textarea id='bodyinput' name='body'></textarea>");
//             // A button to submit a new note, with the id of the article saved to it
//             $("#notes").prepend("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a note in the article
//             if (data.note) {
//                 // Place the title of the note in the title input
//                 $("#titleinput").val(data.note.title);
//                 // Place the body of the note in the body textarea
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function () {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             // Value taken from title input
//             title: $("#titleinput").val(),
//             // Value taken from note textarea
//             body: $("#bodyinput").val()
//         }
//     })
//         // With that done
//         .then(function (data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });


/* gloabl  */

    // Setting a reference to the article-container div where all the dynamic content will go
    // Adding event listeners to any dynamically generated "save article"
    // and "scrape new article" buttons
    var message = "You scraped new articles";
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    // Once the page is ready, run the startPage function to kick things off
    startPage();

    function startPage() {
        // Empty the article container, run an AJAX request for any unsaved headlines
        articleContainer.empty();
        $.get("/articles?saved=false").then(function (data) {
            // If we have headlines, render them to the page
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                // Otherwise render a message explaing we have no articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        // This function handles prepending HTML containing our article data to the page
        // We are passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all of the HTML for the articles stored in our articlePanels array,
        // prepend them to the articlePanels container
        articleContainer.prepend(articlePanels);
    }

    function createPanel(article) {
        // This functiont takes in a single JSON object for an article/headline
        // It constructs a jQuery element containing all of the formatted HTML for the
        // article panel
        var panel = $(
            [
                "<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                "<a class='article-link' target='_blank' href='" + article.link + "'>",
                article.title,
                "</a>",
                "<a class='btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                "<h4>",
                article.summary,
                "</h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        // We attach the article's id to the jQuery element
        // We will use this when trying to figure out which article the user wants to save
        panel.data("_id", article._id);
        // We return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        // This function renders some HTML to the page explaining we don't have any articles to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        // prepending this data to the page
        articleContainer.prepend(emptyAlert);
    }

    function handleArticleSave() {
        // This function is triggered when the user wants to save an article
        // When we rendered the article initially, we attatched a javascript object containing the headline id
        // to the element using the .data method. Here we retrieve that.
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        // Using a patch method to be semantic since this is an update to an existing record in our collection
        $.ajax({
            method: "PUT",
            url: "/api/headlines",
            data: articleToSave
        }).then(function (data) {
            // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
            // (which casts to 'true')
            if (data.ok) {
                // Run the startPage function again. This will reload the entire list of articles
                startPage();
            }
        });
    }

    function handleArticleScrape() {
        // This function handles the user clicking any "scrape new article" buttons
        $.get("/scrape").then(function (data) {
            // If we are able to succesfully scrape the NYTIMES and compare the articles to those
            // already in our collection, re render the articles on the page
            // and let the user know how many unique articles we were able to save
            startPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + message + "<h3>");
        });
    }
});
