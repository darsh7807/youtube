var searchResult={};

function paraToUrl(para){
    var url = 'https://www.googleapis.com/youtube/v3/search?';
    for(var key in para){
        url = url+key +'=' + para[key]+'&';
    }
    return url;
}

function creatlink(token,url,text){
    var button = document.createElement("button");
    var t = document.createTextNode(text);
    button.appendChild(t);
    button.classList.add("sortbutton");
    button.onclick = function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        search(token);
    };
    return button;
}

function updateNavigation(nexPageToken,prevPageToken,url){
    var navigation = document.getElementById("navigation");
    removeallchilds(navigation);

    if(prevPageToken){
        navigation.appendChild(creatlink(prevPageToken,url,'prev'));
    }
    if(nexPageToken){
        navigation.appendChild(creatlink(nexPageToken,url,'next'));
    }
    
}

function search(token){
    document.getElementById("sort").style.display= "block";
    var input = document.forms["myform"]["input"].value;
    var xhttp = new XMLHttpRequest();
    var para ={
        'part': 'snippet',
        'maxResults' :'10',
        'q':input,
        'key':APIKEY,
        'pageToken' : token,
    } 

    var url = paraToUrl(para);
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            result = this.responseText;
            searchResult = JSON.parse(result); 

            nexPageToken = searchResult.nextPageToken;
            prevPageToken = searchResult.prevPageToken;  

            showresult(searchResult.items);
            updateNavigation(nexPageToken,prevPageToken,url);
        }
    };
    return false;
}

function removeallchilds(ele){
    while(ele.firstChild){
        ele.removeChild(ele.firstChild);
    }
}


function sort(mode){
    result = searchResult;
    var items = result.items;

    items.sort(function(a,b){
        if(mode ==1){
            if(a.snippet.title == b.snippet.title) return 0;
            else return a.snippet.title > b.snippet.title ? 1: -1;
        }
        else if (mode==2){
            return new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt);
        }
    });
    showresult(items);
}


function showresult(items){
    var resultdiv = document.getElementById("demo");
    removeallchilds(resultdiv);

    for(var it in items){
        var chidldiv =  document.createElement("div");
        var videoId = items[it].id.videoId;
        
        chidldiv.innerHTML= '<div class="oneresult">\
                    <div class="col" align="left">\
                        <iframe width="70%" height="200"src="https://www.youtube.com/embed/'+videoId+'">\
                        </iframe>\
                    </div>\
                    <div align="left" class="col">\
                        <div class="content">\
                            <p class="title">'+ items[it].snippet.title+'</p>\
                            <p >'+new Date(items[it].snippet.publishedAt)+'</p>\
                            <div class="discription">\
                            <p>' + items[it].snippet.description+'\
                            </p>\
                        </div>\
                        </div>\
                    </div>\
                </div>';

        resultdiv.appendChild(chidldiv);
    }
}