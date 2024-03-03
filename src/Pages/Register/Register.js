import { GoogleAuthProvider } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEyeSlash,
  FaEye,
  FaGoogle,
  FaGithub,
  FaWindows,
} from "react-icons/fa";
import "./Register.css";
import Lottie from "react-lottie";
// import useToken from "../hooks/useToken";
// import { TabTitle } from "../../DynamicTitle/DynamicTitle";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";

const Register = () => {
  //   TabTitle("SignUp-Mobile Broker");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../reg.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { createUser, updateUserProfile, googleLogIn, emailVarification } =
    useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const imageHostKey = "41185f8bc11dfae202e0de3bc10fcabe";
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const toggle = () => {
    setOpen(!open);
  };
  const handleRegister = (data) => {
    console.log(data);

    if (data.password !== data.confirmPassword) {
      setSignUpError("confirm password doesnot match!!");
    } else {
      createUser(data.email, data.password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          const image = data.img[0];
          const formData = new FormData();
          formData.append("image", image);
          const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
          fetch(url, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((imgData) => {
              const image = imgData.data.url;
              handleUpdate(data.name, image);
              saveUser(
                data.name,
                data.email,
                data.number,
                data.location,
                image
              );
            });
        })
        .catch((error) => {
          console.error(error);
          const errorMsg = error.message;
          setSignUpError(errorMsg);
        });
      const handleUpdate = (name, img) => {
        const profile = {
          displayName: name,
          photoURL: img,
        };
        console.log(profile);
        updateUserProfile(profile)
          .then(() => {})
          .catch((e) => console.error(e));
      };
    }
  };
  const handleGoogleLogIn = () => {
    googleLogIn(googleProvider)
      .then((res) => {
        const user = res.user;
        const number = "";
        const location = "";
        console.log(user);
        fetch(`https://turf-server-seven.vercel.app/users?email=${user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.length) {
              setUserEmail(data.email);
              toast.success("user login successfull");
              navigate("/");
            } else {
              saveUser(
                user.displayName,
                user.email,
                number,
                location,
                user.photoURL
              );
            }
          });
      })
      .catch((err) => {
        const errMsg = err.message;
        setSignUpError(errMsg);
      });
  };

  const saveUser = (name, email, number, location, image) => {
    const newUser = {
      name: name,
      email: email,
      phone: number,
      location: location,
      role: "Player",
      img: image,
      varify: "False",
    };
    const newNotification = {
      email: email,
      msg: "We have sent you a varification link to your email.",
    };
    fetch("https://turf-server-seven.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserEmail(email);
        toast.success("user registered successfully!!");
        fetch("https://turf-server-seven.vercel.app/notification", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newNotification),
        })
          .then((res) => res.json())
          .then((data) => {
            emailVarification();
            navigate("/", {
              state: { exampleState: { name } },
            });
          });
      });
  };
  return (
    <div className="hero min-h-screen bg-base-200 dark:bg-slate-800">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 dark:bg-slate-600">
          <form onSubmit={handleSubmit(handleRegister)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Full Name"
                className="input input-bordered input-success"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", {
                  required: "Email Address is required",
                })}
                type="text"
                placeholder="email"
                className="input input-bordered input-success"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                {...register("number", {
                  required: "Phone Number is required",
                  pattern: /^[0-9]{11}$/,
                })}
                type="text"
                placeholder="number"
                className="input input-bordered input-success"
              />
              {errors.number && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.number?.message}
                </p>
              )}
              {errors?.number?.type === "pattern" && (
                <p className="text-xs text-red-400 max-w-fit mt-3" role="alert">
                  please input valid phone number
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">User Photo</span>
              </label>
              <input
                type="file"
                {...register("img", { required: "Image is required" })}
                className="file-input file-input-bordered file-input-success w-full max-w-xs"
              />
              {errors.img && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.img?.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Your Location</span>
              </label>
              <select
                {...register("location")}
                className="select select-ghost w-full bg-white select-bordered border-accent"
              >
                <option value="Panchlaish">Panchlaish</option>
                <option value="Oxygen" selected>
                  Oxygen
                </option>
                <option value="Agrabad" selected>
                  Agrabad
                </option>
                <option value="Halisahar" selected>
                  Halisahar
                </option>
                <option value="Chandgaw" selected>
                  Chandgaw
                </option>
                <option value="GEC" selected>
                  GEC
                </option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input input-bordered input-success pass flex justify-between items-center border rounded-lg p-3 dark: bg-white">
                <input
                  {...register("password", {
                    required: "Password is required",
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  type={open === false ? "password" : "text"}
                  placeholder="password"
                  className="  dark:text-black dark:bg-white"
                />
                {open === false ? (
                  <FaEyeSlash
                    className="dark:text-black"
                    onClick={toggle}
                  ></FaEyeSlash>
                ) : (
                  <FaEye className="dark:text-black" onClick={toggle}></FaEye>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-red-400" role="alert">
                  {errors.password?.message}
                </p>
              )}
              {errors?.password?.type === "pattern" && (
                <p className="text-xs text-red-400 max-w-fit mt-3" role="alert">
                  Minimum eight characters, at least one
                  uppercasse,lowercase,number,special letter
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="input input-bordered input-success pass flex justify-between items-center border rounded-lg p-3 dark: bg-white">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                  })}
                  type={open === false ? "password" : "text"}
                  placeholder="confirm password"
                  className="dark:text-black dark:bg-white"
                />
                {open === false ? (
                  <FaEyeSlash
                    className="dark:text-black"
                    onClick={toggle}
                  ></FaEyeSlash>
                ) : (
                  <FaEye className="dark:text-black" onClick={toggle}></FaEye>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400" role="alert">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            {signUpError && <p className="text-red-500 my-3">{signUpError}</p>}
            {emailLink && <p className="text-red-500 my-3">{emailLink}</p>}

            <div className="form-control mt-6">
              <button className="btn bg-green-800 text-white">Signup</button>
            </div>
            <div className="form-control mt-1">
              <label className="label">
                <h1 className="text-sm text-center">
                  Already have an account?
                  <Link
                    to="/login"
                    className="link link-success dark:text-white"
                  >
                    login
                  </Link>
                </h1>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <hr className="w-1/2" />
              <h1 className="text-sm font-bold">OR</h1>
              <hr className="w-1/2" />
            </div>
            <div className="form-control mt-6">
              <button
                onClick={handleGoogleLogIn}
                className="btn bg-green-800 text-white"
              >
                <span className="flex items-center space-x-4">
                  <span>
                    <FaGoogle></FaGoogle>{" "}
                  </span>{" "}
                  <span>continue with google</span>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <Lottie options={defaultOptions} />
        </div>
      </div>
    </div>
  );
};

export default Register;
