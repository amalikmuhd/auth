import { useEffect, useState } from "react";
import avatar from "../../public/logo.png";
import Banner from "./Banner";
import Footer from "./Footer";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:3000/api/users/me";

  const fetchData = async (token: string) => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (response.data?.message === "success") {
        setData(response.data?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message, "error");
      setError(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("token") as never);
    if (items) {
      fetchData(items);
    }
    console.log(items, "itemsss");
  }, []);
  return (
    <>
      <Banner name={data?.lastName || ""} />
      <div className="flex justify-center items-center h-[100%]" style={{ height: 300 }}>
        <div className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
          <div className="rounded-[10px] bg-white p-4 !pt-10 sm:p-6">
            <div className="flex items-center justify-center mb-4">
              <img src={avatar} className="w-24" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-900">
                Full Name: {data?.firstName}
                {` `}
                {data?.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-900">Email: {data?.email}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-900">Phone Number: {data?.phoneNumber}</p>
            </div>

            <div className="flex flex-wrap gap-1 items-center mt-2">
              <p className="text-sm text-gray-900">Courses:</p>
              <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600">
                Snippet
              </span>

              <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600">
                JavaScript
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
