import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/ui/cards";
import TransactionForm from "../components/ui/transactionForm";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutation_user";
import { GET_AUTHENTICATED_USER } from "../graphql/query_user";
import { GET_TRANSACTION_STATISTICS } from "../graphql/query_transaction";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useQuery(GET_TRANSACTION_STATISTICS);
  const { data: authUserData, loading: authLoading } = useQuery(GET_AUTHENTICATED_USER);

  const [logout, { loading: logoutLoading }] = useMutation(LOGOUT);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((category) => {
        if (category === "saving") {
          backgroundColors.push("rgba(75, 192, 192)");
          borderColors.push("rgba(75, 192, 192)");
        } else if (category === "expense") {
          backgroundColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        } else if (category === "investment") {
          backgroundColors.push("rgba(54, 162, 235)");
          borderColors.push("rgba(54, 162, 235)");
        }
      });

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message);
    }
  };

  if (!authUserData && !authLoading) {
    navigate("/login");
    return null; 
  }

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="w-full mb-4 flex items-center justify-between">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <div className="flex items-center gap-2">
            {/* <img
              src={"images.jpeg"}
              className="w-11 h-11 rounded-full border cursor-pointer"
              alt="Avatar"
            /> */}
            {!logoutLoading ? (
              <MdLogout
                className="w-5 h-5 cursor-pointer"
                onClick={handleLogout}
              />
            ) : (
              <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]">
              <Doughnut data={chartData} />
            </div>
          )}
          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};

export default HomePage;
