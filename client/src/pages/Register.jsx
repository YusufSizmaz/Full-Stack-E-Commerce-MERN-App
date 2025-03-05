import React, { useState, useCallback } from "react";
import useDelayedHandleChange from "../hooks/useDebounceSearch";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const delayedHandleChange = useDelayedHandleChange(setData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    delayedHandleChange(name, value);
  };

  console.log("debounced-callback", data);

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4">
        <p>Welcome to Binkeyit</p>

        <form className="grid gap-2 mt-6">
          <div className="grid">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              autoFocus
              className="bg-blue-50 p-2"
              name="name"
              defaultValue={data.name}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
