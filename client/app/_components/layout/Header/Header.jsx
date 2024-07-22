"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Raleway, Teko } from "next/font/google";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaRegUser, FaShop } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import logo from "../../../_assets/images/HOTPIZZALOGO.png";
import { categoryEnum } from "@/app/utils/utils";
import { useAppSelector } from "@/app/lib/hooks";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-raleway",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teko",
});

const Header = () => {
  const [selecteditem, setSelectedItem] = useState(null);
  const cart = useAppSelector((state) => state.cart.cartData);
  const { userData, isUserLoggedIn } = useAppSelector((state) => state.auth);

  const totalPrice = cart?.reduce((ele, acc) => {
    const price = String(acc?.size).includes("-")
      ? acc?.size?.split("-")
      : acc?.size;
    return ele + Number(price[1] || price);
  }, 0);

  return (
    <div className="bg-white z-10 shadow-lg fixed top-0 w-full py-4">
      <div className="flex justify-between items-center px-4 md:px-10">
        <Link href="/" className="w-[30%] flex justify-center">
          <Image
            src={logo}
            className="bg-white xl:hidden"
            alt="logo"
            width={40}
          />
        </Link>
        <ul className="md:hidden flex justify-end gap-4 items-center w-[70%]">
          {isUserLoggedIn ? (
            <Link href="/profile?tab=1">
              <div className="flex items-center gap-2 text-black">
                <FaRegUser size={25} aria-label="User Profile" />
                {userData?.firstName} {userData?.lastName}
              </div>
            </Link>
          ) : (
            <li className="px-1 md:border-r-2 md:border-red-600 h-[70px] flex items-center text-xs sm:text-sm md:pr-8 md:text-lg">
              <Link href="/signUp">Sign in / Register</Link>
            </li>
          )}
          <Link
            href={"/order/cart"}
            className="flex items-center text-xs sm:text-sm md:pr-8 md:text-lg"
          >
            <IoBagHandleOutline size={25} aria-label="Cart" />
            <span className="bg-gray-500 rounded-full px-2 mx-2">
              {cart?.length}
            </span>
            <span>£{totalPrice?.toFixed(2)}</span>
          </Link>
        </ul>
      </div>
      <div className="bg-white flex flex-col md:flex-row justify-between md:items-center px-4 md:px-10">
        <Link href="/" className="hidden xl:flex xl:items-center">
          <Image src={logo} className="bg-white" alt="logo" width={80} />
        </Link>
        <ul className="flex flex-wrap items-center justify-around xl:pl-24 text-lg sm:text-xl text-white font-semibold w-full lg:w-[90vw] lg:mx-5 lg:ml-20">
          <Link href={`/menu/deals`}>
            <li
              className={`px-5 trac h-[36px] md:h-[56px] flex items-center text-black transition duration-300 ${
                selecteditem === -1
                  ? "bg-red-800 text-white hover:text-white"
                  : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
              }`}
              onClick={() => setSelectedItem(-1)}
            >
              Deals
            </li>
          </Link>

          {Array.isArray(categoryEnum) &&
            categoryEnum.map((data, idx) => (
              <Link href={`/menu/${data?.toLocaleLowerCase()}`} key={idx}>
                <li
                  className={`px-5 trac h-[36px] md:h-[56px] flex items-center text-black transition duration-300 ${
                    selecteditem === idx
                      ? "bg-red-800 text-white hover:text-white"
                      : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
                  }`}
                  onClick={() => setSelectedItem(idx)}
                >
                  {data.slice(0, 1)}
                  {data.slice(1, data.length).toLowerCase()}
                </li>
              </Link>
            ))}

          {isUserLoggedIn ? (
            <Link
              href="/profile?tab=1"
              className="hidden md:flex items-center gap-2 text-black"
            >
              <FaRegUser size={20} aria-label="User Profile" />
              <span className="text-base text-red-800">
                {userData?.firstName} {userData?.lastName}
              </span>
            </Link>
          ) : (
            <li className="hidden md:flex p-2 font-normal hover:bg-white hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md hover:text-red-800 text-white bg-red-800 items-center text-lg">
              <Link href="/signUp">Login / Signup</Link>
            </li>
          )}
          <Link
            href={"/order/cart"}
            className="hidden text-black md:flex items-center text-lg"
          >
            <IoBagHandleOutline size={25} aria-label="Cart" />
            <span className="bg-red-800 text-white rounded-full px-2 mx-2">
              {cart?.length}
            </span>
            <span className="text-red-800">£ {totalPrice?.toFixed(2)}</span>
          </Link>
        </ul>
      </div>

      <div className="hidden lg:flex absolute top-full left-[90%] transform -translate-x-1/2 gap-[2px]">
        <a
          href="#"
          className="inline-flex items-center bg-red-800 border-white text-white py-2 px-4 text-lg rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <MdDeliveryDining />
          <span className="ml-2">Delivery</span>
        </a>
        <a
          href="#"
          className="inline-flex items-center bg-red-800 text-white py-2 px-4 text-lg rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <FaShop />
          <span className="ml-2">Collection</span>
        </a>
      </div>
      <div className="lg:hidden mb-2 flex gap-2 justify-center mt-3">
        <a
          href="#"
          className="inline-flex items-center bg-red-800 text-white py-2 px-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <MdDeliveryDining />
          <span className="ml-2">Delivery</span>
        </a>
        <a
          href="#"
          className="inline-flex items-center bg-red-800 text-white py-2 px-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <FaShop />
          <span className="ml-2">Collection</span>
        </a>
      </div>
    </div>
  );
};

export default Header;
