const users = []


const addUser = ({id, username, room})=>{
//clean the data
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()
//validation
if(!username || !room){
 return {
     error: 'Username and room are required'
 }
}
//check for existing user
const existingUser = users.find((user)=>{
  return user.room === room && username === username
})
//Validate username
if(existingUser){
    return {
        error:"Username is in use"
    }
}
// stored user
const user = {id, username, room}
users.push(user)
return { user }

}


const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id===id)
if(index !== -1){
 return users.splice(index,1)[0]
}
  
}

addUser({
    id:22,
    username:'Venkata',
    room:'101'
})
addUser({
    id:32,
    username:'loki',
    room:'101'
})

addUser({
    id:42,
    username:'thor',
    room:'101'
})

const getUser = (id)=>{
    
    return users.find((user)=>user.id === id)
    
}
const getUsersInRoom = (room) =>{
 return users.filter((user)=>user.room === room)
}


module.exports = {
     addUser,
     removeUser,
     getUser,
     getUsersInRoom
}