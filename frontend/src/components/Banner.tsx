import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogOut = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 1000);
  };
  return (
    <header className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 sm:py-12 ">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome Back, Jega!</h1>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <button
              onClick={handleLogOut}
              className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;
