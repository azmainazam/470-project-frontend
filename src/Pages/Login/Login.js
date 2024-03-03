import { GoogleAuthProvider, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye, FaGoogle, FaGithub } from "react-icons/fa";
import Lottie from "react-lottie";
import "./Login.css";
// import useToken from "../hooks/useToken";
// import { TabTitle } from "../../DynamicTitle/DynamicTitle";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  //   TabTitle("LogIn-Mobile Broker");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../login.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [logInError, setLogInError] = useState("");
  const [open, setOpen] = useState(false);
  const [logInSuccess, setLogInSuccess] = useState(false);
  const [getemail, setEmail] = useState("");
  const [logInUserEmail, setLogInUserEmail] = useState("");
  const [enable, setEnable] = useState(false);
  //   const [token] = useToken(logInUserEmail);
  const { logIn, forgetPassword, googleLogIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Example usage of onAuthStateChanged

  //   if (token) {
  //     navigate(from, { replace: true });
  //   }
  const toggle = () => {
    setOpen(!open);
  };

  const handleLogin = (data) => {
    console.log(data);
    setLogInError("");
    setLogInSuccess(false);
    logIn(data.email, data.password)
      .then((res) => {
        const user = res.user;
        console.log(user.emailVerified);
        toast.success("user login successfully");
        setLogInUserEmail(data.email);
        navigate("/");
        // if (user.emailVerified) {
        //   fetch(`https://turf-server-seven.vercel.app/users?email=${user.email}`, {
        //     method: "PATCH",
        //   })
        //     .then((res) => res.json())
        //     .then((data) => {
        //       navigate("/");
        //     });
        // }
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = err.message;
        setLogInError(errorMessage.slice(22, -2));
      });
  };
  const emailBlur = (event) => {
    let email = event.target.value;
    setEmail(email);
  };

  const handlePassword = () => {
    forgetPassword(getemail)
      .then(() => {
        toast.success(`A link sent on ${getemail}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
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
              setLogInUserEmail(data.email);
              toast.success("user login successfull");
              navigate("/");
            } else {
              const role = "buyer";
              saveUser(
                user.displayName,
                user.email,
                number,
                location,
                user.photoURL
              );
              navigate("/");
            }
          });
      })
      .catch((err) => {
        const errMsg = err.message;
        setLogInError(errMsg);
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
    fetch("https://turf-server-seven.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("user login successful!!");
        setLogInUserEmail(email);
      });
  };
  function onChange(value) {
    setEnable(true);
  }
  return (
    <div className="hero min-h-screen bg-base-200 dark:bg-slate-800">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6"> please login</p>
                </div> */}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 dark:bg-slate-600 dark:text-white">
          <form onSubmit={handleSubmit(handleLogin)} className="card-body">
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
                onBlur={emailBlur}
                className="input input-bordered input-success dark:text-black"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input input-bordered input-success pass flex justify-between items-center border rounded-lg p-3 dark:bg-white">
                <input
                  {...register("password", {
                    required: "Password is required",
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  type={open === false ? "password" : "text"}
                  placeholder="password"
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
              <label className="label">
                <Link
                  onClick={handlePassword}
                  className="label-text-alt link link-hover text-success"
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <ReCAPTCHA
              sitekey="6LfGqBMpAAAAAIFvGBAUUmaLytqkPdK626XLXC-R"
              onChange={onChange}
            />
            {logInError && <p className="text-red-500 my-3">{logInError}</p>}

            <div className="form-control mt-6">
              <button
                className="btn bg-green-800 text-white"
                disabled={!enable}
              >
                Login
              </button>
            </div>

            <div className="form-control mt-1">
              <label className="label">
                <h1 className="text-sm text-center">
                  Do not have an account?
                  <Link
                    to="/register"
                    className="link link-primary text-success"
                  >
                    register
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
                disabled={!enable}
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

export default Login;
