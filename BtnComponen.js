import React, {useState} from 'react';
// import DisplayComponent from './Components/DisplayComponent';
// import BtnDisplayComponent from './Components/BtnComponen';


function BtnComponen(props) {


  return (
    <div>
        {(props.status === 0)?
          <button className="stopwatch-btn stopwatch-btn-gre"
          onClick={props.start}>Start</button> : ""
        }

        {(props.status === 1)?
          <div>
            <button className="stopwatch-btn stopwatch-btn-red"
                    onClick={props.stop}>Stop</button> 
            <button className="stopwatch-btn stopwatch-btn-yel"
                    onClick={props.reset}>Reset</button> 
          </div> : ""
        }
        
        {(props.status === 2)?
          <div>
            <button className="stopwatch-btn stopwatch-btn-gre"
                    onClick={props.resume}>Resume</button> 
            <button className="stopwatch-btn stopwatch-btn-yel"
                    onClick={props.reset}>Reset</button> 
          </div> : ""
        }


    </div>
  );
}

export default BtnComponen;