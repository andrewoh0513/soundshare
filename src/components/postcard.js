import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card } from "@material-tailwind/react";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_ANON_KEY
);

const PostCard = ({ content, sounds }) => {
    
    useEffect(() => {
        fetchPosts();
    }, []);
    
    const fetchPosts = async () => {
        try {
            // eslint-disable-next-line no-unused-vars
            const { data: postsData, error } = await supabase.from('posts').select('content, sounds');
            if (error) {
                console.error('Error fetching posts:', error.message);
                return;
            }
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(sounds);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'sound';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading sound:', error.message);
        }
    };

    return (
        <div>
            <Card className="p-4 m-4 bg-gray-300">
                <div className='w-full grid grid-cols-2'>
                    <div className='w-full border-b-2 mb-2 pl-2 font-semibold text-black'>
                        <p>{content}</p>
                    </div>
                    <div className="ml-auto w-8 mb-5">
                        <label>
                            <button className='hidden' color="blue-200" onClick={handleDownload}></button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </label>
                    </div>
                </div>
                <div>
                    <audio className='w-full mt-2' controls>
                        <source src={sounds} alt=""/>
                    </audio>
                </div>
            </Card>
        </div>
    );
};

export default PostCard;