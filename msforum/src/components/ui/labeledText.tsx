interface LabeledTextParams {
    head: string;
    children: React.ReactNode;
}

const LabeledText = ({head, children}: LabeledTextParams) => {
    return (
        <>
            <div className="flex flex-col items-center">
                <span className="block text-gray-500">{head}</span>
                <span className="font-medium text-lg text-wrap break-all text-center">{children}</span>   
            </div>
        </>
    )
}

export default LabeledText;