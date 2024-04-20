import { Button } from "@material-tailwind/react";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=b45aa840d24945f296114fabf2cf3cf9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


const Spotifycont = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  return code ?
    <div code={code}>
      <a href={AUTH_URL}>
        <Button color="green">login to spotify</Button>
      </a>
    </div>
    :
    <div>
      logged in
    </div>
    ;
};
export default Spotifycont;