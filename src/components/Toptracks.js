import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Toptracks = () => {
    const [selectedCountry, setSelectedCountry] = useState('United States');
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const countries = [
      'United States',
      'United Kingdom',
      'Canada',
      // Add more countries as needed
    ];
  
    const handleCountryChange = (event) => {
      setSelectedCountry(event.target.value);
    };
  
    useEffect(() => {
      const fetchTopTracksByCountry = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
              method: 'geo.gettoptracks',
              country: selectedCountry,
              api_key: 'e8c7492987473e27ea65820111f271ba',
              format: 'json'
            }
          });
          setTopTracks(response.data.tracks.track.slice(0, 10));
        } catch (error) {
          console.error('Error fetching top tracks by country:', error);
        }
        setLoading(false);
      };
  
      if (selectedCountry) {
        fetchTopTracksByCountry();
      }
    }, [selectedCountry]);
  
    return (
      <div>
        <div className='shadow-md bg-gray-300 m-4 rounded-xl p-5 pr-9 mb-8'>
        <h1 className='m-2'>Top Tracks by Country</h1>
        <select className='focus:outline-none rounded-xl w-full m-2' value={selectedCountry} onChange={handleCountryChange}>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        </div>
        <div className='shadow-md rounded-xl bg-gray-300 m-4 py-4'>
        <div className='max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 pr-6'>
                <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {topTracks.map(track => (
              <li className='pl-7 my-5' key={track.name}>{track.name} by {track.artist.name}</li>
            ))}
          </ul>
        )}
        </div>
        </div>
        </div>
      </div>
    );
};

export default Toptracks;