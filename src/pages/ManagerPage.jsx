import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { 
  collection,
  query,
  where,
  onSnapshot
 } from "firebase/firestore";
 import DashboardLayout from "../components/layout/DashboardLayout";
 import TaskForm from "../components/TaskForm";

 function ManagerPage() {

  const [activeWorkers, setActiveWorkers] = useState([]);
  const [workers, setWorkers] = useState([]);
  
  // realtimelistner useEffect
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

  //worker useEffect
  useEffect(() => {
    const fetchWorkers = async() => {
      const usersRef = collection(
        firestore,
        "users"
      );

      const q = query(
        usersRef,
        where("role", "==", "worker")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const workerList = [];

        snapshot.forEach((doc) => {

          workerList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setWorkers(workerList);
      });

      return unsubscribe;
    };

    fetchWorkers();
  }, []);

  return (
    <DashboardLayout title="Manager Dashboard">

    <div className="space-y-8">

      <TaskForm workers={workers}/>

      {/* ALL WORKERS */}
      <div>

        <h2 className="text-2xl font-bold mb-4">
          All Workers
        </h2>

        {workers.length === 0 ? (

          <p>No workers found</p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {workers.map((worker) => (

              <div
                key={worker.id}
                className="bg-white p-6 rounded-2xl shadow-sm border w-fit"
              >

                <h3 className="text-lg font-semibold">
                  {worker.name}
                </h3>

                <p className="text-gray-500">
                  {worker.email}
                </p>

                <p className="mt-2 text-sm">
                  Role: {worker.role}
                </p>

              </div>
            ))}

          </div>

        )}

      </div>

      {/* ACTIVE WORKERS */}
      <div>

        <h2 className="text-2xl font-bold mb-4">
          Currently Working
        </h2>

        {activeWorkers.length === 0 ? (

          <p>No workers clocked in</p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {activeWorkers.map((worker) => (

              <div
                key={worker.id}
                className="bg-white p-6 rounded-2xl shadow-sm border w-fit hover:shadow-md transition"
              >

                <h3 className="text-lg font-semibold">
                  {worker.userName}
                </h3>

                <p className="text-green-600 font-medium">
                  {worker.status}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Clocked In:
                  {" "}
                  {new Date(
                    worker.clockIn.seconds * 1000
                  ).toLocaleTimeString()}
                </p>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>

  </DashboardLayout>
  );
 }

 export default ManagerPage;