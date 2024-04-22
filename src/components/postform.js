import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@material-tailwind/react";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_ANON_KEY
);

export default function PostForm({onPost}) {
    const [uploads, setUploads] = useState([]);
    const [content, setContent] = useState('');
    const [isUploading,setIsUploading] = useState(false);

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    function handleUpload() {
        supabase.from('posts').insert({
          content,
          sounds: uploads,
        }).then(response => {
          if (!response.error) {
            setContent('');
            setUploads([]);
            if (onPost) {
              onPost();
            }
          }
        })
        .finally(() => {
            setIsUploading(false);
        });
      }

    async function addsounds(ev) {
        const files = ev.target.files;
        if (files.length > 0) {
        setIsUploading(true);
        for (const file of files) {
            const newName = Date.now() + uuidv4();
            const result = await supabase
                .storage
                .from('sounds')
                .upload(newName, file);
            if (result.data) {
                const url = process.env.REACT_APP_SUPABASE_URL + '/storage/v1/object/public/sounds/' + result.data.path;
                setUploads(prevUploads => [...prevUploads, url]);
            } else {
                console.log(result);
            }
        }
        setIsUploading(false);
    }
}
    return (
        <div>
            <input
                className='focus:outline-none p-2 rounded-md w-full mr-4'
                type="Content"
                value={content}
                onChange={handleContentChange}
                placeholder="Enter your description here"
            />
            <Button className='float-right mt-6' onClick={handleUpload} disabled={uploads.length === 0 || isUploading}>Share</Button>
        <div className='w-4/5 inline-flex mt-2'>
        <div className='mt-4 p-1 bg-gray-200 hover:bg-gray-300 rounded-lg'>
                <label>
                    <input type='file' className='hidden' onChange={addsounds} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                </label>
            </div>
            <div className='mt-2 ml-4'>
            {uploads.length === 0 && (
                <p className="text-red-800 mt-3 border-b-2 border-red-700 w-full">File required</p>
            )}
            {uploads.length > 0 && (
                <div className="flex gap-2">
                    {uploads.map((upload, index) => (
                        <audio key={index} controls>
                            <source src={upload} alt="" className="w-auto h-24 rounded-md" />
                        </audio>
                    ))}
                </div>
            )} 
            </div>
        </div>
            {isUploading && (
            <div className="flex justify-center">uploading...</div>
        )}
        
        </div>
    );
};