// import { db } from '../Firebase/firebase';

// import firebase from 'firebase';
export const intialState ={
   user:null,
   id:null
};
function reducer (state,action){
    console.log(action);
    switch (action.type) {
        case 'SET_USER':
         
            
            return {
                ...state,
                user:action.authUser,
                id:'uuuuuuuu'
            }
             
    
        default:
            return state;
    }
  
}
export default reducer;