import React, { Component } from'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageForm from './components/ImageForm/imageForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './App.css';


const particlesOptions ={
                  particles: {
                    color: {
                        value: "#000",
                    },
                    links: {
                        color: "#000",
                        distance: 150,
                        enable: true,
                        opacity: 0,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 300,
                    },
                    opacity: {
                        value: 0,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
           
}


const intialState = {
    input:'',
    imgUrl:'',
    box:[],
    route:'signin',
    isSignedIn: false,
    user:{
        'id':'',
        'name':'',
        'email':'',
        'entries':0,
        'joined' : ""
    }
  }   

class App extends Component {

constructor(){
  super();
  this.state ={
    input:'',
    imgUrl:'',
    box:[],
    route:'signin',
    isSignedIn: false,
    user:{
        'id':'',
        'name':'',
        'email':'',
        'entries':0,
        'joined' : ""
    }
  }
}

componentDidMount(){
    fetch('http://localhost:3001/')
        .then(response=>response.json())
        .then(data=>console.log(data))
}

loadUser = (data)=>{
    this.setState({user:{
        'id':data.id,
        'name':data.name,
        'email':data.email,
        'entries':data.entries,
        'joined' : data.joined
    }})
}
calculateFaceLocation = (data)=>{
 
 
    const clarifaiFaces = data.outputs[0].data.regions;

    const faceArray = clarifaiFaces.map(item=>{
     return item.region_info.bounding_box;
    }) 

    const image =document.getElementById('inputimage');
    const width = Number(image.width)
    const height = Number(image.height)    
    const facesLocations = faceArray.map(item=>{
           return {
            leftCol: item.left_col * width,
            topRow: item.top_row * height,
            rightCol: width - (item.right_col * width),
            bottomRow: height - (item.bottom_row * height) ,
           
           }
       })
         
          return facesLocations

}


setFaceBoxCord = (box)=>{
      this.setState({box:box})
     
}

onInputChange= (event) =>{
  this.setState({input:event.target.value})
}

onRouteChange =(route)=>{
    if(route ==='signout'){
      this.setState(intialState)
    }
    else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
}

onButtonSubmit =()=>{
   this.setState({imgUrl:this.state.input})

   fetch("http://localhost:3001/image",{
                    method:'post',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        input:this.state.input
                    })
    })  
    .then(response => response.json())  
    .then((result)=>{
               if(result){
                fetch("http://localhost:3001/image",{
                    method:'put',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        id:this.state.user.id
                    })
                })
                .then(response=>response.json())
                .then(count=>{
                    this.setState(Object.assign(this.state.user,{entries:count}))   
                    })         
                }
             

            this.setFaceBoxCord(this.calculateFaceLocation(result))
    })
    .catch(error => console.log('error', error));            
 }   



render(){

   const {isSignedIn, imgUrl,box,route} = this.state;
  return (
    <div className="App">
    {/*<Particles className="particles" id="tsparticles" url="http://foo.bar/particles.json" init={particlesInit} loaded={particlesLoaded} options={particlesOptions} />*/}
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route==='home' 
       ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imgUrl={imgUrl}/>
          </div> 
        :(
          route==='signin' 
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
      }  
    </div>
  );
}
}

export default App;
