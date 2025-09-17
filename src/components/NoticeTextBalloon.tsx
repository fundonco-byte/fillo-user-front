import React from "react";
import {} from "framer-motion";

export interface NoticeTextBalloonProps {
  isOpen: boolean;
  text: string;
}

export const NoticeTextBalloon = ({ isOpen, text }: NoticeTextBalloonProps) => {
  console.log(isOpen);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
           opacity-0 scale-90 pointer-events-none
           transition-all duration-300 ease-out 
           group-active:opacity-100 group-active:scale-100 group-active:translate-y-[-0.5rem]"
    >
      <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
};
