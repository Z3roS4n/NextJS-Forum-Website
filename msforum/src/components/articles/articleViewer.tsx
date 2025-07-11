import { Article_Category_Author } from "@/types/components";

import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

interface Params {
    article: Article_Category_Author
}

const ArticleViewer = ({ article }: Params) => {
    
    return (
        <div className="border-2 p-4 rounded-2xl">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({ node, ...props }) => 
                        <img
                            {...props}
                            className="max-w-xs h-auto mx-auto rounded-md"
                            alt={props.alt || "image"}
                        />
                    }}
            >
                {article.content}
            </ReactMarkdown>
        </div>
    );
}

export default ArticleViewer;