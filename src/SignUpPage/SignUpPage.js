import React,{useState} from 'react'
import { useHistory} from 'react-router-dom'
import firebase from 'firebase'
import { auth } from '../Firebase/firebase'
function SignUpPage() {
    const [email ,setemail]= useState('');
const [password,setpassword] = useState('')
const [username,setusername] = useState('')
const [Conformpassword,setConformpassword] = useState('')
const history = useHistory();
const createUsers =(e)=>{
    if(email && password && username && Conformpassword){
        if(password === Conformpassword){
             auth.createUserWithEmailAndPassword(email,password)
             .then(user =>{
                 user.user.updateProfile({
                    displayName:username  
                 }).then(()=>{
                     history.push('/')
                 }).catch(error => {
                     alert(error.message)
                 })
             }).catch(error => {alert(error.message)})
        }
    }
}
const SignInWithGoogle = () =>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(()=>{
        history.push('/')
    }).catch(error => {
        alert(error.message)
    })
    
}
    return (
        <div className="signuppage__component" >
           
            <div className="signuppage__component__sign_up_with_email">
            <input placeholder="enter a email" value={email} onChange={(e)=>setemail(e.target.value)}></input>
            <input placeholder="user name" alue={username} onChange={(e)=>setusername(e.target.value)}></input>
            <input placeholder="enter a password" value={password} onChange={(e)=>setpassword(e.target.value)}></input>
            <input  placeholder="enter a conform password" alue={Conformpassword} onChange={(e)=>setConformpassword(e.target.value)}></input>
            <button onClick={createUsers}>Sign in</button>
            {/* <p onClick={createUsers} className="signuppage__component_new_users">New Users? create Acount</p> */}
            </div>
            <div className="signuppage__component_google">
                           <button onClick={SignInWithGoogle}>Sign in with google</button>
            </div>
        </div>
    )
}

export default SignUpPage
