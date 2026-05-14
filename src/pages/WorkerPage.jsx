import { useEffect, useState } from "react";
import { auth, firestore } from "../firebase/firebase";

import { 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc
 } from "firebase/firestore";

function WorkerPage(){

  const [activeSession, setActiveSession] = useState(null);

  const user = auth.currentUser;

  //check if worker is alr working/clocked in
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const sessionsRef = collection(firestore, "workSessions");

        const q = query(
          sessionsRef,
          where("userId", "==", user.uid),
          where("status", "==", "active")
        );
        const querySnapshot = await getDocs(q);

        if(!querySnapshot){
          const sessionDoc = querySnapshot.docs[0];

          setActiveSession({
            id: sessionDoc.id,
            ...sessionDoc.data()
          });
        }
      } catch(error){
        console.log(error)
      };
    }

    checkActiveSession();
  }, []);

  //Clock in
  const handleClockIn = async () => {
    try{
      const sessionData = {
        userId: user.uid,
        userName: user.displayName,
        status: "active",
        clockIn: new Date(),
        clockOut: null
      };

    const docRef = await addDoc(
      collection(firestore, "workSessions"),
      sessionData
    );

    setActiveSession({
      id: docRef.id,
      ...sessionData
    });

    }catch(error){
      console.log(error)
    }
  }

  //Clock out 
  const handleClockOut = async () => {
    try{
      const sessionRef = doc(
        firestore,
        "workSessions",
        activeSession.id
      );
      
      await updateDoc(sessionRef, {
        status: "completed",
        clockOut: new Date()
      });

      setActiveSession(null);

    }catch(error){
      console.log(error)
    }
  }
  return(
    <>
    <div>
      <h2>Worker Dashboard</h2>
      {!activeSession ? (

    
      <button onClick={handleClockIn}>
        Clock In
      </button>

      ) : (
      <div>
        <p>
          You are currently working
        </p>

        <button onClick={handleClockOut}>
          Clock Out
        </button>
      </div>
      )
      }
    </div>
    </>
  );
}

export default WorkerPage