"use client"

import { Category } from "@/generated/prisma";
import Select from "react-select";

interface SelectCompParams {
    categories: Category[];
    onCategorySelection: (categoryId: number) => void;
}

const SelectComponent = ({ categories, onCategorySelection }: SelectCompParams) => {
    const options = [
        { label: 'All Categories', value: 0 },
        ...categories.map((cat) => ({
        label: cat.name,
        value: cat.idcat,
        })),
    ]

    const handleChange = (selectedOption: any) => {
        const selectedValue = selectedOption?.value ?? 0;
        onCategorySelection(selectedValue);
    };


    return (
        <Select
            placeholder="Categories..."
            theme={
                (theme) => ({
                    ...theme,
                    colors: {
                    ...theme.colors,
                    primary: '#2E3192',           // blu (equivalente a Tailwind `blue-500`)
                    primary25: '#D4E2FF',         // hover: bg-blue-100
                    primary50: '#FFFFFF',         // selected: bg-blue-200
                    },
                })
            }
            defaultValue={options[0]}
            styles={{
                control: (provided) => ({
                    ...provided,
                    borderRadius: '1em',
                }),
            }}
            classNames={{
                control: () => 'rounded-2xl border-1 p-0.5 lg:w-70 hover:shadow-md focus:outline-none',
                option: ({ isFocused }) =>
                    isFocused ? 'bg-gray-100 text-black p-2 w-1/1 outline-none' : 'bg-white text-black p-2',
            }}
            options={options}
            onChange={handleChange}
        />
    );
}

export default SelectComponent;