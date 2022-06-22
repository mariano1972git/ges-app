const proper = (str) =>{
    let ret=str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return ret
}
// eslint-disable-next-line import/no-anonymous-default-export
export default{
    proper
}
