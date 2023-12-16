import React, { useEffect, useState } from 'react'
import Content from './components/Content'

const App = () => {


  const [width,setWidth] = useState(600)
  const [height,setHeight] = useState(600)

  useEffect(()=>{
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // Subtract 7rem from the total width
    const newAdjustedWidth = screenWidth - 8 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    // Subtract 7rem from the total height
    const newAdjustedHeight = screenHeight - 7 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Update the state with the new adjusted height
    setHeight(newAdjustedHeight);

    setWidth(newAdjustedWidth)

  },[])

  return <Content width={width} height={height} />
}

export default App
