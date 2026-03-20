import React from "react";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";

const Home = () => {
  return (
    <main className="overflow-hidden bg-transparent">
      <NewArrival />
      <Categories />
    </main>
  );
};

export default Home;
