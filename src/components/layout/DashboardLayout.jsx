import { Link } from "react-router-dom";

function DashboardLayout({ children, title}){
  return(
    <div className="min-h-screen flex bg-[#111111] text-white">

      {/*Sidebar*/}
      <aside className="w-64 bg-[#1c1c1e] border-r border-gray-800 shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">
            WorkTracker
          </h1>
        </div>

        <nav className="p-4 space-y-2">

          <Link
            to="/worker"
            className="block w-full text-left p-3 rounded-xl hover:bg-[#ff9f0a] hover:text-black transition"
          >
            Dashboard
          </Link>

          <Link
            to="/sessions"
            className="block w-full text-left p-3 rounded-xl hover:bg-[#ff9f0a] hover:text-black transition"
          >
            Sessions
          </Link>

          <Link
            to="/tasks"
            className="block w-full text-left p-3 rounded-xl hover:bg-[#ff9f0a] hover:text-black transition"
          >
            Tasks
          </Link>

        </nav>
      </aside>

      {/*Main */}
      <main className="flex-1">

        {/*TopBar*/}
        <header className="bg-[#1c1c1e] border-gray-800 border-b px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-semibold">
            {title}
          </h2>
        </header>

        {/*Page Content*/}
        <div className="p-8">
          {children}
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;