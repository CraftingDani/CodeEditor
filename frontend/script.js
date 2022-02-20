const { ipcRenderer } = require("electron")
const fs = require("fs")

const editorElem = document.querySelector("textarea.editor")



ipcRenderer.on("crd-openFile", function(e, path)
{
    editorElem.value = fs.readFileSync(path, "utf-8")
})

ipcRenderer.on("crd-saveFile", function(e, path)
{
    fs.writeFile(path, editorElem.value , function(res, err)
    {
        if(err) throw err
    })
})
