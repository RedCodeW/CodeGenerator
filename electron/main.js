const { app, BrowserWindow, ipcMain, dialog ,Menu} = require('electron')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util');
const os = require('os');
const readdir = promisify(fs.readdir);

async function searchFile(folderPath){
  try {
    // 读取文件夹下的所有文件名称
    const files = await readdir(folderPath, { withFileTypes: true });
 
    // 过滤出文件（排除目录）并获取文件名
    const fileNames = files
      .filter(file => file.isFile())
      .map(file => folderPath+'/'+file.name);
    const dirs=files.filter(file=>file.isDirectory()).map(file=>folderPath+'/'+file.name+'/')
    const dirPromises = dirs.map(async dir => {
      const subFiles = await searchFile(dir);
      return subFiles; // 返回子目录中的文件列表
    });
    const subFileNames = await Promise.all(dirPromises);
    const allFileNames = fileNames.concat(...subFileNames);
    return allFileNames;
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }
}

// 显示文件夹选择对话框的函数
function showFolderSelector(callback) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      // 用户选择了一个文件夹
      const folderPath = result.filePaths[0];
      callback(folderPath);
    } else {
      // 用户取消了选择
      callback(null);
    }
  }).catch(err => {
    console.error('Error showing folder selector dialog:', err);
    callback(null);
  });
}

function generate(files){
  // 获取桌面路径
  const desktopPath = path.join(os.homedir(), 'Desktop');
  const outputFilePath = path.join(desktopPath, '源代码.txt');
  // 读取所有文件内容并写入到abc.txt中
  let fileContents = '';
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8'); // 使用同步方法读取文件内容
      fileContents +='// '+filePath.split('/').pop()+'\n'  + content + '\n'; // 在每个文件内容后添加换行符
    } catch (error) {
      console.error(`Error reading file at path ${filePath}:`, error);
    }
  });
    // 将合并后的内容写入到abc.txt文件中
    fs.writeFileSync(outputFilePath, fileContents, 'utf8');
}
Menu.setApplicationMenu(null)
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      
    }
  })
  // 下面的url为自己启动vite项目的url。
  win.loadFile('dist/index.html')
  // win.loadURL('http://localhost:5173/')
  win.setIcon('dist/image/generate.png')
  // 打开electron的开发者工具
  // win.webContents.openDevTools({ mode: 'detach' })

  ipcMain.handle('select-folder', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
  
    return result.canceled ? null : searchFile(result.filePaths[0])
    
    
  });
}

ipcMain.handle('generate',async(event,files)=>{
  data=JSON.parse(files)
  try{
    generate(data)
    return 'ok'
  }
  catch(err){
    return err
  }
})

app.on('ready', () => {
  createWindow(),
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// showFolderSelector((folderPath) => {
//     if (folderPath) {
//         console.log('Selected folder path:', folderPath);
//         // 在这里处理用户选择的文件夹路径
//     } else {
//         console.log('User canceled the folder selection.');
//     }
// });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
