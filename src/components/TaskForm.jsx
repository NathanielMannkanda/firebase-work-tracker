import { useState  } from "react";

import { 
  collection,
  addDoc,
  serverTimestamp
 } from "firebase/firestore";

import { firestore } from "../firebase/firebase";

function TaskForm({ workers }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  //for popup
  const [showPopup, setShowPopup] = useState(false);
  const [assignedWorkerName, setAssignedWorkerName] = useState("");

  const handleCreateTask = async (e) => {

    e.preventDefault();

    if (!selectedWorker){
      alert("please select a worker");
      return;
    }

    const workData = workers.find(
      (worker) => worker.id === selectedWorker
    );

    try {
      await addDoc(
        collection(firestore, "tasks"),
        {
          title,
          description,
          assignedTo: selectedWorker,
          assignedToName: workData.name,
          status: "pending",
          clearedByWorker:false,
          createdAt: serverTimestamp()
        }
      );

      setAssignedWorkerName(workData.name);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      setTitle("");
      setDescription("");
      setSelectedWorker("");

    }catch(error){
      console.log(error);
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-6 right-6 bg-[#1c1c1c] text-white px-6 py-4 rounded-2xl z-50 animate-fade">
          Task assigned to{" "}
          <span className="font-bold">
            {assignedWorkerName}
          </span>
        </div>
      )}
      <form
      onSubmit={handleCreateTask}
      className="bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-800 min-w-100 max-w-300 text-white"
      >
        <h2 className="text-2xl font-bold mb-6">
          Create Task
        </h2>

        <div className="space-y-4">

          <input 
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-800  rounded-xl p-3"
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-800 rounded-xl p-3 h-28"
          />

          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-full rounded-xl p-3 border border-gray-800 bg-[#1c1c1e] text-white"
          >
            <option value="" className="bg-[#1c1c1e] text-white">
              Select Worker
            </option>

            {workers.map((worker) => (
              <option
                key={worker.id}
                value={worker.id}
                className="bg-[#1c1c1e] text-white"
                >
                {worker.name}
              </option>

            ))}

          </select>

          <button
            type="submit"
            className="bg-[#000000] text-white px-4 py-3 rounded-xl w-full hover:opacity-90"
          >
            Create Task
          </button>

        </div>

      </form>
    </>
  )
}

export default TaskForm;