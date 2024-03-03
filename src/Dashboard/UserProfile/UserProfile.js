import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
// import { TabTitle } from '../../../DynamicTitle/DynamicTitle';
import { FaEdit } from "react-icons/fa";
import EditModal from "./EditInfo/EditModal";

const UserProfile = () => {
  // TabTitle('Dashboard-Mobile Broker')
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const [edit, setEdit] = useState({});
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
      });
  }, [user?.email]);
  const userInfo = userRole[0];
  // console.log(userInfo);
  // const name = userInfo.name;
  // const userName = name.toUpperCase();

  if (user.emailVerified === true) {
    fetch(
      `https://turf-server-seven.vercel.app/users/verify?email=${user.email}`,
      {
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((data) => {});
  }
  console.log(userInfo);

  // if (userInfo.role === "Turf Owner") {
  //   fetch(`https://turf-server-seven.vercel.app/turfCollection?name=${userName}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setEditData(data);
  //     });
  // }
  return (
    <div className="min-h-screen bg-teal-100 dark:bg-slate-700 w-4/5 m-5 rounded-lg p-5 ">
      <div>
        <div className="flex justify-between">
          <div className="flex justify-start">
            <div className="avatar m-5">
              <div className="w-40 rounded-full">
                <img src={userInfo?.img} alt="user-photo" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl text-green-700 font-bold mt-20">
                {userInfo?.name}
              </h1>
            </div>
          </div>
          <div className="m-10">
            <label onClick={() => setEdit(userInfo)} htmlFor="my-modal-3">
              <FaEdit className="text-2xl cursor-pointer text-green-700 hover:text-3xl" />
            </label>
          </div>
        </div>
        {userInfo?.varify === "False" && (
          <div
            class="w-1/2 mx-auto bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div class="flex">
              <div class="py-1">
                <svg
                  class="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p class="font-bold">Your Email is NOT VARIFIED</p>
                <p class="text-sm">
                  Make sure you login again from link send to your email
                </p>
              </div>
            </div>
          </div>
        )}
        {/* basic info */}
        <div>
          <h1 className="text-3xl font-bold m-5 text-green-700">
            {`${userInfo?.role} Information`}
          </h1>
        </div>

        <div className="card mx-auto w-4/5 bg-white text-primary-content">
          <div className="card-body">
            <h2 className="card-title text-green-400">Basic Information</h2>
            <div className="mx-8">
              <div className="flex justify-start gap-28">
                <h1 className="text-2xl font-semibold text-black">Name</h1>
                <h1 className="text-2xl  text-black">{userInfo?.name}</h1>
              </div>
              <hr className=""></hr>
              <div className="flex justify-start gap-20">
                <h1 className="text-2xl font-semibold text-black">Location</h1>
                <h1 className="text-2xl  text-black">
                  {userInfo?.location ? userInfo?.location : ""}
                </h1>
              </div>
              <hr></hr>
            </div>
          </div>
        </div>
        {/* Contact Info */}
        <div className="card mt-5 mx-auto w-4/5 bg-white text-primary-content ">
          <div className="card-body">
            <h2 className="card-title text-green-400">Contact Information</h2>
            <div className="mx-8">
              <div className="flex justify-start gap-32">
                <h1 className="text-2xl font-semibold text-black">Email</h1>
                <h1 className="text-2xl  text-black">{userInfo?.email}</h1>
              </div>
              <hr></hr>
              <div className="flex justify-start gap-5">
                <h1 className="text-2xl font-semibold text-black">
                  Phone Number
                </h1>
                <h1 className="text-2xl  text-black">{userInfo?.phone}</h1>
              </div>
              <hr></hr>
              <div className="flex justify-start gap-24">
                <h1 className="text-2xl font-semibold text-black">Address</h1>
                <h1 className="text-2xl  text-black">{userInfo?.address}</h1>
              </div>
              <hr></hr>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditModal edit={edit}></EditModal>}
    </div>
  );
};

export default UserProfile;
