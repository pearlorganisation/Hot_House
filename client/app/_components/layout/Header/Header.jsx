"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { RiRefreshFill } from "react-icons/ri";
import logo from "../../../_assets/images/HOTPIZZALOGO.jpg";
import { categoryEnum } from "@/app/utils/utils";
import { useAppSelector } from "@/app/lib/hooks";

const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const cart = useAppSelector((state) => state.cart.cartData);
  const { userData, isUserLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPrice = cart?.reduce((acc, item) => acc + Number(item?.price), 0);

  if (!isMounted) {
    return null; // Render nothing until the component has mounted
  }

  return (
    <div className="bg-white z-10 shadow-lg fixed top-0 w-full pt-2 md:pt-4 md:py-4">
      {/* Mobile */}
      <div className="flex justify-between items-center mx-1 md:mx-4">
        <Link href="/" className="flex justify-center">
          <Image src={logo} className="bg-white lg:hidden" alt="logo" width={40} />
        </Link>
        <ul className="lg:hidden flex gap-4 items-center">
          {isUserLoggedIn ? (
            <Link href="/profile?tab=1">
              <p className="flex items-center gap-2 text-green-950">
                <FaRegUser size={19} aria-label="User Profile" />
                <span className="text-red-800 text-sm font-semibold">
                  {userData?.firstName} {userData?.lastName}
                </span>
              </p>
            </Link>
          ) : (
            <li className="px-2 py-1 text-white font-semibold bg-red-800 rounded-md flex items-center text-xs">
              <Link href="/login">Login / Signup</Link>
            </li>
          )}
          <Link href="/order/cart" className="flex items-center text-base">
            <IoBagHandleOutline size={22} aria-label="Cart" />
            <span className="bg-red-800 text-sm text-white rounded-full px-[6px] py-[1px] mx-2">
              {cart?.length}
            </span>
            <span className="text-red-800 font-semibold">
              <span className="text-sm">£ </span>{totalPrice?.toFixed(2)}
            </span>
          </Link>
        </ul>
      </div>

      {/* Desktop */}
      <div className="bg-white flex flex-col lg:flex-row justify-between lg:items-center lg:px-10">
        <Link href="/" className="hidden lg:flex lg:flex-col justify-center h-full">
          <Image src={logo} className="bg-white hidden lg:block" alt="logo" width={80} height={80} />
        </Link>
        <ul className="flex lg:pt-0 flex-wrap items-center justify-around text-base sm:text-lg text-white font-semibold xl:gap-10">
          <Link href="/menu/deals">
            <li
              className={`py-2 px-1 mt-2 lg:mt-0 lg:px-5 lg:h-[56px] flex items-center text-green-800 transition duration-300 ${
                selectedItem === -1 ? "bg-red-800 text-white hover:text-white" : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
              }`}
              onClick={() => setSelectedItem(-1)}
            >
              Deals
            </li>
          </Link>
          {Array.isArray(categoryEnum) &&
            categoryEnum.map((data, idx) => (
              <Link href={`/menu/${data?.toLowerCase()}`} key={idx}>
                <li
                  className={`px-1 mt-2 lg:mt-0 lg:px-5 py-2 lg:h-[56px] flex items-center text-green-800 transition duration-300 ${
                    selectedItem === idx ? "bg-red-800 text-white hover:text-white" : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
                  }`}
                  onClick={() => setSelectedItem(idx)}
                >
                  {data.slice(0, 1)}
                  {data.slice(1).toLowerCase()}
                </li>
              </Link>
            ))}
        </ul>
        <div className="flex items-center gap-5">
          {isUserLoggedIn ? (
            <Link href="/profile?tab=1" className="hidden lg:flex items-center gap-2 text-black">
              <FaRegUser size={20} aria-label="User Profile" />
              <span className="text-base text-red-800 hover:text-red-700 hover:font-bold">
                {userData?.firstName} {userData?.lastName}
              </span>
            </Link>
          ) : (
            <li className="hidden lg:flex px-2 font-normal hover:bg-white hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md hover:text-red-800 text-white bg-red-800 items-center text-lg">
              <Link href="/login">Login / Signup</Link>
            </li>
          )}
          <Link href="/order/cart" className="hidden text-black lg:flex items-center text-lg">
            <IoBagHandleOutline size={25} aria-label="Cart" />
            <span className="bg-red-800 hover:bg-red-700 text-white rounded-full px-2 mx-2">
              {cart?.length}
            </span>
            <span className="text-red-800 hover:text-red-700 hover:font-bold">£ {totalPrice?.toFixed(2)}</span>
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex absolute top-full left-[82%] xl:left-[87%] transform -translate-x-1/2 gap-[2px]">
        <a
          href="/profile?tab=3"
          className="inline-flex items-center bg-red-800 border-white text-white py-2 px-4 text-lg rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <RiRefreshFill size={30} />
          <span className="ml-2">Reorder Now</span>
        </a>
      </div>

      <div className="lg:hidden flex justify-center">
        <a
          href="/profile?tab=3"
          className="w-full border-r border-r-white justify-center inline-flex items-center bg-red-800 text-white py-2 px-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <RiRefreshFill size={25} />
          <span className="pl-2">Reorder Now</span>
        </a>
      </div>
    </div>
  );
};

export default Header;
