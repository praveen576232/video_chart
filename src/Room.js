// import React,{useEffect,useRef} from 'react'
// import {db} from './Firebase/firebase'
// import Peer from 'simple-peer';
// import {useStateValue} from './StateProvider/stateProvider'
// function Room({match}) {
//     const roomId = match.params.room;
//     const PeersRef =useRef([]); 
//     const videoStream =useRef();
//     const displayMyStream = useRef();
//     const [state]=useStateValue();
//     useEffect(() => {
//         const user = state?.user;
       
        
//         navigator.mediaDevices.getUserMedia({
//             video:true,
//             audio:true
//         }).then( stream =>{
//             videoStream.current = stream;
//           displayMyStream.current.srcObject = stream;

//         //   pull my data to my database
       

//             db.collection("Rooms").doc(roomId).onSnapshot( snapshot =>{
//                 if(snapshot.exists){
//                        const hoast = snapshot.data().hoast_id;
//                        if(hoast){
//                               if(hoast === user.uid){
//                                 const peer = new Peer({
//                                     initiator:true,
//                                     trickle:false,
//                                     stream:videoStream.current
                        
//                                 });
//                                 peer.on('signal',data =>{
//                                 db.collection("Users").doc(user.uid).update({
//                                     data:data
//                                 })
//                                   })
//                               }else{
//                                 const peer = new Peer({
//                                     initiator:false,
//                                     trickle:false,
//                                     stream:videoStream.current
                        
//                                 });
//                                 peer.on('signal',data =>{
//                                 db.collection("Users").doc(user.uid).update({
//                                     data:data
//                                 }).then(()=>{
//                                        const users = snapshot.data().users;
//                                        if(users){
//                                           users.map( userID => {
//                                               db.collection("Users").doc(userID).onSnapshot(snap =>{
//                                                   if(snap){
//                                                     const callerData = snap.data().data;
//                                                     PeersRef.current.push()
//                                                   }else{
//                                                       console.log("no data in",userID);
//                                                   }
//                                               })
//                                           })
//                                        }else{
//                                            console.log("no users ");
//                                        }
//                                 }).catch(error =>{
//                                     alert(error.message)
//                                 })
//                             }) 
//                               }
//                        }else{
//                            alert("hoast is not thare in this meating")
//                        }





//                           var users = snapshot.data().users;
//                          if(users){
//                              users.map( user =>{
//                                  const peer = new Peer({
//                                      initiator:true,
//                                      trickle:false,
//                                      stream:videoStream.current
       
//                                  });
//                                  peer.on('signal',data =>{

//                                      db.collection("Rooms").doc(user).collection("request").add({
//                                          from:'from id',
//                                          data:data
//                                      })
//                                  })
//                              })
//                          }
//                 }else{
//                 // const peer = new Peer({
//                 //     initiator:true,
//                 //     trickle:false,
//                 //     stream:videoStream.current
//                 // })
//                 // peer.on('signal',data =>{

//                 //     db.collection("users").doc(user.uid).update({
//                 //               data:data
//                 //     })
//                 // })
//                 console.log("room is not thare");
//                 }
//             })
           
//         })
     
//     }, [])
//     return (
//         <div>
            
//         </div>
//     )
// }

// export default Room




































//socket faillur

import React, { useEffect, useRef, useState } from 'react'
import './Room.css'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import DisplayPartnerVideo from './DisplayPartnerVideo'
import { Modal } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar'
import {useHistory}  from 'react-router-dom'

function Room({ match }) {
    const roomId = match.params.room;
   
    const history = useHistory();
    const videoRef = useRef() 
    const userVideoStream = useRef()
   const usePeerRef = useRef([])
   const SocketRef = useRef();
   const [modelControll,setmodelControll]=useState(false);
const [time,setTime]=useState(5)
   const [hoast ,sethoast]=useState(null);
    const [allpeers,setpeers]=useState([])
    const [snakbarmessage, setsnakbarmessage]=useState({});
    //const socket=    io({transports: ['websocket']});
    const [VideoMute,setVideoMute]=useState(true);
    const [hoastDisconnctedModel,sethoastDisconnctedModel]=useState({
        open:false,
        msg:''
    })
    
    const   backToHome = ()=>{
        sethoastDisconnctedModel({open:false,msg:''}) ;
        history.push('/')
    }

    const muteVideo = ()=>{
        userVideoStream.current.getAudioTracks()[0].enabled=false;
       // setVideoMute(false);
    }
    const VideoMuteAndUnmute =() =>{
        userVideoStream.current.getVideoTracks()[0].enabled ? userVideoStream.current.getVideoTracks()[0].enabled = false :userVideoStream.current.getVideoTracks()[0].enabled=true;
    }
    const UnmuteVideo = () =>{
        userVideoStream.current.getAudioTracks()[0].enabled=true;
        // setVideoMute(true);
    }
    
    useEffect(() => {
        // const socket = io({
        //     transports: ['websocket'],
        //     upgrade: false
        //   });
        //   socket.io.opts.tr

        SocketRef.current = io.connect("http://localhost:3030",{transports:['websocket'],upgrade:false});
    //    console.log("socket     "+socket.io.opts.transports);
       console.log("server    "+ SocketRef.current.io.opts.transports);
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
           
        }).then(stream => {
          
     userVideoStream.current=stream;
         
         
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            SocketRef.current.emit("join-room", roomId);
            // SocketRef.current.on('hoast',hoast=>{
            //     console.log("you are the hoast ",hoast);
            //     sethoast(hoast);
            //     setmodelControll(false);
            // });

            // if(hoast === null){
            //     if(allpeers === null || allpeers?.length ===0){
            //         setmodelControll(true);
            //     }
            // }
            SocketRef.current.on("user-connected", userid => {   
               
                    const peer =     callUser(userid,stream);
                    usePeerRef.current.push({
                        id:userid,
                        peer:peer
                    })
                    setpeers(users => [...users,peer]);
                
            
            });
              
            
            // SocketRef.current.on("diconnect-user",userid =>{
            //         const findUser = usePeerRef.current.find( user => user.id === userid);
            //         if(findUser && !findUser.peer.destroyed ){
            //             setsnakbarmessage({
            //                 open:true,
            //                 msg:`${userid} is leave the metting`
            //             });
                      
            //             console.log(findUser.peer);
            //             console.log(findUser.peer.destroyed);
            //             findUser.peer.destroy();
                        
            //             usePeerRef.current= usePeerRef.current.filter( peerobj => peerobj.peer!==findUser.peer)
                       
                        
            //         }
            // });



            SocketRef.current.on('recivecall', callerData => {
                
               
                const checkPeerExists = usePeerRef.current.find(p => p.id === callerData.from )
                if(!checkPeerExists){
                    const peer =  reciveCall(callerData,stream)
                    console.log("in reciing caller id is ",callerData.from + " reciver id is ",SocketRef.current.id);
                   usePeerRef.current.push({
                       id:callerData.from,
                       peer:peer
                   });
                   setpeers(users => [...users,peer]);
               }
               })

            SocketRef.current.on('callrecived', signal => {
                const mypeer = usePeerRef.current.find( p => p.id === signal.from)
               if(mypeer){
                   mypeer.peer.signal(signal.data);
                   setsnakbarmessage({
                       open:true,
                       msg:`${mypeer.id} is join the metting`
                   });
                  
               }
            });

        //     SocketRef.current.on('hoast-disconcted',hoastId =>{
        //         usePeerRef.current.map( user =>{
        //             if(!user.peer.destroyed){
        //                 user.peer.destroy();
        //             }
        //         })
        //         sethoastDisconnctedModel({
        //             open:true,
        //             msg:`${hoastId} is  disconnected `
        //         });
                
        // //  var timeout=     setInterval(()=>{
        // //           if(time < 0)
        // //            {
        // //             clearInterval(timeout);
        // //             history.push('/')
        // //            }
        // //           setTime(time--)
        // //       },1000)
              
          //  })
        })

        
    }, [])

    function reciveCall(callerData,stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
           stream:stream
        });
  
       peer.on('error',(error)=>{
           if(error.code ==='ERR_WEBRTC_SUPPORT'){
             alert("your brouser is not supported please change your brouser")
           }else if(error.code === 'ERR_CREATE_OFFER'){
                      alert("error to create offer")
           }else if(error.code === 'ERR_CREATE_ANSWER'){
            alert("error to create answer")
           }else if(error.code === 'ERR_SET_LOCAL_DESCRIPTION'){
            alert("error to set local description")
           }else if(error.code === 'ERR_SET_REMOTE_DESCRIPTION' ){
            alert("error to set remote description")
           }else if(error.code ===' ERR_ADD_ICE_CANDIDATE'){
            alert("errorin ICE_CANDIDATE")
           }else if(error.code === 'ERR_ICE_CONNECTION_FAILURE'){
            alert("error ICE_CANDIDATE failure")
           }else if(error.code==='ERR_SIGNALING'){
            alert("errorin err signaling")
           }else if(error.code === 'ERR_DATA_CHANNEL'){
            alert("errorin data channel")
           }else if(error.code === 'ERR_CONNECTION_FAILURE'){
            alert("connection failure")
           }
       })
       
        peer.on("signal", data => {
           
            SocketRef.current.emit("oncallacepted", {
                from:SocketRef.current.id,
                to: callerData.from,
                data: data
            })
        })
               
        peer.signal(callerData.data)
        //  peer.on('connect',()=>{

        //      setmodelControll(false)
           
        //  })
        peer.on('data',data=>{
            console.log(data);
        })
   return peer;

    }

    function callUser(userId,stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
          stream:stream
        });
  
    
    peer.on('signal', data => {
               
                SocketRef.current.emit("calluser", {
                    from: SocketRef.current.id,
                    to: userId,
                    data: data
                })
            })
    peer.on('connect',()=>{
        peer.send("this is hoast")
    })     
            // peer.on('error',(error)=>{
            //     if(error.code ==='ERR_WEBRTC_SUPPORT'){
            //       alert("your brouser is not supported please change your brouser")
            //     }else if(error.code === 'ERR_CREATE_OFFER'){
            //                alert("error to create offer")
            //     }else if(error.code === 'ERR_CREATE_ANSWER'){
            //      alert("error to create answer")
            //     }else if(error.code === 'ERR_SET_LOCAL_DESCRIPTION'){
            //      alert("error to set local description")
            //     }else if(error.code === 'ERR_SET_REMOTE_DESCRIPTION' ){
            //      alert("error to set remote description")
            //     }else if(error.code ===' ERR_ADD_ICE_CANDIDATE'){
            //      alert("errorin ICE_CANDIDATE")
            //     }else if(error.code === 'ERR_ICE_CONNECTION_FAILURE'){
            //      alert("error ICE_CANDIDATE failure")
            //     }else if(error.code==='ERR_SIGNALING'){
            //      alert("errorin err signaling")
            //     }else if(error.code === 'ERR_DATA_CHANNEL'){
            //      alert("errorin data channel")
            //     }else if(error.code === 'ERR_CONNECTION_FAILURE'){
            //      alert("connection failure")
            //     }
            // })   
            
  return peer;
 
    }


function screenShare(){
    navigator.mediaDevices.getDisplayMedia({cursor:true})
    .then(stream =>{
       
        userVideoStream.current.getVideoTracks()[0].enabled=false;
        console.log( userVideoStream.current.getVideoTracks()[0].enabled);
        videoRef.current.srcObject = stream;
      
    usePeerRef.current.map( peeer =>{
       
        peeer.peer.replaceTrack(userVideoStream.current.getVideoTracks()[0], stream.getTracks()[0],userVideoStream.current)
    });
        
        stream.oninactive=() =>{
            console.log("screen record endend")
            console.log( userVideoStream.current.getVideoTracks()[0].enabled);
            userVideoStream.current.getVideoTracks()[0].enabled=true;
            videoRef.current.srcObject =  userVideoStream.current;
            console.log( userVideoStream.current.getVideoTracks()[0].enabled);
           if(usePeerRef.current){
            usePeerRef.current.map( peeer =>{
       
                peeer.peer.replaceTrack(stream.getTracks()[0], userVideoStream.current.getVideoTracks()[0],userVideoStream.current)
            })
           }
        }
    })
   
}
  

    return (
        <div className="room">
            <h2>welcome to my room</h2>
                
            <h2>{match.params.room}</h2>
            <button onClick={muteVideo}>muteVideo</button>
            <button onClick={UnmuteVideo}>UNmuteVideo</button>
            <button onClick={VideoMuteAndUnmute}>Video</button>
            {/* <div> 
            <Snackbar
                 message={snakbarmessage.msg}
                 open={snakbarmessage.open}
                 onClose={()=>setsnakbarmessage({msg:snakbarmessage.msg,open:false})}
                 autoHideDuration={4000}
                 ></Snackbar>
            </div> */}
            <button onClick={screenShare}>ScreenShare</button>
            <Modal
                    open={hoastDisconnctedModel.open}

                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
               >
                    <div className="model_body_with_loding_indicator">
                         <h1>{`${hoastDisconnctedModel.msg} back to home in ${time} seconds`} </h1>
                        <button onClick={backToHome}>Back To Home</button>
                    </div>
               </Modal>
            <div className="wating_for_hoast_model">
            {/* <Modal
                    open={modelControll}

                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
               >
                    <div className="model_body_with_loding_indicator">
                         <h1>watting for  host...</h1>
                         <CircularProgress
                          thickness={4.5}
                          variant='indeterminate'
                          color="primary"
                         >

                         </CircularProgress>
                    </div>
               </Modal> */}
            </div>
            <div className="video_container">
              
                 
                
                       <div className="myvideo">
                                <video  playsInline muted autoPlay ref={videoRef}> </video>
                              
                        </div>
                
              {
                  allpeers.map((partner,index)=>{

                         return (
                             <DisplayPartnerVideo key={index} peer ={partner}></DisplayPartnerVideo>
                         )
                  })
              }
             
                    
                      
                   


            </div>
        </div>
    )
}




//copy example
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import DisplayPartnerVideo from './DisplayPartnerVideo'


// const Room = (props) => {
//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const userVideo = useRef();
//     const peersRef = useRef([]);
//     const roomID = props.match.params.roomID;

//     useEffect(() => {
//         socketRef.current = io.connect("/");
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
//             userVideo.current.srcObject = stream;
//             socketRef.current.emit("join room", roomID);
//             socketRef.current.on("all users", users => {
//                 const peers = [];
//                 users.forEach(userID => {
//                     const peer = createPeer(userID, socketRef.current.id, stream);
//                     peersRef.current.push({
//                         peerID: userID,
//                         peer,
//                     })
//                     peers.push(peer);
//                 })
//                 setPeers(peers);
//             })

//             socketRef.current.on("user joined", payload => {
//                 const item = peersRef.current.find(p => p.peerID === payload.callerID);
//                 if(!item) {
//                   const peer = addPeer(payload.signal, payload.callerID, stream);
//                   peersRef.current.push({
//                     peerID: payload.callerID,
//                     peer,
//                   })
//                   setPeers(users => [...users, peer]);
//                 }
//             });

//             socketRef.current.on("receiving returned signal", payload => {
//                 const item = peersRef.current.find(p => p.peerID === payload.id);
//                 item.peer.signal(payload.signal);
//             });
//         })
//     }, []);

//     function createPeer(userToSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
//         })

//         return peer;
//     }

//     function addPeer(incomingSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         })

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID })
//         })

//         peer.signal(incomingSignal);

//         return peer;
//     }

//     return (
//         <div>
            
//             <video playsInline muted autoPlay ref={userVideo}> </video>
//             {peers.map((peer, index) => {
//                 return (
//                     <DisplayPartnerVideo key={index} peer={peer} />
//                 );
//             })}
//         </div>
         
//     );
// };

// export default Room;


//copy end




// actual webrtc code

// import React,{useRef,useEffect} from 'react';
// import io from 'socket.io-client';

// function Room({ match }) {
// const userVideo = useRef();
// const partnerVideo = useRef();
// const peerRef = useRef();
// const socketRef = useRef();
// const otherUsers = useRef();
// const userStream = useRef();


// useEffect(() => {
    
//     navigator.mediaDevices.getUserMedia({audio:true,video:true})
//     .then(stream =>{
//         userVideo.current.srcObject = stream;
//         userStream.current = stream;
    
//          socketRef.current = io.connect("/");
//          socketRef.current.emit("join-room", match.params.room);

//          socketRef.current.on("user-connected", userId =>{
//              callUser(userId);
//              otherUsers.current = userId;

//          })

//          socketRef.current.on("offer",handelCallRecivingOffer);

//          socketRef.current.on("answer",handelAnswer);

//          socketRef.current.on("ice-candidate",handelIceCandidateMessage);
//     })
   
// }, [])

// function callUser(userId){
//     peerRef.current = createPeer(userId);
//     userStream.current.getTracks().forEach( track => peerRef.current.addTrack(track,userStream.current))
// }

// function createPeer(userId){
//     const peer = new RTCPeerConnection({
//           iceServers:[
//               {
//                   urls: "stun:stun.stunprotocol.org"
//               },
//               {
//                   urls:'turn:numb.viagenie.ca',
//                   credential:'muazkh',
//                   username:'webrtc@live.com'
//               },
//           ]
//     });

//     peer.onicecandidate =handelIceCandidateEvent;
//     peer.ontrack = handelTrackEvent;
//     peer.onnegotiationneeded = () => handelNegotionNeededEvent(userId);
//     return peer;
   

// }


// function handelNegotionNeededEvent(userId){
//     peerRef.current.createOffer().then(offer => {
//         return peerRef.current.setLocalDescription(offer);
//     }).then(() => {
//         const payload ={
//             target : userId,
//             caller : socketRef.current.id,
//             sdp: peerRef.current.localDescription
//         };
//         socketRef.current.emit("offer",payload);

//     }).catch((e)=>alert(e.message))
// }

// function handelCallRecivingOffer(incoming){
//     peerRef.current = createPeer();
//     const desc = new RTCSessionDescription(incoming.sdp);
//     peerRef.current.setRemoteDescription(desc)
//     .then(()=>{
//         userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track,userStream.current));
//     }).then(()=>{
//         return peerRef.current.createAnswer();
//     }).then(answer => {
//         return peerRef.current.setLocalDescription(answer)
//     }).then(()=>{
//         const payload ={
//             target : incoming.caller,
//             caller:socketRef.current.id,
//             sdp:peerRef.current.localDescription
//         }
//         socketRef.current.emit("answer",payload)
//     })
// }

//  function handelAnswer(message){
//      const desc = new RTCSessionDescription(message.sdp);
//      peerRef.current.setRemoteDescription(desc).catch((e)=>{alert(e.message)});
//  }


// function handelIceCandidateEvent(e){
//        if(e.candidate){
//            const payload = {
//                target:otherUsers.current,
//                candidate:e.candidate,
//            }
//            socketRef.current.emit("ice-candidate",payload)
//        }
// }


// function handelIceCandidateMessage(incomming){
//     const candidate = new RTCIceCandidate(incomming);
//     peerRef.current.addIceCandidate(candidate)
//     .catch((e)=>{alert(e.message)})
// }

// function handelTrackEvent(e){
//     partnerVideo.current.srcObject = e.streams[0];
// }

//     return (
//         <div>
//             <video muted style={ {height: 500,width:500}} ref={userVideo} autoPlay></video>
//             <video style={ {height: 500,width:500}} ref={partnerVideo} autoPlay></video>
//         </div>
//     )
// }

 export default Room
