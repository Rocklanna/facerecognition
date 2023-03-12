import React from 'react'
import Tilt from 'react-parallax-tilt';
import faceId from'./faceId.png';
import './Logo.css';

const Logo = () =>{
	return(
		<div className='ma4 mt0'>
		 	<Tilt  className="Tilt br2 shadow-2" options ={{max:55}}style={{ height: '150px', width:'150px'}}>
      			<div className="Tilt-inner pa3">
        			<img alt='logo' src={faceId} style={{paddingTop:"5px"}}/>
      			</div>
    		</Tilt>
		</div>

	)
}




export default Logo
