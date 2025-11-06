import { NavLink, useLocation } from "react-router-dom";
import { FiCheckSquare } from "react-icons/fi";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const onLogout = () => {
    localStorage.removeItem(storageKey);
    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <FiCheckSquare className="text-indigo-600 text-2xl" />
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">TodoApp</span>
        </div>
        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" className={({ isActive }) => `transition-colors px-2 py-1 rounded-md font-semibold text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'} hover:bg-indigo-50 dark:hover:bg-slate-800`}>Home</NavLink>
          </li>
          {userData ? (
            <>
              <li>
                <NavLink to="/todos" className={({ isActive }) => `transition-colors px-2 py-1 rounded-md text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'} hover:bg-indigo-50 dark:hover:bg-slate-800`}>Todos</NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => `transition-colors px-2 py-1 rounded-md text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'} hover:bg-indigo-50 dark:hover:bg-slate-800`}>Profile</NavLink>
              </li>
              <li>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-md font-medium shadow-sm"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/register" className={({ isActive }) => `transition-colors px-2 py-1 rounded-md font-semibold text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'} hover:bg-indigo-50 dark:hover:bg-slate-800`}>Register</NavLink>
              </li>
              <li>
                <NavLink to="/login" className={({ isActive }) => `transition-colors px-2 py-1 rounded-md font-semibold text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'} hover:bg-indigo-50 dark:hover:bg-slate-800`}>Login</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
