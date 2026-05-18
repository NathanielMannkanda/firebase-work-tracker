import { Link } from "react-router-dom";

function DashboardLayout({ children, title}){
  return(
    <div className="min-h-screen flex bg-gray-100">

      {/*Sidebar*/}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">
            WorkTracker
          </h1>
        </div>

        <nav>
          <Link
            to="/manager"
            className="block w-full text-left p-3 rounded-lg hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link 
            to="/sessions"
            className="block w-full text-left p-3 rounded-lg hover:bg-gray-100"
          >
            Sessions
          </Link>

          <Link 
            to="/tasks"
            className="block w-full text-left p-3 rounded-lg hover:bg-gray-100">
            Tasks
          </Link>
        </nav>
      </aside>

      {/*Main */}
      <main className="flex-1">

        {/*TopBar*/}
        <header className="bg-white border-b px-8 py-4 shadow-sm">
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