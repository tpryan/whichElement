importPackage(java.io);
load("./rhino/lib.js");

var rootPath = arguments[0];
var startPath= new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var fileList = filterDirectoryList(fileList, true, "html");
var searchIndex = indexFiles(fileList, rootPath);


serializeToDisk(searchIndex, "./search/searchindex.js", true);
serializeToDisk(searchIndex, rootPath + "/search/searchindex.js");

function indexFiles(fileList, rootPath){
	var searchIndex = [];
	for (var i = 0; i < fileList.length; i++){
		var fileToRead = fileList[i]['path'];
		
		var contentFilter = fileToRead.indexOf("/articles/") + fileToRead.indexOf("/tags/");
		var badFilter = fileToRead.indexOf("/bad/")
		if (contentFilter > 0 && badFilter < 1){
			var resultSet = indexContentPage(fileToRead, rootPath);
			searchIndex.push(resultSet);
			
		}	
	}
	return searchIndex;
}

function serializeToDisk(content, location, prettyify){
	var prettyify = typeof prettyify !== 'undefined' ? prettyify : false;
	var fstream = new FileWriter(location);
	var out = new BufferedWriter(fstream);
	if (prettyify){
		out.write(JSON.stringify(content, null, 3));
	}
	else{
		out.write(JSON.stringify(content));
	}
	
	
	out.close();
}



