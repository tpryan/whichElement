importPackage(java.io);
load("./rhino/lib.js");


var rootPath = arguments[0];
var startPath= new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var conceptList = filterDirectoryList(fileList, true, "html", "concepts/articles");
var elementList = filterDirectoryList(fileList, true, "html", "elements/tags");

conceptList.sort(sortByLastModifiedDesc);
elementList.sort(sortByLastModifiedDesc);


var conceptIndex = indexArticleFiles(conceptList, rootPath);
var conceptContent = createUpdateListHTML(conceptIndex, 7, 5);

var elementIndex = indexArticleFiles(elementList, rootPath);
var elementContent = createUpdateListHTML(elementIndex, 7, 5);


var templateFile = rootPath + "/indexTemplate.html";
var outputFile = rootPath + "/index.html";

replaceUpdateHTMLInFile(templateFile, outputFile, conceptContent, 'conceptlist');
replaceUpdateHTMLInFile(outputFile, outputFile, elementContent, 'elementlist');

function replaceUpdateHTMLInFile(inputFile, outputFile, contentToUpdate, idToTarget){

	
	var fileContents = readFile(inputFile);
	var targetText = '<ul class="optionlist" id="' + idToTarget + '">'
	var listStart = fileContents.indexOf(targetText) + String(targetText).length;
	var listEnd = fileContents.indexOf('</ul>', listStart);
	var oldContent = fileContents.substring(listStart,listEnd);
	var tabsString = repeat('\t', 6);
	var newFileContents = fileContents.replace(oldContent,contentToUpdate + tabsString);

	writeHTMLToDisk(newFileContents, outputFile);
}