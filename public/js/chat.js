const socket = io()
// socket.on('countUpdated',(count)=>{
//   console.log('The count has been updated',count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//  console.log('clicked')
//  socket.emit('increment',()=>{
//    socket.emit('countUpdated',count)
//  })
// })
const $messageForm = document.querySelector('#search')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationbutton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

socket.on('message',(search)=>{
  console.log(search)
const html = Mustache.render(messageTemplate,{
    message: search.text,
    createdAt: moment(search.createdAt).format('h:m A')
})
$messages.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(message)=>{
    const location = Mustache.render(locationTemplate,{
        location:message.url,
        createdAt: moment(message.createdAt).format('h:m A')
    })
$messages.insertAdjacentHTML('beforeend',location)
  })

$messageForm.addEventListener('click',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    socket.emit('submitMessages',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
           return console.log(error)
        }
        console.log('The message was delivered!')
    })
})

$locationbutton.addEventListener('click',()=>{
  if(!navigator.geolocation){
      return alert('Geolocation is supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
         $locationbutton.removeAttribute('disabled')
         console.log('location approved')
     })
  })
})

socket.emit('join',{username, room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}
})