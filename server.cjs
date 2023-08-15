var http = require("http");
const requestIp = require("@supercharge/request-ip");
var fs = require("fs");
var path = require("path");

http
  .createServer(function (request, response) {
    const ip = requestIp.getClientIp(request);
    console.log(`request: url=>${request.url}, ip=${ip}`);

    var filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    if (extname == "") {
      try {
        fs.access(filePath, fs.constants.R_OK);
        console.log("file " + filePath + " exists.");
      } catch {
        console.log("file " + filePath + " doesn't exist.");
        filePath += ".html";
        extname = ".html";
      }
    }
    var mimeTypes = {
      ".css": "text/css",
      ".eot": "application/vnd.ms-fontobject",
      ".gif": "image/gif",
      ".html": "text/html",
      ".jpg": "image/jpg",
      ".json": "application/json",
      ".js": "text/javascript",
      ".mjs": "text/javascript",
      ".mp4": "video/mp4",
      ".otf": "application/font-otf",
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".ttf": "application/font-ttf",
      ".wasm": "application/wasm",
      ".wav": "audio/wav",
      ".woff": "application/font-woff",
    };

    var contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(80);
console.log("Server running at http://127.0.0.1:80/");
