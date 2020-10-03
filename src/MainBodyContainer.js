import './MainBodyContainer.css';
import {useHistory } from 'react-router-dom'
import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal';
import {db} from './Firebase/firebase'
import Peer from 'simple-peer'
import {useStateValue} from './StateProvider/stateProvider'
// const express = require('express');
// const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
function Body() {
const [state] = useStateValue();
const user = state?.user;
    const history = useHistory();
     const [modelControll, setmodelControll] = useState(false);
     const [roomid, setRoomid] = useState("");
    
     const startHoast = (e) => {
          e.preventDefault();
          setRoomid(uuidV4())
          setmodelControll(true)
     }
     const startMettingNow = (e) => {
          e.preventDefault();
       
          // db.collection("Rooms").doc(roomid).update({
          //      hoast_id:user.uid,
          //      user_id:[user.uid]
          // })
       
        if(roomid){
          setmodelControll(false);
          
          // io.on('connection',socket=>{
          //      socket.on('join-room',(roomId,userId)=>{
          //           console.log("room id is ",roomId);
          //           console.log("user id is ",userId);
          //      })
          // })
             history.push(roomid)
        }
          

     }
     return (
          <div className="body_container">

               <Modal
                    open={modelControll}

                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
               >
                    <div className="model_body">
                         
                         <p>room Id :{roomid}</p>
                         <div>
                         {/* {navigator.mediaDevices.getUserMedia({
               video:true,
               audio:true
          }).then(stream => (
               <video src={stream}></video>
          ))}
           */}
                         </div>
                         <button onClick={startMettingNow}>start meeting</button>
                    </div>
               </Modal>


               <div className="center_body_box">
                    <div className="center_box">
                         <div className="center_box_items">

                              <button onClick={startHoast} className="box_button">Host </button>
                              <button className="box_button">Join </button>

                         </div>
                    </div>
               </div>
          </div>
     )
}

export default Body
