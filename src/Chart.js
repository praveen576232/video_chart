import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
function Chart({ match }) {
    const roomId = match.params.room;
    const SocketRef = useRef();
    const users = useRef([])
    useEffect(() => {
        SocketRef.current = io.connect("http://localhost:3030",{transports:['websocket'],upgrade:false});
                 SocketRef.current.emit("join-room", roomId);


           SocketRef.current.on("user-connected", userid => {   
               users.current.push(userid)
              console.log("user is connetced - > " ,userid );
           })




//             SocketRef.current.on('recivecall', callerData => {
                
               
//                 const checkPeerExists = usePeerRef.current.find(p => p.id === callerData.from )
//                 if(!checkPeerExists){
//                     const peer =  reciveCall(callerData,stream)
//                     console.log("in reciing caller id is ",callerData.from + " reciver id is ",SocketRef.current.id);
//                    usePeerRef.current.push({
//                        id:callerData.from,
//                        peer:peer
//                    });
//                    setpeers(users => [...users,peer]);
//                }
//                })

//             SocketRef.current.on('callrecived', signal => {
//                 const mypeer = usePeerRef.current.find( p => p.id === signal.from)
//                if(mypeer){
//                    mypeer.peer.signal(signal.data);
//                    setsnakbarmessage({
//                        open:true,
//                        msg:`${mypeer.id} is join the metting`
//                    });
                  
//                }
//             });

//         //     SocketRef.current.on('hoast-disconcted',hoastId =>{
//         //         usePeerRef.current.map( user =>{
//         //             if(!user.peer.destroyed){
//         //                 user.peer.destroy();
//         //             }
//         //         })
//         //         sethoastDisconnctedModel({
//         //             open:true,
//         //             msg:`${hoastId} is  disconnected `
//         //         });
                
//         // //  var timeout=     setInterval(()=>{
//         // //           if(time < 0)
//         // //            {
//         // //             clearInterval(timeout);
//         // //             history.push('/')
//         // //            }
//         // //           setTime(time--)
//         // //       },1000)
              
//           //  })
//         })

        
    }, [])
    return (
        <div>
            {
                users.current.map( user =>(
                <h3>{user}</h3>
                ))
            }
        </div>
    )
}

export default Chart
