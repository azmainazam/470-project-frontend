import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const EditModal = ({ edit }) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const handleEdit = (e) => {
    const form = e.target;
    const details = form.details.value;
    const price = form.price.value;
    const name = form.name.value;
    e.preventDefault();
    console.log("e", details, name, price);
  };
  const { getRootProps } = useDropzone({
    // Note how this callback is never invoked if drop occurs on the inner dropzone
    onDrop: (files) => console.log("img", files),
  });
  return (
    <div>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-success text-white absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold  text-green-700">
            Edit Your Information
          </h3>
          <form onSubmit={handleEdit} className="text-center">
            <div className="indicator mx-auto">
              <div {...getRootProps({ className: "dropzone" })}>
                <span className="mb-3 mr-3 cursor-pointer py-3 text-lg font-bold indicator-item indicator-start sm:indicator-middle md:indicator-bottom lg:indicator-center xl:indicator-end badge bg-green-800 text-white">
                  +
                </span>
              </div>

              <div className="avatar">
                <div className="w-28 rounded-full">
                  <img src={edit.img} />
                </div>
              </div>
            </div>
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Product Name"
              defaultValue={edit.name}
              disabled
              className="my-1 input input-border input-accent  w-full "
            />
            <label className="label">
              <span className="label-text">Product Resale Price</span>
            </label>
            <input
              name="price"
              type="text"
              placeholder="Product Resale Price"
              defaultValue={edit.email}
              disabled
              className="my-1 input input-border input-accent w-full "
            />
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="details"
              className="textarea textarea-primary w-full"
              defaultValue={edit.role}
              placeholder="Bio"
            ></textarea>
            <input
              type="submit"
              value="save changes"
              className="my-1 input input-border input-accent bg-accent text-white w-full "
            />
          </form>
          {/* <form onSubmit={handleSubmit(handleEdit)} className="card-body"> */}
          {/* <div className="indicator mx-auto">
              <div {...getRootProps({ className: "dropzone" })}>
                <span className="mb-3 mr-3 cursor-pointer py-3 text-lg font-bold indicator-item indicator-start sm:indicator-middle md:indicator-bottom lg:indicator-center xl:indicator-end badge badge-success text-white">
                  +
                </span>
              </div>

              <div className="avatar">
                <div className="w-28 rounded-full">
                  <img src={edit.img} />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
                value={edit?.name}
                className="input input-bordered input-success"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", {})}
                type="text"
                placeholder="email"
                value={edit?.email}
                className="input input-bordered input-success"
              />
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
                placeholder="Enter Your Phone Number"
                defaultValue={edit.number}
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
                defaultValue={edit.img}
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
                defaultValue={edit.location}
                className="select select-ghost w-full bg-white select-bordered"
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
                <span className="label-text">Address</span>
              </label>
              <textarea
                {...register("address")}
                type="text"
                placeholder="Enter Your Address"
                defaultValue={edit.address}
                className="input input-bordered input-success textarea"
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn bg-green-800 text-white">
                Update Information
              </button>
            </div> */}
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
