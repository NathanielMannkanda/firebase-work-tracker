import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import { firestore } from "../firebase/firebase";

import { 
  collection,
  onSnapshot
 } from "firebase/firestore";

function TasksPage() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = collection(
      firestore,
      "tasks"
    );

    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const taskList = [];

        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setTasks(taskList);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">
          All Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ): (
          tasks.map((task) => (
            <div className="bg-white p-5 rounded-2xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-gray-500 mt-1 break-word">
                    {task.description}
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className="text-sm">
                      Assigned To:
                      {" "}
                      <span className="font-medium">
                        {task.assignedToName}
                      </span>
                    </p>

                    <p>
                      Status:
                      {" "}

                      <span
                        className={
                          task.status === "completed"
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                        }>
                          {task.status}
                      </span>

                    </p>

                  </div>

                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </DashboardLayout>
  )
}

export default TasksPage;