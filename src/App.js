import React,{useEffect} from 'react';
import './App.css';
import Room from './Room';
import Header from './Header';
import Sidebar from './Sidebar';
import MainBodyContainer from './MainBodyContainer';
import { BrowserRouter as Router,Route, Switch } from "react-router-dom";
import SignInPage from './Reducer/SignInPage/SignInPage'
import SignUpPage from './SignUpPage/SignUpPage'
import {auth,db} from './Firebase/firebase'
import {useStateValue} from './StateProvider/stateProvider'
import Chart from './Chart'
function App() {
  const [user,dispatch] = useStateValue();
useEffect(() => {
  const unsubscrib= auth.onAuthStateChanged( (authUser) =>{
    if(authUser){
    
      
       dispatch({
         type:'SET_USER',
         authUser:authUser
       })
    }else{
       console.log("no user ");
    } 
  })
  return {
   unsubscrib

  }
}, [])
  return (
       <Router>
        <div>
        <Switch>
           
           <Route path="/login">
                  <h1>login page</h1>
                <SignInPage></SignInPage>
           </Route>
           <Route path ="/rigester">
             <SignUpPage></SignUpPage>
           </Route>
           <Route path="/:room" exact  component={Room}>
            
           </Route>
          <Route path="/">
       
              <div className="app">
                <Header></Header>
                <div className="app_container">
                   <Sidebar></Sidebar>
                   <MainBodyContainer></MainBodyContainer>
                </div>
               </div>

          
        
           </Route>
         </Switch>
        </div>

      </Router>
  );
}

export default App;
