import React from "react";

export default function Gauge({ value = 0, min = 0, max = 300, onClick }) {
    const percent = ((value - min) / (max - min)) * 100;
    const rotation = (percent / 100) * 180;

    return (
        <div className="w-full flex flex-col items-center justify-center">

            <h2 className="text-lg font-semibold mb-3">
                Real-Time Sensor Value
            </h2>

            <div
                className="relative w-52 h-28 cursor-pointer"
                onClick={() => {
                    if (onClick) onClick(value);
                }}
            >
                {/* Grey Background Arc */}
                <div className="absolute w-full h-full border-[12px] border-gray-200 rounded-t-full border-b-0"></div>

                {/* Green Arc */}
                <div
                    className="absolute w-full h-full border-[12px] border-green-500 rounded-t-full border-b-0 origin-bottom"
                    style={{ transform: `rotate(${rotation}deg)` }}
                ></div>

                {/* Pointer */}
                <div className="absolute left-1/2 top-[86%] w-4 h-4 bg-gray-500 rounded-full transform -translate-x-1/2"></div>
            </div>

            {/* Value */}
            <div className="text-3xl font-bold mt-4">
                {value} V
            </div>
        </div>
    );
}
