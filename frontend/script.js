
//-- imports --\\

const { ipcRenderer } = require("electron")
const fs = require("fs")
const path = require("path")

const editorElem = document.querySelector(".editor")
const openFilesContainer = document.querySelector(".openFiles")
const openFiles = []  //opened files
let selectedFile = null



//-- startup --\\

setInterval(function() // fix editor height
{
    document.querySelector("body").style.height = innerHeight - 32 - 1 + "px"
}, 10)


editorElem.addEventListener("input", function()
{
    ipcRenderer.send("crd-saveFile")
})



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


function getFileName(pathInput)
{
    return path.basename(pathInput)
}


function removeSelectedClasses()
{
    document.querySelectorAll(".openFiles a").forEach(function(i)
    {
        i.classList.remove("selectedFile")
    })
}


function addFile(pathInput)
{
    const newFile = document.createElement("a")
    const newFileTitle = document.createElement("h2")
    const newRemoveFileBtn = document.createElement("button")

    newFileTitle.innerText = getFileName(pathInput)
    newRemoveFileBtn.innerHTML = "&times;"
    newFile.setAttribute("data-filePath", pathInput)

    removeSelectedClasses()
    newFile.classList.add("selectedFile")

    newFile.append(newFileTitle)
    newFile.append(newRemoveFileBtn)
    openFilesContainer.append(newFile)

    openFiles.push({ path: pathInput })
}


function updateFileListeners()
{
    document.querySelectorAll(".openFiles a").forEach(function(i) // files
    {
        i.removeEventListener("click", updateFileListeners)
        i.addEventListener("click", updateFileListeners)
        function updateFileListeners()
        {
            const path = i.getAttribute("data-filepath").replace("\\", "/")
            openFile(path)
            removeSelectedClasses()
            i.classList.add("selectedFile")
            ipcRenderer.send("crd-fileChange", path)
        }
    })

    document.querySelectorAll(".openFiles a button").forEach(function(i) // remove file btns
    {
        i.removeEventListener("click", updateRemoveFileListeners)
        i.addEventListener("click", updateRemoveFileListeners)
    })
}
function updateRemoveFileListeners(e)
{
    e.target.parentElement.remove()
}


function openFile(pathInput)
{
    editorElem.value = fs.readFileSync(pathInput, "utf-8")
    updateFileListeners()
}



//-- listeners --\\

ipcRenderer.on("crd-openFile", function(_, pathInput)
{
    addFile(pathInput)
    openFile(pathInput)
})


ipcRenderer.on("crd-saveFile", function(_, pathInput)
{
    fs.writeFile(pathInput, editorElem.value, function(err)
    {
        if(err) throw err
    })
})


ipcRenderer.on("crd-resetEditor", function()
{
    editorElem.value = ""
})
