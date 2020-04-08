$(() => {
    let rssFeed = "https://medium.com/feed/@mfeminer";
    getFeed(rssFeed);
});

let getFeed = url => {

    let apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURI(url);
    $.get(apiUrl, gotFeed);
};

let gotFeed = response => {
    console.log(response);
    let $content = $("#blog-content");

    if(response.status == "ok") {
        $("#avatar-image").attr("src", response.feed.image);
        $("#feed-title").text(response.feed.title);
        $("#feed-url").attr("href", response.feed.link);
        $("#feed-rss").attr("href", response.feed.url);

        response.items.forEach(element => {
            let $col = $("<div/>").addClass("col-12");
            let $media = $("<div/>").addClass("media g-mb-30 media-comment");
            let $avatar = $("<img/>").addClass('d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15')
                                     .attr("src", response.feed.image);

            let $mediaBody = $("<div/>").addClass("media-body u-shadow-v18 g-bg-secondary g-pa-30");
            let $header = $("<div/>").addClass("g-mb-15");
            let $user = $("<h5/>").addClass("h5 g-color-gray-dark-v1 mb-0").text(element.author);
            let $time = $("<span/>").addClass("g-color-gray-dark-v4 g-font-size-12").text(element.pubDate);
            let $itemContent = $("<p/>").addClass("font-medium").text(element.title);
            let $footer = $("<ul/>").addClass("list-inline d-sm-flex my-0 font-medium");
            // let $claps = $("<li/>").addClass("list-inline-item g-mr-20 g-color-gray-dark-v4 g-color-primary--hover")
            //                        .html('<i class="fa fa-thumbs-up g-pos-rel g-top-1 g-mr-3"></i>' + element.claps);
            let $readMore = $("<li/>").addClass("list-inline-item ml-auto")
                                      .append($("<a/>").addClass("u-link-v5 g-color-gray-dark-v4 g-color-primary--hover")
                                                       .attr("href", element.guid)
                                                       .attr("target", "_blank")
                                                       .html('Tamamını oku <i class="fa fa-share-square g-pos-rel g-top-1 g-mr-3"></i>'));

            $header.append($user);
            $header.append($time);

            // $footer.append($claps);
            $footer.append($readMore);

            $mediaBody.append($header);
            $mediaBody.append($itemContent);
            $mediaBody.append($footer);
            $media.append($avatar);
            $media.append($mediaBody);
            $col.append($media);
            
            $content.append($col);
        });
    }
};

let extractContent = (html) => {
    return (new DOMParser).parseFromString(html, "text/html").documentElement.textContent;
}

// var mediumPromise = new Promise(function (resolve) {
//     var $content = $('#blog-content');
//     var data = {
//         rss: 'https://medium.com/feed/@mfeminer'
//     };

//     $.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40mfeminer', data, function (response) {
//                 if (response.status == 'ok') {
//                     $("#logo").append(`<img src="${response.feed["image"]}" class="rounded mx-auto d-block">`)
//                     var display = '';
//                     $.each(response.items, function (k, item) {
//                         display += `<div class="card mb-3 mx-auto mr-5 ">`;
//                         var src = item["thumbnail"]; // use thumbnail url
//                         display += `<img src="${src}" class="card-img-top" alt="Cover image">`;
//                         display += `<div class="card-body">`;
//                         display += `<h5 class="card-title"><a href="${item.link}" target="_blank">${item.title}</a></h5>`;
//                         var yourString = item.description.replace(/<img[^>]*>/g,""); //replace with your string.
//                         yourString = yourString.replace('h4', 'p');
//                         yourString = yourString.replace('h3', 'p');
//                         var maxLength = 120; // maximum number of characters to extract
//                         //trim the string to the maximum length
//                         var trimmedString = yourString.substr(0, maxLength);
//                         //re-trim if we are in the middle of a word
//                         trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
//                         display += `<p class="card-text">${trimmedString}...</p>`;

//                         display += `<a href="${item.link}" target="_blank" class="btn btn-outline-success" >Read More</a>`;
//                         display += '</div></div>';
//                         return k < 10;
//                     });

//                     resolve($content.html(display));
//                 }
//             });
//             });

// mediumPromise.then(function()
//             {
//                 //Pagination
//                 pageSize = 4;

//                 var pageCount = $(".card").length / pageSize;

//                 for (var i = 0; i < pageCount; i++) {
//                     $("#pagin").append(`<li class="page-item"><a class="page-link" href="#">${(i + 1)}</a></li> `);
//                 }
//                 $("#pagin li:nth-child(1)").addClass("active");
//                 showPage = function (page) {
//                     $(".card").hide();
//                     $(".card").each(function (n) {
//                         if (n >= pageSize * (page - 1) && n < pageSize * page)
//                             $(this).show();
//                     });
//                 }

//                 showPage(1);

//                 $("#pagin li").click(function () {
//                     $("#pagin li").removeClass("active");
//                     $(this).addClass("active");
//                     showPage(parseInt($(this).text()))
//                     return false;
//                 });
//             });
//         });
