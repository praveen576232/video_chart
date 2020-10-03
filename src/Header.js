import './Header.css';
import React from 'react'
import {useHistory} from 'react-router-dom'
import {auth} from './Firebase/firebase'
import { useStateValue } from './StateProvider/stateProvider'
function Header() {
    const [ state] = useStateValue();
    const history = useHistory();
    const user =state?.user; 
   
    const logout =()=>{
        if(user){
            auth.signOut();
        }else{
            history.push('login')
        }
    }
    return (
        <div className="header">
              <div className="header_img_logo">
                  <img src="https://banner2.cleanpng.com/20180423/qte/kisspng-zoom-video-communications-computer-icons-videotele-5addc45e4efbc5.8964293215244831663235.jpg" alt="video meeting logo">
                  </img>
              </div>
              <div className="right_header">
                  <p>Host meeting</p>
                  <p>Join meeting</p>
                  <p onClick={logout}>{user? 'Log out':'Log In'}</p>         </div>
        </div>
    )
}

export default Header