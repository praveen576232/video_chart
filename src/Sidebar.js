import './Sidebar.css';
import React from 'react'
import Sidebaritem from './Sidebaritem';
//  import EventIcon from '@material-ui/icons/Event';
import Avatar from '@material-ui/core/Avatar'
//import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {useHistory } from 'react-router-dom'
import {useStateValue} from './StateProvider/stateProvider'
function Sidebar() {
    const [state]=useStateValue();
    const user =state?.user;
    const history = useHistory();
    
    return (
        <div className="sidebar">
              <div className="profile_image">
                        <Avatar className="avator_image" ></Avatar>
                        <p>{user?user.displayName:'you are not login!'}</p>
              </div>
              <div className="sildebar_list">
                        <Sidebaritem title="Profile" ></Sidebaritem>
                         <Sidebaritem title="Upcoming Meeting"></Sidebaritem>
                         <Sidebaritem title="Previce Meeting"></Sidebaritem>

              </div>
        </div>
    )
}

export default Sidebar
