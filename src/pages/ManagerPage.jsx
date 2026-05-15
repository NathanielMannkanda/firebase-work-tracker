import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { 
  collection,
  query,
  where,
  onSnapshot
 } from "firebase/firestore";

 function ManagerPage() {

  const [activeWorkers, setActiveWorkers] = useState([]);

  useEffect(() => {
    const sessionsRef = collection(
      firestore,
      "workSessions"
    );

    const q = query(
      sessionsRef,
      where("status", "==", "active")
    );

    //realtime listener

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workers = [];

      snapshot.forEach((doc) => {
        workers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setActiveWorkers(workers);
    });

    //cleanup listner
    return () => unsubscribe();
    
  },[]);

  return (
    <>
      <div>
        <h1>Manager Dashboard</h1>

        <h2>Currently Working</h2>

        {activeWorkers.length === 0 ? (
          <p>No workers clocked in</p>
        ) : (
          activeWorkers.map((worker) => (
            <div
              key={worker.id}
              className="border-gray-500 border p-2.5 mb-2.5">
                <h3>{worker.userName}</h3>

                <p>Status: {worker.status}</p>

                <p>
                  Clocked In:
                  {" "}
                  {new Date(
                    worker.clockIn.seconds * 1000
                  ).toLocaleTimeString()}
                </p>

            </div>
          ))
        )}
      </div>
    </>
  );
 }

 export default ManagerPage;