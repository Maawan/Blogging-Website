module.exports = getId;
function getId(s){
    id = ""
    for(let i = 0 ; i < s.length ; i++){
        if(s[i] == ' '){
          id = id + '-';
        }else{
          id = id + s[i];
        }
    }
    id = id.toLowerCase();
    return id
}