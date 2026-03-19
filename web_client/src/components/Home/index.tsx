import React from "react";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";

const Home = () => {
  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#ffffff_24%,#f8fbff_62%,#eef5ff_100%)]">
      <NewArrival />
      <Categories />
    </main>
  );
};

export default Home;
