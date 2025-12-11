import axios from "axios";
export const sendOtp= async (to:string,args:string[]):Promise<any> =>{
const data:{to:string; args:string[]; bodyId:number }={
    to,
    args,
    bodyId: Number(process.env.bodyId)
}
try {
    console.log(args);
    
    
    const response=await axios.post("https://console.melipayamak.com/api/send/shared/0bec87a729d24cb7b5f058fdf3721c91",
        data,
        {headers:{
            'Content-Type':'application/json',
          
        }}
        )
    return response.data
} catch (error) {
    throw error
}
}