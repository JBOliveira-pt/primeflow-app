"use client";

import { useEffect, useState } from "react";
import { formatCurrencyPTBR } from "@/app/lib/utils";

interface PriceRangeSliderProps {
    min: number;
    max: number;
    defaultMin?: number;
    defaultMax?: number;
    step?: number;
}

export default function PriceRangeSlider({
    min,
    max,
    defaultMin = min,
    defaultMax = max,
    step = 0.01,
}: PriceRangeSliderProps) {
    const [minValue, setMinValue] = useState(defaultMin);
    const [maxValue, setMaxValue] = useState(defaultMax);

    useEffect(() => {
        setMinValue(defaultMin);
        setMaxValue(defaultMax);
    }, [defaultMin, defaultMax]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = parseFloat(e.target.value);
        if (newMin <= maxValue) {
            setMinValue(newMin);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = parseFloat(e.target.value);
        if (newMax >= minValue) {
            setMaxValue(newMax);
        }
    };

    const getPercentage = (value: number): number => {
        return ((value - min) / (max - min)) * 100;
    };

    return (
        <div className="space-y-4">
            <div className="relative pt-6">
                {/* Track background */}
                <div className="absolute top-9 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-700 rounded-full pointer-events-none" />

                {/* Active range highlight */}
                <div
                    className="absolute top-9 h-2 bg-blue-600 rounded-full pointer-events-none"
                    style={{
                        left: `${getPercentage(minValue)}%`,
                        right: `${100 - getPercentage(maxValue)}%`,
                    }}
                />

                {/* Min slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 top-9 pointer-events-none appearance-none bg-transparent rounded-full cursor-pointer accent-blue-600 z-10"
                    style={
                        {
                            WebkitAppearance: "none",
                        } as React.CSSProperties
                    }
                />

                {/* Max slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 top-9 pointer-events-none appearance-none bg-transparent rounded-full cursor-pointer accent-blue-600"
                    style={
                        {
                            WebkitAppearance: "none",
                        } as React.CSSProperties
                    }
                />
            </div>

            {/* Display values */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <input type="hidden" name="amountMin" value={minValue} />
                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Mínimo
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrencyPTBR(minValue)}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <input type="hidden" name="amountMax" value={maxValue} />
                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Máximo
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrencyPTBR(maxValue)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
