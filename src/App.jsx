import './App.css'


import { useEffect, useState } from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate 
} from 'react-router-dom';

import SignIn from './components/SignIn';
import WorkerPage from './pages/WorkerPage';
import RoleSelect from './components/RoleSelect'
import ManagerPage from './pages/ManagerPage';
import ProtectedRoute from './routes/ProtectedRoute';
import TasksPage from './pages/TasksPage';
import SessionsPage from './pages/SessionsPage';

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

  //no role selected yet
  if (!role) {
    return <RoleSelect user={user} setRole={setRole} />;
  }

  return(
    <BrowserRouter>
      <Routes>

        {/*Login*/}
        <Route
          path="/"
          element={
            !user
            ? <SignIn />
            : <Navigate to={`/${role}`} />
          } 
        />

        {/*Worker*/}
        <Route 
          path="/worker"
          element={
            <ProtectedRoute 
              user={user}
              role={role}
              allowedRole="worker">
              <WorkerPage />
            </ProtectedRoute>
          }
        />

        {/*Manager*/}
        <Route 
          path="/manager"
          element={
            <ProtectedRoute 
              user={user}
              role={role}
              allowedRole="manager">
              <ManagerPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/tasks"
          element={
            <ProtectedRoute 
              user={user}
              role={role}
            >
              <TasksPage role={role} />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/sessions"
          element={
            <ProtectedRoute 
              user={user}
              role={role}
            >
              <SessionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}



export default App
