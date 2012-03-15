importPackage(java.io);
load("./rhino/lib.js");


var rootPath = arguments[0];
var mainsiteURL = arguments[1];
var startPath= new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var conceptList = filterDirectoryList(fileList, true, "html", "concepts/articles");
var elementList = filterDirectoryList(fileList, true, "html", "elements/tags");

var articleList = conceptList.concat(elementList);
articleList.sort(sortByLastModifiedDesc);


var articleIndex = indexArticleFiles(articleList, rootPath);


//displayIndexList(articleIndex);

var feedContent = createAtomFile(articleIndex, mainsiteURL);

var outputFile = rootPath + "/atom.xml";
writeHTMLToDisk(feedContent, outputFile);

function createAtomFile(fileIndex, siteURL){
	var results = createAtomHeader(fileIndex[0], siteURL);

	for (var i=0; i < fileIndex.length; i++){
		var entry = createAtomEntry(fileIndex[i], siteURL);
		results += entry;
	}
	results += "</feed>";
	return results;
}

function createAtomHeader(latestfileIndex, siteURL){
	var content = "";
	content += '<?xml version="1.0" encoding="utf-8"?>\n';
 
	content += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
 
    content += '    <title>whichElement</title>\n';
    content += '    <subtitle>Should that be a div, a span, or something else?</subtitle>\n';
    content += '    <link href="' + siteURL + '/atom.xml" rel="self" />\n';
    content += '    <link href="' + siteURL + '/" />\n';
    content += '    <id>'+ siteURL + '/' +  '</id>\n';
    content += '    <updated>' + formatDateForAtom(latestfileIndex.lastModified) + '</updated>\n';
    content += '    <author>\n';
    content += '           <name>whichElement.com</name>\n';
    content += '           <email>issues@whichElement.com</email>\n';
    content += '   	</author>\n';
	return content;
}

function createAtomEntry(fileIndex, siteURL){
	var title = fileIndex.title.replace("<code>", "");
	title = title.replace("</code>", "");

	var summary = fileIndex.summary.replace("<code>", "");
	summary = summary.replace("</code>", "");

	var content = "";
	content += '	<entry>\n';
    content += '		<title>' + title + '</title>\n';
    content += '		<link href="'+ siteURL + fileIndex.url +'" />\n';
    content += '		<id>'+ makeAtomIDFromURL(fileIndex.url, siteURL, fileIndex.lastModified) +'</id>\n';
    content += '		<updated>' + formatDateForAtom(fileIndex.lastModified) + '</updated>\n';
    content += '		<summary>' + summary + '</summary>\n';
    content += '		<content><![CDATA[' + fileIndex.contents + ']]></content>\n';
    content += '	</entry>\n';
	return content;
}


function makeTwoChars(number){
	var numberString = String(number);
	if (numberString.length == 1){
		numberString = String("0") + numberString;
	};
	return numberString
}

function formatDateForAtom(date){
	var dateObj = new Date(date);

	var result  = dateObj.getFullYear() + "-" + makeTwoChars(dateObj.getMonth() + 1) + "-" + makeTwoChars(dateObj.getDate());
	result += "T";
	result +=  makeTwoChars(dateObj.getHours()) + ":" + makeTwoChars(dateObj.getMinutes()) + ":" + makeTwoChars(dateObj.getSeconds());
	result += "Z";
	return result;
}

// from http://web.archive.org/web/20110514113830/http://diveintomark.org/archives/2004/05/28/howto-atom-id
function makeAtomIDFromURL(localurl, siteURL, date){
	var dateObj = new Date(date);
	var result = "tag:" + siteURL.replace("http://", "");
	result += "," + dateObj.getFullYear() + "-" + makeTwoChars(dateObj.getMonth() + 1) + "-" + makeTwoChars(dateObj.getDate());
	result += ":" + localurl;
	return result
}
