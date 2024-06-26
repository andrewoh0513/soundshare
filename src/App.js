import './App.css';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { Auth } from '@supabase/auth-ui-react';
import { Button } from "@material-tailwind/react";
import Toptracks from './components/Toptracks';
import PostForm from './components/postform';
import PostCard from './components/postcard';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
);

document.body.style = 'background: #8DAA9D;';

function App() {
  const [posts,setPosts] = useState([]);
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  
  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user !== null) {
        setUserId(user.id);
      } else {
        setUserId('');
      }
    } catch (e) {
      console.error('Error getting user:', e.message);
    }
  };
  
  const signout = async () => {
    setUserId('');
    await supabase.auth.signOut();
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase.from('posts').select('id, content, sounds').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error.message);
        return;
      }
      if (postsData) {
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setUserId(session?.user?.id || '');
      }
    );
    getUser();
    fetchPosts();
  }, []);


  return (
    <>
      {!user && (
        <div className='text'>
          <h2 className='text-center absolute w-full text-3xl font-semibold'>Get into Public Noise</h2>
          <div className='inputlabel'>
            <p className='email'>Email Address</p>
            <p className='password'>Password</p>
          </div>
        </div>
      )}
      {userId === '' ? 
        <Auth
          supabaseClient={supabase}
          localization={{
            variables: {
              forgotten_password: {
                email_label: '',
                password_label: '',
                email_input_placeholder: '',
                password_input_placeholder: '',
              },
              sign_up: {
                email_label: '',
                password_label: '',
                email_input_placeholder: '',
                password_input_placeholder: '',
              },
              sign_in: {
                email_label: '',
                password_label: '',
                email_input_placeholder: '',
                password_input_placeholder: '',
              },
            },
          }}
          appearance={{
            extend: false,
            className: {
              anchor: 'anchor',
              button: 'btn',
              container: 'container',
              divider: 'divider',
              label: 'label',
              input: 'input',
              loader: 'loader',
              message: 'message',
            },
          }}
          providers={[]}
        /> 
        : 
        <>
          <div className='text-3xl  position-relative mt-10 mb-4 font-bold ml-32 text-white'>
            <h2>PUBLIC NOISE</h2>
          </div>
        <div className='mx-28 flex'>
          <div className='w-1/3 h-80'>
              <div className='m-4'>
                <ul>
                  <li className='border-2 border-gray-500  pl-8 bg-gray-200 mb-6 p-7 py-10 hover:bg-gray-400 rounded-lg shadow-md font-semibold'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokWidth="1.5" stroke="currentColor" className="w-6 h-6 float-left mr-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Home</li>
                  <li><Button className='shadow-md mb-3 p-8 w-full bg-gray-900' onClick={signout}>
                    Logout
                  </Button></li>
                </ul>
              </div>
                  <Toptracks />
            </div>
            <div className='w-2/3'>
              <div className='border-2 border-gray-500 shadow-md bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg mb-6 p-7 m-4'>
                <PostForm onPost={fetchPosts} />
              </div>
              <p className='mx-8 text-xl font-semibold text-white border-b-2 border-gray-200'>Feed</p>
                {posts?.length > 0 && posts.map(post => (
                <PostCard key={post.id} {...post} />
                ))}
            </div>
          </div>
        </>
      }
    </>
  );
}

export default App;