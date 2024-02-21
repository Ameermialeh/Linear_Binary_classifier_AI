console.log("From BahaaFinal.js // PercHW2.js");

const canvasDraw = document.getElementById('classification-canvas'); // get canvas id

canvasDraw.width  = 500; 
canvasDraw.height = 400; 
const ctx = canvasDraw.getContext('2d');
ctx.fillStyle = "#FFFF"; // color of canvas
ctx.fillRect(0, 0, canvasDraw.width, canvasDraw.height); // draw the canvas
ctx.translate(0, canvasDraw.height);
ctx.scale(1, -1); 


const learningRate = document.getElementById('learning-rate');
const maxIteraEnter = document.getElementById('max-iterations');
const accuracy = document.getElementById('accuracy');
const startBtn = document.getElementById('startBtn');
const TestBtn = document.getElementById('TestBtn');
const dropdown = document.getElementById("myDropdown");
const classMsg = document.getElementById("class-msg");


dropdown.addEventListener("change", function() { // fn get selected color or class
  selectedColor = dropdown.value;
  // console.log("Selected Color :", selectedColor);
});



let PointsXYColour = [];
let BluePoints = [];
let RedPoints = [];
let Yd = [0,1];
let threshold = 100;
let selectedColor = 'Blue';
let LengthBinary=2;
let trainingCompleted = false;
let Finalweights;
let bluePointAbove = false;
let redPointAbove = false;
let blueLock = false;
let flagTestBtn=false;


canvasDraw.onclick = function(event) {
  let color;
  const rect = canvasDraw.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = Math.abs(event.clientY - rect.top - 400);
  if (selectedColor === "Blue") {
    color = "0000E7";
    BluePoints.push([x, y]);
  
  } else if (selectedColor === "Red") {
    color = "CC0000";
    RedPoints.push([x, y]);
    
  }

//-----------------------------------------------
  BluePoints.forEach(ele => {
    PointsXYColour.push([ele,0]);
  });

  RedPoints.forEach(ele => {
    PointsXYColour.push([ele,1]);
  });

  BluePoints = [];
  RedPoints = [];

//-----------------------------------------------

    // Draw a point at the clicked coordinates
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `#${color}`;
    ctx.fill();

    if(blueLock === true && flagTestBtn===true ) {
      console.log("ALEEEERRRT!!!");
      PointDetecter(bluePointAbove);
    }



};

function drawLine(x0, x1, y0, y1){

  ctx.beginPath();
 
  ctx.moveTo(x0, y0);

  ctx.lineTo(x1, y1);

  ctx.stroke();

 
}

document.getElementById("clearBtn").addEventListener(
  "click",
  function () {
    ctx.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    BluePoints = [];
    RedPoints = [];
    PointsXYColour = [];
    accuracy.innerHTML = '';
    classMsg.innerHTML = '';
    startBtn.disabled=false;
    trainingCompleted=false; 
    getTrainOnceCounter = 0;
    getTrainOnceFlag = false;
   flagTestBtn = false;

  },

  false
);


class Perceptron{

    constructor(learingRate, maxIteration){  // constructor
        this.learningRates = learingRate;
        this.maxIterations = maxIteration;
        this.weights = new Array(LengthBinary);
        for(let i = 0; i < this.weights.length; i++){
            this.weights[i] = this.randomWeights();
           // console.log("weights["+i+"]= "+this.weights[i]);
        }
        
    }

  

randomWeights() {
       

        return Math.random() * (0.5 - (-0.5)) + (-0.5); // random between 0.5 and -0.5
        
}

  
activationStepFn(x){ //step fn

        return x > 0 ? 1 : 0 
}
  
predictionFn(inputArrPoints){

  //console.log(inputArrPoints);

      let sum = 0;
 

        for(let i = 0; i < this.weights.length; i++){

          sum += inputArrPoints[0][i] * this.weights[i];

         // console.log(`sum= ${sum} 
          /// inputArrPoints= ${inputArrPoints[0][i]} 
          ///weights[i]= ${this.weights[i]} `);
    
        }
        sum += threshold;
        return [this.activationStepFn(sum),inputArrPoints[0]]
}
  
TrainingFn(Points){

  let NoErrors = 0;
  for(let m = 0; m < this.maxIterations; m++){
        
    for( let i=0; i <Points.length;i++) {

          let predictOutput= this.predictionFn(Points[i]);
          let Ya= predictOutput[0];
          //console.log("backToTraining->"+"points[i][1]= "+Points[i][1] + '\n<-predictOutput=> '+predictOutput + " \n//  Ya= "+Ya);
           let Error;
            
           if(Points[i][1] === 0) { // means blue point = 0 
            Error = Yd[0] - Ya;
           }
           else  Error = Yd[1] - Ya; // means red point = 1 

          // console.log("Error= "+Error);
           if (Error === 0) {
            NoErrors++;
        }

          for(let w = 0; w < this.weights.length; w++){
            
          //  console.log("before= "+ this.weights[w]);
          //  console.log(predictOutput[1][w]); 
            this.weights[w] += Error * this.learningRates * predictOutput[1][w];
           // console.log("after= "+ this.weights[w]);

          }

    }
    
    
  }

  trainingCompleted = true;


  let accuracyTotal = (NoErrors / (Points.length * this.maxIterations)) * 100;
  //console.log("accuracy= "+accuracyTotal +"%"); 
  accuracy.innerHTML =  `<span style="font-weight: bold;"> Accuracy: ${accuracyTotal}%</span>`;
  //console.log("**** Congrats Finished Training :) **********");     
  for(let i = 0; i < this.weights.length; i++){  
   // console.log("weights["+i+"]= "+this.weights[i]);
}  
}
} // end class Perceptron





  function Train(){


    console.log(PointsXYColour);

    console.log("LR= "+learningRate.value +" /--/ MaxIt= "+maxIteraEnter.value);
    const Percept = new Perceptron(learningRate.value,maxIteraEnter.value);

    Percept.TrainingFn(PointsXYColour);
    Finalweights = Percept.weights;  
    console.log(...Finalweights);

    let slopeValue = -Finalweights[0] / Finalweights[1];
    let yInterceptPoint = -threshold / Finalweights[1];
    console.log("yIntercept= "+yInterceptPoint +"  /slope= "+slopeValue);
    let x0 = 0;
    let y0 = slopeValue * 0 + yInterceptPoint;

    let x1 = canvasDraw.width;
    let y1 = slopeValue * x1 + yInterceptPoint;


    console.log(x0,y0,x1,y1);
  
    drawLine(x0,x1,y0,y1);
    //drawLine(x0, x1, canvasDraw.height - y0, canvasDraw.height - y1);


    for (const point of PointsXYColour) {
      const x = point[0][0];
      const y = point[0][1];
      const lineY = slopeValue * x + yInterceptPoint;
    console.log(x,y);
      if (point[1] === 0) { // Blue point currently
        if (y > lineY) { // Blue point above
          bluePointAbove = true;
          blueLock = true;
          break;
        }
        else {
          bluePointAbove = false;
          blueLock = true;
          break;
        }

      }
    
    }
    
  } // end train-fn



  function Test(){
    startBtn.disabled=true;
    flagTestBtn = true;

  }


  


function PointDetecter (bluePointAbove) {
    
    if (trainingCompleted === true) {
      
      const rect = canvasDraw.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = Math.abs(event.clientY - rect.top - 400);

      const slope = -Finalweights[0] / Finalweights[1];
      const yIntercept = -threshold / Finalweights[1];

      const lineY = slope * x + yIntercept;
      let pointClassi, colori;

      if( y > lineY ) { // the current point is above line
        if(bluePointAbove === true){ // blue points are above
          pointClassi = 'blue';
          colori = '0000E7';
          classMsg.innerHTML = `<span style="font-weight: bold;"> Clicked Point: (${x}, ${y}), Class: ${pointClassi}</span>`;

        }
        else { // // blue points are below
          pointClassi = 'Red';
          colori = 'CC0000';
          classMsg.innerHTML = `<span style="font-weight: bold;"> Clicked Point: (${x}, ${y}), Class: ${pointClassi}</span>`;
        }

      }

      else{
        
        if(bluePointAbove === false){ // blue points are below
          pointClassi = 'blue';
          colori = '0000E7';
          classMsg.innerHTML = `<span style="font-weight: bold;"> Clicked Point: (${x}, ${y}), Class: ${pointClassi}</span>`;
        }
        else { // // blue points are above 
          pointClassi = 'Red';
          colori = 'CC0000';
          classMsg.innerHTML = `<span style="font-weight: bold;"> Clicked Point: (${x}, ${y}), Class: ${pointClassi}</span>`;
        }

      }

      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `#${colori}`;
      ctx.fill();

  }

}
  //BahaaFinal -- Main

  

