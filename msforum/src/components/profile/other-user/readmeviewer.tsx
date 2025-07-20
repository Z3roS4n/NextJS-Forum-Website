"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface UserStatsParams {
    content: string
}

const ReadMeViewer = ({ content }: UserStatsParams) => {
    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                    img: ({ node, ...props }) => 
                        <img
                            {...props}
                            className="mt-2 max-w-xs h-auto rounded-md"
                            alt={props.alt || "image"}
                        />,
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-base mb-2" {...props} />,
                }}
                >
                {content}
            </ReactMarkdown>
        </>
    );
}

export default ReadMeViewer;