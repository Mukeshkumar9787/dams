import React from "react";

const AvailableStock = ({ stock= 0, small=false }) => {
    const isInStock = stock > 0;
    return (
        <div className="min-h-[28px]">
            <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isInStock ? "bg-green/10 text-green" : "bg-red/10 text-red"
                }`}
            >
                <span className={`h-2 w-2 rounded-full ${isInStock ? "bg-green" : "bg-red"}`} />
                <span className={`${small && "text-sm"}`}>
                    {isInStock ? `${stock} Available` : "Out of Stock"}
                </span>
            </div>
        </div>
    );
};

export default AvailableStock;
