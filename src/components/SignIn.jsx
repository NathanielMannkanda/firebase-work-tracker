import { auth, firestore } from '../firebase/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

import { 
  doc,
  setDoc,
  getDoc,
  serverTimestamp
 } from 'firebase/firestore';
import { useState } from 'react';

function SignIn(){
  const [email, setEmail] = useState("");
  const [passowrd, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isLogin, setIsLogin] = useState(true);

  //to catch errors
  const  [error, setError] = useState("")

  const provider = new GoogleAuthProvider();

  //Google sign in
  const handleGoogleSignIn = async () => {
    try{
      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      const userRef = doc(
        firestore,
        "users",
        user.uid
      );

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: null,
          createdAt: serverTimestamp
        });
      }

    }catch(error){
      console.log(error)
    }

  };

  //Email Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    try{
      //Login
      if (isLogin){   
        await signInWithEmailAndPassword(
          auth,
          email,
          passowrd
        );
      } else {
        //sign up
        const result =
          await createUserWithEmailAndPassword(
            auth,
            email,
            passowrd
          );
        
          await updateProfile(
            result.user,
            {
              displayName: name
            }
          );

          await setDoc(
            doc(
              firestore,
              "users",
              result.user.uid
            ),
            {
              name,
              email,
              role: null,
              createdAt: serverTimestamp()
            }
          );
      }
    }catch(error){
      if (error.code === "auth/invalid-credential") {
        setError(
          "This account was created with Google Sign-In. Please continue with Google."
        );

      } else if (error.code === "auth/email-already-in-use") {

        setError("Email already in use.");

      } else if (error.code === "auth/wrong-password") {

        setError("Incorrect password.");

      } else if (error.code === "auth/user-not-found") {

        setError("No account found.");

      } else {

        setError("Something went wrong.");
      }

      setTimeout(() => {
        setError("");
      }, 3000);

      console.log(error);
    }
  };

  return(
    <>
      {error && (
        <div className='fixed top-6 right-6 bg-red-500/10 border border-red-500 text-red-400 px-5 py-4 rounded-2xl shadow-2xl backdrop-bl ur-md fade-in z-50'>
          {error}
        </div>
      )}
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
        
      <div className='w-full max-w-md bg-[#1c1c1e] border border-gray-800 rounded-3xl p-8 shadow-2xl'>
        <h1 className='text-4xl font-bold text-white mb-2'>
          Work Tracker
        </h1>

        <p className='text-gray-400 mb-8'>
          Manage workers, sessions and tasks
        </p>

        <form 
          onSubmit={handleEmailAuth}
          className='space-y-4'
        >
          {!isLogin && (
            <input 
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={(e) => 
                setName(e.target.value)
              }
              className='w-full bg-[#2c2c2e] text-white rounded-2xl p-4 border border-gray-700 outline-none'
            />
          )}

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => 
              setEmail(e.target.value)
            } 
            className="w-full bg-[#2c2c2e] text-white rounded-2xl p-4 border border-gray-700 outline-none"
          />

          <input
            type='password'
            placeholder='Password'
            value={passowrd}
            onChange={(e) => 
              setPassword(e.target.value)
            } 
            className="w-full bg-[#2c2c2e] text-white rounded-2xl p-4 border border-gray-700 outline-none"
          />

          <button
            type='submit'
            className='w-full bg-[#ff9f0a] hover:opacity-90 text-black font-semibold py-4 rounded-2xl transition cursor-pointer'
          >
            {isLogin
              ? "Sign In"
              : "Create Account"
            }
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">

            <div className="flex-1 h-px bg-gray-800"></div>

            <p className="text-gray-500 text-sm">
              OR
            </p>

            <div className="flex-1 h-px bg-gray-800"></div>

          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Continue with Google
          </button>

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="w-full mt-6 text-sm text-gray-400 hover:text-white transition"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
            
        </div>
        
      </div>
    </>
  );

}

export default SignIn;