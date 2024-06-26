import React, { useState } from "react";
import useSWR from "swr";

import { useDispatch, useSelector } from "react-redux";

import DessertCards from "./DessertCard/DessertCards";

// -------------------data fetching function-----------------------
const pizzaFetcher = (...args) => fetch(...args).then((res) => res.json());

const Desserts = () => {
  // -------------------------------------------useState--------------------------------------------
  const [selectedType, setSelectedType] = useState("All");
  const [isStorePopUpVisible, setIsStorePopUpVisible] = useState(false);

  // =-------------------------data fetching---------------------------

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert`,
    pizzaFetcher
  );

  // ---------------fetch filter---------------------------
  const {
    data: filterData,
    error: filterError,
    isLoading: filterLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert/filter`,
    pizzaFetcher
  );

  // -----------------category fetcher------------------------------------------
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert/category`,
    pizzaFetcher
  );

  const categories = [];
  categoryData &&
    categoryData?.data?.map((data) => categories.push(data?.category));
  // ---------------------------------dummyData------------------------------------------------------

  if (error || filterError) return <div>failed to load</div>;
  if (isLoading || filterLoading) return <div>....loading</div>;
  console.log(data);
  return (
    <div className="my-4">
      <div>
        <div className="flex gap-2 mx-4 md:mx-8 my-4 flex-wrap ">
          <span className="font-bold">filter:</span>
          {filterData?.data?.map((data) => (
            <div className="flex gap-2" key={data}>
              <input
                type="radio"
                name="type"
                value={data?.filter}
                id={data?.filter}
                defaultChecked={data?.filter === "All"}
                onClick={() => setSelectedType(data?.filter)}
              />
              <label htmlFor={data?.filter}>{data?.filter}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto">
        {categories &&
          categories.map((category) => {
            const isCategoryMatched = data?.data?.some(
              (data) =>
                data.category?.category === category &&
                (selectedType === data?.filter?.filter ||
                  selectedType === "All")
            );
            return (
              <React.Fragment key={category}>
                {isCategoryMatched && (
                  <div class="flex items-center justify-center mb-2 p-5">
                    <div class="flex-grow border-t border-red-500"></div>
                    <h1 class="px-4 text-red-500 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                      {category}
                    </h1>
                    <div class="flex-grow border-t border-red-500 "></div>
                  </div>
                )}

                <div className="flex gap-4 flex-wrap justify-center">
                  {data?.data &&
                    data?.data.map((data, idx) => {
                      if (
                        data?.category?.category === category &&
                        (selectedType === data?.filter?.filter ||
                          selectedType === "All")
                      ) {
                        return <DessertCards data={data} idx={idx} />;
                      }
                      return null;
                    })}
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default Desserts;
