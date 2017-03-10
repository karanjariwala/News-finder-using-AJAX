function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street');
    var $city = $('#city');
    var $background = $('#background');
    var $ul =$('#nytimes-articles')



    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    // load streetview
    var imgSrc = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + $street.val() + ',' + $city.val();
    console.log(imgSrc)
    $background.attr('src', imgSrc);
    $greeting.html('About '+ $city.val()+'  '+$street.val())
    // YOUR CODE GOES HERE!
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "e1e6e275f83f46a392db722e97983900",
        'fq': "news_desk:(\"Politics\") AND glocations:("+ $city.val()+")",
        'sort': "newest"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {
        //console.log(result.response.docs);
        let count=0;

        result.response.docs.map(function(value)
        {
            if( count<10)
            {

           $ul.append('<li class="article article-list">'+value.snippet+'<a href='+value.web_url+' target="_blank">'+'link'+'</a></li>');
           count++;
       }
        })

    }).fail(function(err) {
        $nytElem.text("sorry !");

        throw err;

    });
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wiki links")
    },8000)



    var wikiUrl= 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+$city.val()+'&prop=revisions&rvprop=content&format=json&callback=wikiCallback'
        $.ajax({
        url: wikiUrl,
        dataType:"JsonP"}).done( function(response)
        { console.log(response)

            var articleList =response[1];
            for(let i=0;i<articleList.length;i++)
            {                 var  articleStr =articleList[1];

               var url='https://en.wikipedia.org/wiki/'+articleStr;

           $wikiElem.append('<a class="article-list" href='+url+' target="_blank">'+articleStr+'</a></li>');

            }
            clearTimeout(wikiRequestTimeout)

        }

            )
    return false;
};



$('#form-container').submit(loadData);
