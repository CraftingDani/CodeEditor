
//-- imports --\\

const { ipcRenderer } = require("electron")
const fs = require("fs")

const editorElem = document.querySelector("textarea.editor")



//-- functions --\\

function minimizeWindow()
{
    ipcRenderer.send("crd-minimizeWindow")
}

function toggleWindowSize()
{
    ipcRenderer.send("crd-toggleWindowSize")
}

function closeWindow()
{
    ipcRenderer.send("crd-closeWindow")
}



//-- listeners --\\

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

ipcRenderer.on("crd-resetEditor", function()
{
    editorElem.value = ""
})
