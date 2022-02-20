
//-- variables --\\

const { BrowserWindow, app, Menu, dialog, globalShortcut } = require("electron")
let window
let filePath = null //currently opened file
let openFiles = []  //opened files



//-- startup --\\

app.whenReady().then(async function()
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
        icon: "./assets/icon.png",
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    //window.maximize()
    window.loadFile("./frontend/index.html")
    //window.webContents.openDevTools();
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
                }
            ]
        }
    ]))
}

async function promptFilePath()
{
    await dialog.showOpenDialog
    ({ properties: ["openFile"], filters: [{ name: 'Text', extensions: ["txt", "html", "js", "css"] }] }).then(function(res)
    {
        if(res.canceled) return
        filePath = res.filePaths[0]
        console.log(filePath)
    })
}

async function openFile()
{
    await promptFilePath()
    openFiles.push(filePath)
    console.log(filePath)
    window.webContents.send("crd-openFile", filePath)
}

function saveFile()
{
    console.log("save")
    if(filePath == null || undefined) return createFile()
    window.webContents.send("crd-saveFile", filePath)
}

function createFile()
{
    //window.webContents.send("crd-createFile")
    console.log("create")
}



//-- listeners --\\

app.on("window-all-closed", function()
{
    if(process.platform != "darwin") app.quit()
})
