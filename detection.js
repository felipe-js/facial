const cam = document.querySelector('#video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models')
]).then(startVideo)
async function startVideo () {
  let constraints = {video: true} 
    try {
    let stream = await navigator.mediaDevices.getUserMedia(constraints)
    cam.srcObject = stream
    cam.onloademetadata = () => {
      cam.play();
    }
    console.log(stream)
    } catch (error) {
      console.error(error)
    }
}
startVideo()
cam.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(cam)
  document.body.append(canvas)
  const displaySize = { width: cam.width, height: cam.height }
  faceapi.matchDimensions(canvas, displaySize)
  
  setInterval( async () => {
    const detections = await faceapi.detectAllFaces(cam,
      new faceapi.TinyFaceDetectorOptions()
      )
    .withFaceLandmarks()
    .withFaceExpressions()
    // console.log(detections)
    
    const resizeDetections = faceapi.resizeResults(detections, displaySize)
    
    canvas.getContext('2d').clearReact(0, 0, canvas.width, canvas.height) //3d
    
    faceapi.draw.drawDetections(canvas, resizeDetections) 
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections) 
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections) 
  }, 100);
})