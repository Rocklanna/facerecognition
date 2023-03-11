import React from 'react';
import './FaceRecognition.css';



const FaceRecognition = ({imgUrl, box}) =>{
		return(
		<div className='center ma'>
		 <div className='absolute mt2'>
			<img id='inputimage' alt='' src={imgUrl} width='500px' height='auto' />
			{
				box.map((item, i)=>{
					return <div key={i} className ='bounding-box' style={{top:item.topRow, right:item.rightCol, left:item.leftCol,bottom:item.bottomRow}}></div>
				})
			}
		 </div>	
		</div>


	)
}




export default FaceRecognition
