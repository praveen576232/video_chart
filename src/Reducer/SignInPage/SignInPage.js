import React,{useState} from 'react'
import { db,auth  } from '../../Firebase/firebase'
import { useHistory} from 'react-router-dom'
import firebase from 'firebase'
function SignInPage() {
const [email ,setemail]= useState('');
const [password,setpassword] = useState('')
const history = useHistory()
    const createUsers = (e)=>{
      history.push('rigester')
    }
    const Sigin = (e) =>{
        e.preventDefault();
        if(email && password){
        auth.signInWithEmailAndPassword(email,password)
        .then(() => {
            
            history.push("/") 
        }).catch(error => {alert(error.message)})
    
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
        <div className="signinpage__component" >
           
            <div className="signinpage__component__sign_in_with_email">
            <input placeholder="enter a email" value={email} onChange={(e)=>setemail(e.target.value)}></input>
            {/* <input placeholder="user name"></input> */}
            <input placeholder="enter a password" value={password} onChange={(e)=>setpassword(e.target.value)}></input>
            {/* <input  placeholder="enter a conform password"></input> */}
            <button onClick={Sigin}>Sign in</button>
            <p onClick={createUsers} className="signinpage__component_new_users">New Users? create Acount</p>
            </div>
            <div className="signinpage__component_google">
                           <button onClick={SignInWithGoogle}>Sign in with google</button>
            </div>
        </div>
    )
}

export default SignInPage
