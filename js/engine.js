
/*
* folder should be in the form of /concepts/articles/, we get cranky if you forget trailing /
*
 */
function doRoute(folder) {

    var loc = window.location.href;
    console.log(loc);
    console.log(loc.indexOf("concepts/"));

    //if(loc.indexOf(folder+"/") == -1) location.href="../";
    //strip final / if there
    if(loc.substr(loc.length-1,1) == "/") loc = loc.substr(0,loc.length-1);
    var parts = loc.split("/");
    var target = parts[parts.length-1];
    console.log("Target: "+target);
    window.document.title = target + " "+window.document.title;
    $("#tagcrumb").text(target);
    $.ajax({
        url:folder+target+"/index.html",
        success:function(res,code) {
            $("#mainArticle").html(res);
            resizeFooter();
        },
        error:function(err) {
            //assume 404 and load in badtag.html, it better exist...
            $("#mainArticle").load(folder+"bad/index.html");
            $("#tagcrumb").text("unobtainium");
        }

    });

};