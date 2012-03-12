importPackage(java.io);
load("./rhino/lib.js");


var rootPath = arguments[0];
var startPath= new File(rootPath);
var fileList = directoryList(startPath.getCanonicalPath());
var fileList = filterDirectoryList(fileList, true, "html", "elements/tags");

var fileIndex = indexArticleFiles(fileList, rootPath);
var conceptHTML = createListHTML(fileIndex, 5);
var templateFile = rootPath + "/elements/indexTemplate.html";
var outputFile = rootPath + "/elements/index.html";

replaceHTMLInFile(templateFile, outputFile, conceptHTML);
