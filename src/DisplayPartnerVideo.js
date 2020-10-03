import React,{useEffect,useRef} from 'react'
import './DisplayPartnerVideo.css'
function DisplayPartnerVideo({peer}) {
    const pvideo = useRef()
    useEffect(() => {
       peer.on('stream',stream =>{
           pvideo.current.srcObject=stream;
          
       })
       peer.on('close',()=>{
           console.log("connection closed by ",peer)
       })
    }, [])
    return (
        <div className="partnerVideo">
           <div className="videoDiv">
           <video playsInline ref={pvideo} autoPlay></video>
           </div>
        </div>
    )
}

export default DisplayPartnerVideo
