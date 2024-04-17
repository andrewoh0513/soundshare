import { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

const SBCDNURL = "https://jcsfmlmjvoopwbgjtraq.supabase.co/storage/v1/object/public/sounds/"

function App() {
  const [ email, setEmail ] = useState("");
  const [ sounds, setSounds ] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getSounds() {
    const { data, error } = await supabase
      .storage
      .from('sounds')
      .list(user?.id + "/", {
        limit: 10,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });

      if(data !== null) {
        setSounds(data);
      } else {
        alert("Error loading sounds");
        console.log(error);
      }
  }

  useEffect(() => {
    if(user) {
      getSounds();
    }
  }, [user]);

  async function LinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    });
    if(error) {
      alert("Error communicating with supabase, make sure to use a real email address.");
    } else {
      alert("Check your email for a Link to log in!");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadSound(e) {
    let file = e.target.files[0];

    const { data, error } = await supabase
      .storage
      .from('sounds')
      .upload(user.id + "/" + uuidv4(), file)

    if(data) {
      getSounds();
    } else {
      console.log(error);
    }
  }

  async function deleteSound(soundName) {
    const { error } = await supabase
      .storage
      .from('sounds')
      .remove([ user.id + "/" + soundName])
    
    if(error) {
      alert(error);
    } else {
      getSounds();
    }
  }

  return (
    <Container align="center" className='container-sm mt-4'>
      {

      }
      { user === null ?
        <>
          <h1>loginpage</h1>
          <Form>
            <Form.Group className='mb-3' style={{maxWidth: "500px"}}>
              <Form.Label>Enter Email to get started</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter Email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant='primary' onClick={() => LinkLogin()}>
              Get link
            </Button>
          </Form>
        </>

      :
        <>
          <h1>Loggedin</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>{user.email}</p>
          <p>Use the Choose File button below to upload an sound to your gallery</p>
          <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
            <Form.Control type="file" accept=".mp3,audio/*" onChange={(e) => uploadSound(e)}/>
          </Form.Group>
          <hr />
          <h3>Your sounds</h3>
          <Row xs={1} md={3} className="g-4">
            {sounds.map((sound) => {
              return (
                <Col key={SBCDNURL + user.id + "/" + sound.name}>
                  <Card>
                    <audio controls>
                      <source src={SBCDNURL + user.id + "/" + sound.name}/>
                    </audio>
                    <Card.Body>
                      <Button variant="danger" onClick={() => deleteSound(sound.name)}>Delete sound</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      }
    </Container>
  );
}

export default App;
