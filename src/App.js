import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth"
import firebaseConfig from './firebase.config';
  firebase.initializeApp(firebaseConfig)
function App() {
  const [user,setUser] = useState({
    isSignedIn : false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () =>{
      firebase.auth().signInWithPopup(provider)
      .then(res =>{
        const {displayName,photoURL,email} = res.user
        const signedInUser = {
          isSignedIn: true,
          name:displayName,
          email:email,
          photo:photoURL
        }
        setUser(signedInUser)
        // console.log(displayName,photoURL,email)
      })
      .catch(err =>{
        console.log(err)
        console.log(err.message)
      })
    }
    const handleSignOut = () =>{
      firebase.auth().signOut()
      .then(res =>{
        const signedOutUser = {isSignedIn:false,
          name:'',
          photo:'',
          email:'',
          password:"",
          error: '',
          isValid :false,
          existingUser:false

          
        }
        setUser(signedOutUser)
      })
      .catch(err => {

      })
    }
    const is_valid_email =  email => email.length < 256 && /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(email);
    const hasNumber = input => /\d/.test(input);
    const switchForm = e =>{
      const createdUser = {...user}
      createdUser.existingUser = e.target.checked;
      setUser(createdUser)
    }

    const handleChange = e =>{
      const newUserInfo = {
        ...user
      };
      //perform validation
      let isValid = true;
      if(e.target.name === 'email'){
        isValid=is_valid_email(e.target.value)
      }
      if(e.target.name === "password") {
        isValid = e.target.value.length>8 && hasNumber(e.target.value) ;
      }

      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = isValid
      setUser(newUserInfo)

      // console.log(e.target.name,e.target.value)
    }
    const createAccount = (event) =>{
      if(user.isValid){
        firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
        .then(res =>{
          console.log(res)
          const createUser = {...user};
          createUser.isSignedIn = true;
          createUser.error = ""
          setUser(createUser)
        })
        .catch(err =>{
          console.log(err.message)
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
      }
      
     event.preventDefault()
     event.target.reset()
    }
    const signInUser = event => {
      if(user.isValid){
        firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(res =>{
          console.log(res)
          const createUser = {...user};
          createUser.isSignedIn = true;
          createUser.error = ""
          setUser(createUser)
        })
        .catch(err =>{
          console.log(err.message)
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
      }
      event.preventDefault();
      event.target.reset()
    }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button> 
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome,{user.name}</p>
          <p>Your email:{user.email}</p>
          <img src={user.photo} alt=""/>
          </div>
      }
      <h1>Our Auth</h1>

      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning user</label>

      <form style={{display:user.existingUser ? 'block' :' none'}} onSubmit={signInUser}>
      <input type="text" onBlur = {handleChange} name="email" placeholder="Your Email" required/>
      <br/>
      <input  onBlur={handleChange} type="password" name ="password" placeholder = "Your Password" required />
      <br/>
      {/* <button onClick={createAccount}>Create Account</button> */}
      <input type="submit" value="signIn"/>
      </form>


      <form style={{display:user.existingUser ? 'none' :' block'}} onSubmit={createAccount}>
      <input type="text" onBlur = {handleChange} name="name" placeholder="Your name" required/>
      <br/>
      <input type="text" onBlur = {handleChange} name="email" placeholder="Your Email" required/>
      <br/>
      <input  onBlur={handleChange} type="password" name ="password" placeholder = "Your Password" required />
      <br/>
      {/* <button onClick={createAccount}>Create Account</button> */}
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style = {{color:'red'}}>{user.error}</p>
      }
    </div> 
  );
    }


export default App;
