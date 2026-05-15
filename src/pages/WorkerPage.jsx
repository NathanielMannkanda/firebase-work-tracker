import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
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

function WorkerPage() {

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

        if (!querySnapshot) {
          const sessionDoc = querySnapshot.docs[0];

          setActiveSession({
            id: sessionDoc.id,
            ...sessionDoc.data()
          });
        }
      } catch (error) {
        console.log(error)
      };
    }

    checkActiveSession();
  }, []);

  //Clock in
  const handleClockIn = async () => {
    try {
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

    } catch (error) {
      console.log(error)
    }
  }

  //Clock out 
  const handleClockOut = async () => {
    try {
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

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <DashboardLayout title="Worker Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* STATUS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h3 className="text-lg font-semibold mb-4">
            Work Status
          </h3>

          {!activeSession ? (

            <div>

              <p className="text-gray-500 mb-4">
                You are currently off duty
              </p>

              <button
                onClick={handleClockIn}
                className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                Clock In
              </button>

            </div>

          ) : (

            <div>

              <p className="text-green-600 font-medium mb-4">
                Currently Working
              </p>

              <button
                onClick={handleClockOut}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Clock Out
              </button>

            </div>

          )}

        </div>

        {/* HOURS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Hours Today
          </h3>

          <p className="text-3xl font-bold">
            0.0h
          </p>

        </div>

        {/* TASKS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Active Tasks
          </h3>

          <p className="text-3xl font-bold">
            0
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default WorkerPage