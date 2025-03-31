const { app, BrowserWindow } = require("electron")
const path = require("node:path")

function createWindow () {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
	})

	mainWindow.loadFile("index.html")
}

app.on("ready", function () {
	createWindow()
})

app.on("window-all-closed", function () {
	app.quit()
})
