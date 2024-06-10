import React from "react";
import { useRef } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import SizeAndBasesModal from "../../../../../../components/FoodCustomizationDialog/SizeAndBasesModal";

const SizeContainer = () => {
  const modalRef = useRef();
  function handleModalOpen() {
   
    modalRef.current.open();

  }

  return (
    <>
    <SizeAndBasesModal ref={modalRef} itemName="Size" />
    <div className="sizeContainer flex flex-col">
      <div className="flex justify-between p-2">
        <h3 className="text-red-500 font-bold tracking-widest text-lg">
          Size :
        </h3>
        <div>
          <IoMdAddCircleOutline size={30} className="cursor-pointer" onClick={handleModalOpen}/>
        </div>
      </div>
      <div className="p-2 gap-2">
        <div className="sizeList p-3 border shadow-md bg-white border-gray-400 rounded-lg"></div>
      </div>
    </div>
    </>
    
  );
};

export default SizeContainer;
