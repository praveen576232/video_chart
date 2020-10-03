import './Sidebaritem.css'
import React from 'react'

function Sidebaritem({title}) {
    return (
        <div  className="sidebar_item">
           
             <h4>{title}</h4>
        </div>
    )
}

export default Sidebaritem
