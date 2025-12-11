import  fs  from "fs";
import path from "path";
const modelPath=path.join(__dirname);
fs.readdirSync(modelPath).forEach((file)=>{
    if(file.endsWith(".model.js")||file.endsWith(".model.ts")){
        require(path.join(modelPath,file));
    }

})