import axios from "axios";
const  get =  async (params)=>{
    let {url,cbSuccess}=params;
     await axios.get(url)
    .then( json=>cbSuccess(json.data))
    .catch(err=>{
            // let message = err.statusText || "Ocurrió un error";
            // let root = document.getElementById("post")
            // root.innerHTML=`<div><p>${err.status}: ${err.statusText}</p></div>`
    
            // document.querySelector('.loader').style.display='none';
    
            // root.classList.add("error");
            // console.log(err);
        })
    .finally();
}

// eslint-disable-next-line import/no-anonymous-default-export
export default{
    get
}