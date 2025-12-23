import React from "react";

const EditIcon = () => {
  return (
    <div
      aria-label="button for edit item"
      className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-blue-light-6 hover:border-blue-light-4 hover:text-blue"
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
          d="M14.2218 2.71967C14.7931 2.14837 15.7202 2.14837 16.2915 2.71967L19.2803 5.70845C19.8516 6.27975 19.8516 7.20688 19.2803 7.77818L8.56302 18.4954C8.3418 18.7166 8.06445 18.8734 7.76089 18.9498L3.62422 20.0002C3.36527 20.066 3.09126 19.9902 2.90192 19.8008C2.71258 19.6115 2.63679 19.3375 2.70255 19.0786L3.75296 14.9419C3.82933 14.6383 3.98615 14.361 4.20737 14.1397L14.2218 2.71967ZM15.2567 3.75457L4.99993 14.0113L4.24693 17.002L7.23763 16.249L17.4944 5.99227L15.2567 3.75457Z"
          fill=""
        />
      </svg>
    </div>
  );
};

export default EditIcon;
