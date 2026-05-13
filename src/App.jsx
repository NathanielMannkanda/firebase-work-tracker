import './App.css'


import { useEffect, useState } from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

import SignIn from './components/SignIn';
import WorkerPage from './pages/WorkerPage';
import RoleSelect from './components/RoleSelect'


function App() {

  const [user] = useAuthState(auth);

  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {

      if (!user) {
        setRole(null);
        setLoadingRole(false);
        return;
      } try {
        //refers to user doc
        const userRef = doc(firestore, "users", user.uid);

        //fetch doc
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()){
          //get role field
          setRole(userSnap.data().role);
        }
      } catch (error){
        console.log(error)
      }

      setLoadingRole(false);
    };

    fetchRole();

  }, [user]);

  //if user isnt signed in
  if (!user) {
    return <SignIn />;
  }

  //load database
  if (loadingRole) {
    return <div>Loading...</div>
  }

  //when a role isnt selected
  if (!role) {
    return <RoleSelect user={user} setRole={setRole} />
  }

  //Load Worker Page
  if (role === "worker"){
    return <WorkerPage />
  }

  //Load Manager Page
  if (role === "manager") {
    return <div>Manager Dashbpard</div>
  }

  return <div>Something went wrong</div>; 
  /*(
    <>
      <div className='App'>
        <header>
          <h1 className='text-2xl'>Work Tracker</h1>
        </header>

        <section>
          {user ? <WorkerPage /> : <SignIn />}
        </section>

      </div>
    </>
  )*/
}



export default App
