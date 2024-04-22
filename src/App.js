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

document.body.style = 'background: #AEC2B9;';

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
          <div className='text-3xl  position-relative mt-10 mb-4 font-bold ml-32'>
            <h2>PUBLIC NOISE</h2>
          </div>
        <div className='mx-28 flex'>
          <div className='w-1/3 h-80'>
              <div className='m-4 rounded-xl'>
                <ul>
                  <a><li className='bg-gray-300 mb-6 p-7 text-center hover:bg-gray-400 rounded-xl shadow-md font-semibold'>Home</li></a>
                  <li><Button className='shadow-md mb-3 p-8 w-full bg-gray-600' onClick={signout}>
                    Logout
                  </Button></li>
                </ul>
              </div>
                  <Toptracks />
            </div>
            <div className='w-2/3'>
              <div className='shadow-md bg-gray-300 rounded-xl mb-6 p-7 m-4'>
                <PostForm onPost={fetchPosts} />
              </div>
              <p className='mx-8 text-xl font-semibold'>Feed</p>
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