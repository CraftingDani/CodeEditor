
//-- variables --\\

const { BrowserWindow, app, Menu, dialog, ipcMain } = require("electron")
const fs = require("fs")
const path = require("path")
let window
let filePath = null //currently opened file



//-- startup --\\

app.whenReady().then(function()
{
    createWindow()
    createMenu()
})



//-- functions --\\

function createWindow()
{
    window = new BrowserWindow
    ({
        width: 1000,
        height: 600,
        frame: false,
        icon: "./assets/icon.png",
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    window.maximize()
    window.loadFile("./frontend/index.html")
    window.webContents.openDevTools()
}


function createMenu()
{
    Menu.setApplicationMenu(Menu.buildFromTemplate
    ([
        {
            label: "File",
            submenu:
            [
                {
                    label: "Save",
                    click: saveFile,
                    accelerator: "CmdOrCtrl+S"
                },
                {
                    label: "Open",
                    click: openFile,
                    accelerator: "CmdOrCtrl+O"
                },
                {
                    label: "New",
                    click: newFile,
                    accelerator: "CmdOrCtrl+N"
                }
            ]
        }
    ]))
}


async function promptFilePathOpen()
{
    await dialog.showOpenDialog
    ({ properties: ["openFile"] }).then(function(res)
    {
        if(res.canceled) return
        filePath = res.filePaths[0]
    })
}


async function promptFilePathSave()
{
    await dialog.showSaveDialog().then(function(res)
    {
        if(res.canceled) return
        filePath = res.filePath
    })
}


async function openFile()
{
    await promptFilePathOpen()
    window.webContents.send("crd-openFile", filePath)
}


async function saveFile()
{
    if(filePath == null || undefined) await promptFilePathSave()
    window.webContents.send("crd-saveFile", filePath)
}


async function newFile()
{
    filePath = null
    await promptFilePathSave()
    window.webContents.send("crd-resetEditor")
    window.webContents.send("crd-saveFile", filePath)
}



//-- listeners --\\

app.on("window-all-closed", function()
{
    if(process.platform != "darwin") app.quit()
})


ipcMain.on("crd-minimizeWindow", function()
{
    window.minimize()
})


ipcMain.on("crd-toggleWindowSize", function()
{
    window.isMaximized() ? window.unmaximize() : window.maximize()
})


ipcMain.on("crd-closeWindow", function()
{
    window.close()
})


ipcMain.on("crd-fileChange", function(_, pathInput)
{
    filePath = pathInput
})


ipcMain.on("crd-saveFile", function()
{
    if(filePath != null) saveFile()
})





//-- TODOs --\\

//Syntax highlighting
//Bugs
//  remove eventlisteners (.openFiles a)
//  select remaining files when 1 was closed
