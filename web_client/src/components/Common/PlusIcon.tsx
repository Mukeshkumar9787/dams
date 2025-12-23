import React from "react";

const PlusIcon = () => {
  return (
    <div
      aria-label="button for add item"
      className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-green-light-6 hover:border-green-light-4 hover:text-green"
    >
      <svg
        className="fill-current"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11 3.4375C11.3797 3.4375 11.6875 3.7453 11.6875 4.125V10.3125H17.875C18.2547 10.3125 18.5625 10.6203 18.5625 11C18.5625 11.3797 18.2547 11.6875 17.875 11.6875H11.6875V17.875C11.6875 18.2547 11.3797 18.5625 11 18.5625C10.6203 18.5625 10.3125 18.2547 10.3125 17.875V11.6875H4.125C3.7453 11.6875 3.4375 11.3797 3.4375 11C3.4375 10.6203 3.7453 10.3125 4.125 10.3125H10.3125V4.125C10.3125 3.7453 10.6203 3.4375 11 3.4375Z"
          fill=""
        />
      </svg>
    </div>
  );
};

export default PlusIcon;
