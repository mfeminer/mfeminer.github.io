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
            let $readMore = $("<li/>").addClass("list-inline-item ml-auto")
                                      .append($("<a/>").addClass("u-link-v5 g-color-gray-dark-v4 g-color-primary--hover")
                                                       .attr("href", element.guid)
                                                       .attr("target", "_blank")
                                                       .html('Tamamını oku <i class="fa fa-share-square g-pos-rel g-top-1 g-mr-3"></i>'));

            $header.append($user);
            $header.append($time);

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