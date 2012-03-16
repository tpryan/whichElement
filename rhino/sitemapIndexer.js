importPackage(java.io);
load("./rhino/lib.js");


var rootPath = arguments[0];
var mainsiteURL = arguments[1];
var startPath= new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var fileList = filterDirectoryListForSiteMap(fileList, true, "html", ["/templates/", "Template", "engine.html", "/bad/"]);
var fileIndex = indexFilesForSiteMap(fileList, rootPath);
var siteMap = createSiteMap(fileIndex, mainsiteURL);

var outputFile = rootPath + "/sitemap.xml";
writeHTMLToDisk(siteMap, outputFile);



function createSiteMap(fileIndex, siteURL){

	var results = '<?xml version="1.0" encoding="UTF-8"?>\n';
	results += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
	
	for (var i=0; i < fileIndex.length; i++){
		var entry = createURLEntry(fileIndex[i], siteURL);
		results += entry;
	}
	results += "</urlset>";
	return results;


}

function createURLEntry(fileIndex, siteURL){
	var date = new Date(fileIndex.lastModified);
	var formattedDate = date.getFullYear() + "-" + makeTwoChars(date.getMonth() + 1) + "-" + makeTwoChars(date.getDate());
	var depth = fileIndex.url.split("/").length-1;

	var priority = .5 - ((depth-3)/10 ); 

	var content = "";
	content += '	<url>\n';
    content += '		<loc>'+ siteURL + fileIndex.url +'</loc>\n';
    content += '		<lastmod>' + formattedDate + '</lastmod>\n';
    content += '		<changefreq>monthly</changefreq>\n';
    content += '		<priority>'+ priority +'</priority>\n';
    content += '	</url>\n';
	return content;
}

function filterDirectoryListForSiteMap(directoryList, filesOnly, extension, exclusionList){

	var filesOnly = typeof filesOnly !== 'undefined' ? filesOnly : false;
  	var extension = typeof extension !== 'undefined' ? extension : '';
  	var folderToTarget = typeof folderToTarget !== 'undefined' ? folderToTarget : '';

	var results = []; 

	for (var i=0; i<directoryList.length; i++) {
		var file = directoryList[i];

		if (filesOnly && file.dir){
			continue;
		}

		if (extension.length > 0 && (file.ext != extension)){
			continue;
		}

		if (exclusionList != null){
			var exclusionFound = false;
			for (var j=0; j<exclusionList.length; j++){
				if (file.path.indexOf(exclusionList[j]) >= 0){
					exclusionFound = true;
					break;
				}
			}
			if (exclusionFound){
				continue;
			}
		}
		


		results.push(file);
	}	
	return results;
}

function indexFilesForSiteMap(fileList, rootPath){
	var searchIndex = [];
	for (var i = 0; i < fileList.length; i++){
		var fileToRead = fileList[i]['path'];
		var resultSet = indexContentPage(fileToRead, rootPath);
		searchIndex.push(resultSet);
	}
	return searchIndex;
}