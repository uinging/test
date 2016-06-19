var bm = null,
    // topFolder = null,
    singleFolder = null;

var fs = require("fs")

// function getJson(url){
//     var json;
//     $.ajax({
//         type: "get",
//         url: url,
//         // data: data,
//         async: false,
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         success: function(data){
//             json = data;
//             // console.log("data", data);
//         },
//         error: function(msg){
//             alert("error");
//         }
//     });
//     return json;
// }

// bm = getJson("./Bookmarks.json");
// // topFolder = bm.roots;
// singleFolder = getJson("./singleFolder.json");


function handleFolder (folder) {
    if(folder.type !== "folder") return;

    var children = folder.children;
    if(children.length) {
        uniqueChildren(children);
    }
}

function uniqueChildren(arr){
    arr.forEach(function(item, index, arr){
        // console.log("item",item);
        if(item.type == "url") {
            // 书签去重
            for(var i = index + 1, len = arr.length; i < len; i++) {
                // console.log("arr[i]",arr[i]);
                if(arr[i].type == "url") {
                    if(item.url === arr[i].url) {
                        arr.splice(i,1);
                        i--;
                        len--;
                    }
                }
            }
        } else if(item.type == "folder") {
            // 先文件夹去重
            for(var i = index + 1, len = arr.length; i < len; i++) {
                if(arr[i].type == "folder") {
                    if(item.name === arr[i].name) {
                        item.children = item.children.concat(arr[i].children);
                        arr.splice(i,1);
                        i--;
                        len--;
                    }
                }
            }
            // 再处理文件夹
            handleFolder(item);
        }
        
    })
}

// handleFolder(singleFolder);

function handleBookmark(bm) {
    var roots = bm.roots;

    for(var i in roots) {
        if(roots[i].type == "folder") {
            console.log("before : " + i + ".length", roots[i].children.length);
            handleFolder(roots[i]);
            console.log("after : " + i + ".length", roots[i].children.length);
        }
    }
}





fs.readFile("Bookmarks.json",{encoding:'utf8'}, function(err, data){

    bm = JSON.parse(data);
    console.log(typeof data);
    console.log(typeof bm);
    // console.log("readJsonData: ", data);

    handleBookmark(bm);

    // console.log("bm.roots.bookmark_bar.children.length " +  bm.roots.bookmark_bar.children.length);
    // console.log("bm",bm);
    // for(var i in bm) {
    //     console.log(i);
    // }
    
    console.log(typeof bm);

    var newFilename = "new-bookmark";

    fs.writeFile(newFilename, JSON.stringify(bm), {encoding: 'utf8'}, function(err){
        if(err) throw err;
        console.log(newFilename + " 生成成功!");
    });
})

// console.log("bm",bm);
// console.log("singleFolder.len",singleFolder.children.length);
// console.log("topFolder.len",topFolder.children.length);





// handleFolder(topFolder);

// console.log("singleFolder.len",singleFolder.children.length);
// console.log("singleFolder",singleFolder);
// console.log("topFolder",topFolder);