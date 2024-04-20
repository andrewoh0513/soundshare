import './App.css';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { Auth } from '@supabase/auth-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@material-tailwind/react";
import Spotifycont from './components/spotifycont';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=b45aa840d24945f296114fabf2cf3cf9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
);

document.body.style = 'background: #f5f5f5;';

function App() {

  const [media, setMedia] = useState([]);
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

  async function uploadSound(e) {
    let file = e.target.files[0];

    const { data, error } = await supabase
      .storage
      .from('sounds')
      .upload(uuidv4(), file);

    if (data) {
      console.log('File uploaded successfully:', data);
      getMedia();
    } else {
      console.error('Error uploading file:', error);
    }
  }

  async function getMedia() {
    const { data, error } = await supabase.storage.from('sounds').list('', {
      limit: 10,
      offset: 0,
      sortBy: {
        column: 'name', order: 'asc'
      }
    });

    if (data) {
      setMedia(data);
    } else {
      console.error('Error getting media:', error);
    }
  }

  const code = new URLSearchParams(window.location.search).get('code');

  const signout = async () => {
    setUserId('');
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setUserId(session?.user?.id || '');
      }
    );
    getUser();
    getMedia();
  }, [userId]);

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
          <input type="file" onChange={(e) => uploadSound(e)} />
          <div className='mt-5'>
            This is Public Noise
          </div>
          {media.map((mediaItem) => (
            <div key={mediaItem.name}>
              <audio controls>
                <source src={`https://odzavsveqyollnpomckm.supabase.co/storage/v1/object/public/sounds/${mediaItem.name}`} />
              </audio>
            </div>
          ))}
          <div className='mt-5'>
            <button className='bg-gray-300' onClick={signout}>
              Logout
            </button>
          </div>
          <Spotifycont />
        </>
      }
    </>
  );
}

export default App;