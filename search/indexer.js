
importPackage(java.io);

var rootPath = arguments[0];
var startPath=new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var fileList = filterDirectoryList(fileList, true, "html");
var searchIndex = indexFiles(fileList, rootPath);


serializeToDisk(searchIndex, "./search/searchindex.js");
serializeToDisk(searchIndex, rootPath + "/search/searchindex.js");

function indexFiles(fileList, rootPath){
	var searchIndex = [];
	for (var i = 1; i < fileList.length; i++){
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

function serializeToDisk(content, location){
	var fstream = new FileWriter(location);
	var out = new BufferedWriter(fstream);
	out.write(JSON.stringify(content));
	out.close();
}

function indexContentPage(filePath, rootPath){
	var fileContents = readFile(filePath);
	var resultSet = {};
	resultSet['url'] = String(createURLPath(filePath, rootPath));
	resultSet['title'] = String(grabBettwenTags(fileContents, "h1"));
	return resultSet;
}

function createURLPath(filePath, rootPath){
	return filePath.replace(rootPath, "");
}

function grabBettwenTags(html, tag){
	var tag = typeof tag !== 'undefined' ? tag : "p";
	var start = html.indexOf("<" + tag, html)  + tag.length + 2;
	var end = html.indexOf("</" + tag, start );
	return html.slice(start, end);
}

function directoryList(startPath){
	var fileObject=new File(startPath);
	var list = fileObject.list();
	var results = []; 

	for (var i=0; i<list.length; i++) {
	    var child = new File(startPath + "/" + list[i]);

	    if (child.isDirectory()){
	    	var recurseDirectoryListing = directoryList(child.getCanonicalPath());
	    	results = results.concat(recurseDirectoryListing);
	    }
	    else{
	    	var fileArray = {};
	    	fileArray['path'] = child.getCanonicalPath();
	    	fileArray['name'] = child.getName();
	    	fileArray['parent'] = child.getParent();
	    	fileArray['hidden'] = child.isHidden() ;
	    	fileArray['dir'] = child.isDirectory() ;
	    	var pos = fileArray['name'].lastIndexOf('.');
	    	if (pos < 0){
				fileArray['ext'] = '';
			}else{
				fileArray['ext'] = fileArray['name'].substring(pos+1);
			}	

	    	results.push(fileArray);
	    }
	    
	}
	return results;
}

function filterDirectoryList(directoryList, filesOnly, extension){

	var filesOnly = typeof filesOnly !== 'undefined' ? filesOnly : false;
  	var extension = typeof extension !== 'undefined' ? extension : '';

	var results = []; 

	for (var i=0; i<directoryList.length; i++) {
		var file = directoryList[i];

		if (filesOnly && file.dir){
			continue;
		}

		if (extension.length > 0 && (file.ext != extension)){
			continue;
		}

		results.push(file);
	}	
	return results;
}   

function displayDirectoryList(fileList){
	for (var i=0; i<fileList.length; i++) {
		print(fileList[i]['path'] ); 
	}
}
