
importPackage(java.io);

var startPath=new File('./');
var fileList = listDirectory(startPath.getCanonicalPath());
fileList = filterDirectoryList(fileList, true, "html");
displayDirectoryList(fileList);

// TODO: Codeout pseudo code.
// Read in all file contents
	//loop through files
		//read file contents
		//extract title
		//extract excerpts
		//calculate url
		//write to json string
		//concat to json file



function listDirectory(startPath){
	var fileObject=new File(startPath);
	var list = fileObject.list();
	var results = []; 

	for (var i=0; i<list.length; i++) {
	    var child = new File(startPath + "/" + list[i]);

	    if (child.isDirectory()){
	    	var recurseDirectoryListing = listDirectory(child.getCanonicalPath());
	    	results = results.concat(recurseDirectoryListing);
	    }
	    else{
	    	var fileArray = [];
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

	filesOnly = typeof filesOnly !== 'undefined' ? filesOnly : false;
  	extension = typeof extension !== 'undefined' ? extension : '';

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
