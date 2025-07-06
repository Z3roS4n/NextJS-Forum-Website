"use client"

import { Article } from "@/app/articles/page";
import { useState } from "react";

interface Params {
    cat: number;
}

const SelectOpt = ({ cat }: Params) => {
    const [state, setState] = useState<number>(0);

    //const articles = await fetch
    return (
        <select title="cat" name="cat" id="cat" onChange={(e) => setState(Number(e.target.value))}>
            <option value="0">All Cat</option>
            <option value="1">Cat 1</option>
            <option value="2">Cat 2</option>
        </select>
    )
}

export default SelectOpt;