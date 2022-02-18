//-- constants --\\

const {BrowserWindow, app, Menu} = require("electron")


//-- setup window --\\

app.whenReady().then(function()
{
    const window = new BrowserWindow
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

    Menu.setApplicationMenu(null)
    
    window.maximize()
    window.loadFile("./frontend/index.html")
})

app.on("window-all-closed", function()
{
    if(process.platform != "darwin") app.quit()
})
