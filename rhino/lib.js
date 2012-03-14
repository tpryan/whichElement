importPackage(java.io);

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

function filterDirectoryList(directoryList, filesOnly, extension, folderToTarget){

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

		if (folderToTarget.length > 0 && file.path.indexOf(folderToTarget) < 0){
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

function displayIndexList(indexList){
	for (var i=0; i<indexList.length; i++) {
		print(indexList[i]['url'] );
		print(indexList[i]['title'] );
	}	 
}

function createURLPath(filePath, rootPath){
	var base = filePath.replace(rootPath, "");
	base = base.replace("index.html", "");
	base = base.replace("/tags/", "/");
	base = base.replace("/articles/", "/");

	return base;
}

function grabBettwenTags(html, tag){
	var tag = typeof tag !== 'undefined' ? tag : "p";
	var start = html.indexOf("<" + tag, html)  + tag.length + 2;
	var end = html.indexOf("</" + tag, start );
	return html.slice(start, end);
}

function indexContentPage(filePath, rootPath){
	var fileContents = readFile(filePath);
	var resultSet = {};
	resultSet['url'] = String(createURLPath(filePath, rootPath));
	resultSet['title'] = String(grabBettwenTags(fileContents, "h1"));
	resultSet['titleContents'] = resultSet['title'].replace(/<(?:.|\n)*?>/gm, '');
	resultSet['rawContents'] = String(fileContents).replace(/<(?:.|\n)*?>/gm, '');
	resultSet['summary'] = String(grabBettwenTags(fileContents, "p"));
	return resultSet;
}

function createListHTML(fileIndex, tabs){
	var tabs = typeof tabs !== 'undefined' ? tabs : 0;
	var tabsString = repeat('\t', tabs);

	var result = "\n";
	for (var i = 0; i < fileIndex.length; i++){
		var item = "";
		item += tabsString + '<li>';
		item += '<a href="' + fileIndex[i]['url'] + '">';
		item += fileIndex[i]['title'];
		item += '</a>';
		item += '</li>\n';
		result += item;
	}
	return result;
}

function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    };
    return result;
};

function indexArticleFiles(fileList, rootPath){
	var index = [];
	for (var i = 0; i < fileList.length; i++){
		var fileToRead = fileList[i]['path'];
		
		var badFilter = fileToRead.indexOf("/bad/")
		if (badFilter < 1){
			var resultSet = indexContentPage(fileToRead, rootPath);
			index.push(resultSet);
			
		}	
	}
	return index;
}

function writeHTMLToDisk(content, location){
	var prettyify = typeof prettyify !== 'undefined' ? prettyify : false;
	var fstream = new FileWriter(location);
	var out = new BufferedWriter(fstream);
	out.write(content);
	out.close();
}


function replaceHTMLInFile(inputFile, outputFile, contentToUpdate){

	
	var fileContents = readFile(inputFile);
	var listStart = fileContents.indexOf('<ul class="optionlist">') + String('<ul class="optionlist">').length;
	var listEnd = fileContents.indexOf('</ul>', listStart);
	var oldContent = fileContents.substring(listStart,listEnd);
	var tabsString = repeat('\t', 4);
	var newFileContents = fileContents.replace(oldContent,contentToUpdate + tabsString);

	writeHTMLToDisk(newFileContents, outputFile);
}



function sortByPathAsc(a,b){
	var pathA=a.path.toLowerCase();
	var pathB=b.path.toLowerCase();
	if (pathA < pathB){ 
		return -1 
	}
	if (pathA > pathB){
		return 1
	}
	return 0;
}