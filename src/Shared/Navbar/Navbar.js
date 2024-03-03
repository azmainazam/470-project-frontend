import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Notification from "./Notification";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { ClimbingBoxLoader } from "react-spinners";
const Navbar = () => {
  const [theme, setTheme] = useState(null);
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const state = location.state;
  console.log(state);

  const {
    data: notification = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/notification?email=${user?.email}`
      );
      const data = await res.json();
      return data;
    },
  });

  const notificationDelete = (id) => {
    fetch(`https://turf-server-seven.vercel.app/notification/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
          refetch();
        }
      });
  };
  useEffect(() => {
    if (window.matchMedia("{prefers-color-scheme : dark}").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => {});
  };

  const menuItems = (
    <React.Fragment>
      <li>
        <Link to="/" className="font-bold dark:text-white">
          Home
        </Link>
      </li>
      {/* <li>
        <div className="dropdown dropdown-bottom">
          <label tabIndex={0} className="font-bold dark:text-white">
            Category
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="">Apple</Link>
            </li>
            <li>
              <Link to="">Android</Link>
            </li>
            <li>
              <Link to="">Google</Link>
            </li>
          </ul>
        </div>
      </li> */}
      {/* <li>
        <Link to="/blog" className="font-bold dark:text-white">
          Blog
        </Link>
      </li> */}
      {user?.uid ? (
        <>
          <li>
            <Link to="/dashboard" className="font-bold dark:text-white">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/slotBook" className="font-bold dark:text-white">
              Slot Book
            </Link>
          </li>
          <li>
            <Link to="/shop" className="font-bold dark:text-white">
              Shop
            </Link>
          </li>
        </>
      ) : (
        <li>
          <Link to="/login" className="font-bold dark:text-white">
            Login
          </Link>
        </li>
      )}
      <li>
        <label className="swap swap-rotate">
          <input onClick={handleSwitch} type="checkbox" />

          <svg
            className="swap-on fill-current w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          <svg
            className="swap-off fill-current w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </li>
    </React.Fragment>
  );

  return (
    <div className="navbar bg-teal-100 dark:bg-slate-600">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems}
          </ul>
        </div>
        <div className="flex items-center">
          {/* <img src={logo} alt="logo" className="w-10" /> */}
          <Link
            to="/"
            className="btn btn-ghost normal-case text-xl font-bold dark:text-white"
          >
            Turf Slot Booking
          </Link>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">{menuItems}</ul>
      </div>
      <div className="navbar-end">
        {user?.uid ? (
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator ">
                <div className="dropdown dropdown-left ">
                  <label tabIndex={3}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </label>
                  <ul
                    tabIndex={3}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-96"
                  >
                    {notification.length > 0 ? (
                      <>
                        {notification.map((n, i) => (
                          <li key={i}>
                            <div className="flex justify-between text-center">
                              <a>{n.msg}</a>
                              <button onClick={() => notificationDelete(n._id)}>
                                <FaTrashAlt className="text-red-400 "></FaTrashAlt>
                              </button>
                            </div>
                          </li>
                        ))}
                      </>
                    ) : (
                      <li>
                        <a>NO msg</a>
                      </li>
                    )}
                  </ul>
                </div>

                {notification.length > 0 ? (
                  <span className="badge badge-xs badge-success indicator-item">
                    {notification.length}
                  </span>
                ) : (
                  <span className="badge badge-xs badge-success indicator-item">
                    0
                  </span>
                )}
              </div>
            </button>

            <p className="font-bold dark:text-white">{user.displayName}</p>
            <label
              tabIndex={2}
              htmlFor="my-drawer-2"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL} alt="userPhoto" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/dashboard">Profile</Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <Link to="/login" onClick={handleLogOut}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} alt="userPhoto" />
              </div>
            </div> */}
          </div>
        ) : (
          <Link to="/register" className="btn btn-primary">
            Get started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
