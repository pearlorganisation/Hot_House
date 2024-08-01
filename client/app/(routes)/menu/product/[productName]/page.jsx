"use client";
import Cheese from "@/app/_components/customization/cheese/Cheese";
import MeatToppings from "@/app/_components/customization/meatToppings/MeatToppings";
import Sauce from "@/app/_components/customization/sauce/Sauce";
import VegetarianToppings from "@/app/_components/customization/vegetarianToppings/VegetarianToppings";
import TotalPriceCard from "@/app/_components/TotalPriceCard/TotalPriceCard";
import { addToCart, setToppings } from "@/app/lib/features/cartSlice/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
// import { useParams } from 'next/navigation';

const Product = () => {
  // const params = useParams();
  // const pizzaName= params?.productName

  const { customizationData } = useSelector((state) => state.orderDetails);
  const { allToppings } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const combineNames = () => {
    const items = [
      customizationData?.meatToppingsName,
      customizationData?.vegetarianToppingsName,
      customizationData?.cheeseName,
      customizationData?.sauceName,
    ].filter((item) => item && item.length > 0);

    // Join the items with a comma
    return items.join(", ");
  };

  const [basePrices, setBasePrices] = useState([]);
  const [cheesePrices, setCheesePrices] = useState([]);
  const [saucePrices, setSaucePrices] = useState([]);
  const [vegetarianToppingsPrices, setVegetarianToppingsPrices] = useState([]);
  const [meatToppingsPrices, setMeatToppingsPrices] = useState([]);

  // console.log(saucePrices)
  // console.log(customizationData?.sauceName)
  const [selectedSizeId, setSelectedSizeId] = useState(
    customizationData?.priceSection.length === 1
      ? customizationData?.priceSection[0]?.size._id
      : customizationData?.selectedData
  );

  const [selectedBase, setSelectedBase] = useState(
    customizationData?.baseName || ""
  );
  const [selectedCheese, setSelectedCheese] = useState(
    customizationData?.cheeseName || ""
  );
  const [selectedSauce, setSelectedSauce] = useState(
    customizationData?.sauceName || ""
  );
  const [selectedMeatToppings, setSelectedMeatToppings] = useState(
    customizationData?.meatToppingsName || ""
  );
  const [selectedVegetarianToppings, setSelectedVegetarianToppings] = useState(
    customizationData?.vegetarianToppingsName || ""
  );

  useEffect(() => {
    if (customizationData) {
      const size = customizationData?.priceSection.find(item => {
        return item?.size?._id === selectedSizeId
      })
      dispatch(setToppings(size))
    }
  }, [selectedSizeId]);

  useEffect(() => {
    if (basePrices) {
      const base = basePrices?.find(item => {
        return item?.name === selectedBase
      })
      dispatch(setToppings({ base: base }))
    }
  }, [basePrices, selectedBase]);
  const handleRadioChange = async (e) => {
    const newSizeId = e.target.value;
    setSelectedSizeId(newSizeId);


    // Fetch new prices based on the selected size
    await fetchPricesForSelectedSize(newSizeId);
  };

  useEffect(() => {
    fetchPricesForSelectedSize(selectedSizeId);
    // console.log(selectedSizeId)
  }, [selectedSizeId]);

  useEffect(() => {
    setSelectedSizeId(customizationData?.selectedData);
  }, [customizationData]);





  // -------------------data fetching for price-----------------------

  const fetchPricesForSelectedSize = async (sizeId) => {
    // console.log(sizeId)
    try {
      if (sizeId) {

        const [baseResponse, sauceResponse, cheeseResponse, meatToppingsResponse, vegetarianToppingsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/base/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/sauce/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/cheese/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/meatToppings/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/vegetarianToppings/price?sizeId=${sizeId}`),
        ]);

        const basePriceData = await baseResponse.json();

        const saucePriceData = await sauceResponse.json();

        const cheesePriceData = await cheeseResponse.json();

        const meatToppingsPriceData = await meatToppingsResponse.json();

        const vegetarianToppingsPriceData = await vegetarianToppingsResponse.json();



        setBasePrices(basePriceData.data);
        setMeatToppingsPrices(meatToppingsPriceData.data);
        setVegetarianToppingsPrices(vegetarianToppingsPriceData.data);
        setSaucePrices(saucePriceData.data);
        setCheesePrices(cheesePriceData.data);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };




  const handleCustomization = () => {

    const temp1 = allToppings
    const emp = customizationData?.priceSection.find(item => {
      return item?.size?._id === selectedSizeId
    })
    const temp2 = { name: customizationData?.name, img: customizationData?.img, base: selectedBase, size: emp, allToppings: allToppings }

    dispatch(addToCart({
      name: customizationData?.name, img: customizationData?.img, id: customizationData?.id + allToppings?.size?._id, quantity: 1, price: allToppings?.totalPrice, totalSum: allToppings?.totalPrice,
      allToppings: allToppings
    }))

  }






  return (
    <>
      <div className="max-w-xl md:max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg my-8">
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1">
            <h1 className="text-4xl  text-gray-800">
              {customizationData?.name}
            </h1>
            <p className="mt-2 text-gray-600">{combineNames()}</p>
            <div className="mt-4">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg">
                Save
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">SIZES</h2>
              <div className="mt-2 space-y-2">
                {Array.isArray(customizationData?.priceSection) &&
                  customizationData?.priceSection.map((data, idx) => (
                    <label key={idx} className="inline-flex gap-2 items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="size"
                        value={data?.size?._id}
                        checked={
                          selectedSizeId && selectedSizeId === data?.size?._id
                        }
                        onChange={handleRadioChange}
                      />

                      <span className="mr-4 ">{data?.size?.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">BASE</h2>
              <div className="mt-2 space-y-2">
                {Array.isArray(basePrices) &&
                  basePrices?.map((base) => (
                    <label
                      key={base?._id}
                      className="inline-flex gap-2 items-center"
                    >
                      <input
                        type="radio"
                        className="form-radio"
                        onChange={(e) => {

                          const base = e.target.value;
                          setSelectedBase(base);
                        }}
                        name="base"
                        value={base?.name}
                        checked={selectedBase === base?.name}
                      />
                      <span className="mr-4">
                        {base?.name}
                        <>
                          {" "}
                          {base?.price[0]?.price > 0 && (
                            <span className="bg-red-500 text-white rounded-lg px-1">
                              + £ {base?.price[0]?.price}
                            </span>
                          )}
                        </>
                      </span>
                    </label>
                  ))}
              </div>
            </div>



            {/* SAUCE STARTS */}
            <Sauce sauceData={saucePrices} />
            {/* SAUCE ENDS */}

            {/* CHEESE: STARTS */}
            <Cheese cheeseData={cheesePrices} />
            {/* CHEESE: ENDS */}

            {/* VEGETARIAN TOPPINGS: STARTS */}
            <VegetarianToppings vegetarianTopData={vegetarianToppingsPrices} />
            {/* VEGETARIAN TOPPINGS: ENDS */}

            {/* MEAT TOPPINGS: STARTS */}
            <MeatToppings meatTopData={meatToppingsPrices} />
            {/* MEAT TOPPINGS: ENDS */}




            <div className="mt-4">
              <button onClick={handleCustomization} className="bg-[#39A144] text-white w-full px-10 p-2 rounded">
                Save
              </button>
            </div>
          </div>

          <div className="hidden md:block md:ml-8">
            <img
              src={customizationData?.img}
              alt="Hawaiian Pizza"
              className="w-[360px] h-[360px] rounded-lg"
            />
            <p className="w-[360px] text-gray-600 ">{combineNames()}</p>
          </div>
        </div>
      </div>
      <TotalPriceCard />
    </>
  );
};

export default Product;
