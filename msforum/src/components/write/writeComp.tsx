"use client"

import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import React, { useState, useRef } from "react";
import { Categories } from "../../app/write/page";

const WriteComp = () => {

    const editorRef = useRef<Editor>(null);

    const handleChange = () => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
        }
    };

    const onUpdate = (type: string) => {
        if(type === 'submit') {
        }
    }

    return (                    
        <>
            <Editor
                ref={editorRef}
                initialValue=""
                previewStyle="vertical" // o "tab"
                height="30em"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                onChange={handleChange}
            />
            <div className="mt-6 flex flex-col items-center">
                <div className="flex flex-row justify-center w-1/4">
                    <button 
                        onClick={() => onUpdate('submit')}
                        className="text-nowrap m-2 p-2 pl-4 pr-4 mr-0 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors delay-150"
                        type="button">
                        Submit Article
                    </button>
                    <button 
                        className="text-nowrap m-2 p-2 pl-4 pr-4 mr-0 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors delay-150"
                        type="button">
                        Save in draft
                    </button>
                </div>
            </div>
        </>
    );
}

export default WriteComp;