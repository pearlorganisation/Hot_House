import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import AddedToCartModel from "@/app/_components/Modals/AddedToCartModel";
import Select from "react-select";
// const DrinksCard = ({ data }) => {
//   const [drinkId, setDrinkId] = useState(data.price[0]._id)
//   const dispatch = useDispatch();

//   useEffect(() => {
//     console.log("drinks Card Data", data.price);
//   }, [data]);

//   // State to manage selected drink type and price
//   const [selectedDrink, setSelectedDrink] = useState(
//     `${data.price[0].drinkType}-${data.price[0].price}`
//   );
//   useEffect(() => {
//     console.log("data in card data ", selectedDrink);
//   }, [selectedDrink]);

//   // Function to handle adding to cart
//   const handleAddToCart = (data) => {
//     // const [drinkType, price, drinkName] = selectedDrink;
//     // dispatch(
//     //   addToCart({
//     //     name: data?.drink,
//     //     img: data.banner,
//     //     size: data?.drink,
//     //     id: drinkId,
//     //     quantity: 1,
//     //     price: Number(price).toFixed(2),
//     //     totalSum: Number(price).toFixed(2),
//     //   })
//     // );
//     console.log(data, "data in drinks !!");
//     // setIsAddClicked(true);
//   };

//   return (
//     <div className="bg-white shadow-md rounded-md max-w-[15rem] w-full newshadow">
//       <img
//         src={data.banner}
//         alt="Card Image"
//         className="rounded-t-md object-cover w-full h-44"
//       />

//       <h2 className="text-xl font-semibold mb-2 p-4">{data.drink}</h2>
//       <div>
//         <select
//           defaultValue={selectedDrink}
//           onChange={(event) => {
//             // const [a, b, priceId] = event.target.value.split("-");
//             // setDrinkId(priceId);
//             setSelectedDrink(event.target.value);
//           }}
//           className="w-full border-2  p-2 my-2"
//         >
//           {data.price.map((drink) => (
//             <option
//               key={drink._id}
//               value={`${drink.drinkType}-${drink.price}-${drink?._id}`}
//             >
//               {`${drink.drinkType} £ ${drink.price}`}
//             </option>
//           ))}
//         </select>

//         <div
//           className="bg-green-600 hover:bg-green-700 cursor-pointer"
//           onClick={() =>
//             handleAddToCart({
//               name: data?.drink,
//               img: data.banner,
//               size: data?.drinkType,
//               id: data._id,
//               quantity: 1,
//               // price: Number(price).toFixed(2),
//               // totalSum: Number(price).toFixed(2),
//             })
//           }
//         >
//           <p className="text-center p-2 text-white">Add</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DrinksCard = ({data}) => {

//    <div className="bg-white shadow-md rounded-md max-w-[15rem] w-full newshadow">
// //       <img
//         src={data.banner}
//         alt="Card Image"
//         className="rounded-t-md object-cover w-full h-44"
//       />

//       <h2 className="text-xl font-semibold mb-2 p-4">{data.drink}</h2>
//       <div>
// <div className="max-w-sm mx-2 flex gap-1">
//           {data.sizes?.length === 1 ? (
//             <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-500">
//               {`£ ${data.sizes[0].price}`}
//             </div>
//           ) : (
//             <Select
//               className="w-full"
//               placeholder={`${data.sizes[0].size} £${data.sizes[0].price}`}
//               options={data.sizes.map((size) => ({
//                 label: `${size.size} £${size.price}`,
//                 value: size._id,
//               }))}
//               onChange={(option) => setSelectedOption(option)}
//             />
//           )}

//           {/* <Link
//             href={{
//               pathname: path ? `${path}/deals/deals_view` : `deals/deals_view`,
//               query: { card_id: data?._id, size_id: selectedOption?.value },
//             }}
//             className="hover:bg-green-700 bg-green-600 text-white p-2 rounded-lg"
//           > */}

//         <div
//           className="bg-green-600 hover:bg-green-700 cursor-pointer"
//           onClick={() =>
//             // handleAddToCart({
//             //   name: data?.drink,
//             //   img: data.banner,
//             //   size: data?.drinkType,
//             //   id: data._id,
//             //   quantity: 1,
//             //   // price: Number(price).toFixed(2),
//             //   // totalSum: Number(price).toFixed(2),
//             // })
//           }
//         >
//           <p className="text-center p-2 text-white">Add</p>
//         </div>
//       </div>
//     </div>
// }

export default function DrinksCard({ data }) {
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    setSelectedOption({
      label: data?.price[0].drinkType,
      value: data.price[0]._id,
      price: data.price[0].price,
      img: data?.banner,
      name: data?.drink,
      size: data.price[0].drinkType,
    });
  }, []);

  useEffect(() => {
    console.log("data in the card", data);
  }, [selectedOption]);

  const dispatch = useDispatch();

  function handleAddDrinkToCart(data) {
    if (data.id) {
      dispatch(
        addToCart({
          id: data?.id + selectedOption?.value,
          name: selectedOption?.name,
          img: selectedOption?.img,
          size: `${selectedOption?.size}-${selectedOption.price}`,
          quantity: 1,
          price: Number(selectedOption.price * 1).toFixed(2),
          totalSum: Number(selectedOption.price * 1).toFixed(2),
        })
      );

      console.log({
        id: data?.id + selectedOption?.value,
        name: selectedOption?.name,
        img: selectedOption?.img,
        size: `${selectedOption?.size}"-${selectedOption.price}`,
        quantity: 1,
        price: Number(selectedOption.price * 1).toFixed(2),
        totalSum: Number(selectedOption.price * 1).toFixed(2),
      });
      console.log("selected ", selectedOption);
    }
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-md max-w-[15rem] w-full newshadow flex flex-col justify-between">
        <img
          src={data.banner}
          alt="Card Image"
          className="rounded-t-md object-cover w-full h-44"
        />

        <h2 className="text-xl font-semibold mb-2 p-3">{data.drink}</h2>
        <div>
          {data.price?.length === 1 ? (
            <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-500">
              {`${data.price[0].drinkType}  £ ${data.price[0].price}`}
            </div>
          ) : (
            <Select
              className="w-full"
              placeholder={`${data.price[0].drinkType} £${data.price[0].price}`}
              options={data.price.map((drinkItem) => ({
                label: `${drinkItem.drinkType} £${drinkItem.price}`,
                name: data.drink,
                price: drinkItem?.price,
                size: drinkItem.drinkType,
                value: drinkItem?._id,
                img: data?.banner,
              }))}
              onChange={(option) => setSelectedOption(option)}
            />
          )}

          <div
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={() =>
              handleAddDrinkToCart({
                id: data._id,
              })
            }
          >
            <p className="text-center p-2 text-white">Add</p>
          </div>
        </div>
      </div>
    </>
  );
}
