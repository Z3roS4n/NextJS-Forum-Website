interface BoxLabeledTextParams {
    head: string;
    children: React.ReactNode;
}

const BoxLabeledText = ({head, children}: BoxLabeledTextParams) => {
    return (
        <>
            <div className="flex flex-col items-center rounded-xl border p-4 text-center bg-white shadow-sm w-1/2">
                <p className="font-semibold text-gray-700 text-sm">{head}</p>
                <p className="text-xl font-bold text-black">{children}</p>    
            </div>  
        </>
    )
}

export default BoxLabeledText;