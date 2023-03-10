const container = document.getElementById("container")

const MODEL_PATH = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4"
const EXAMPLE_IMG = document.getElementById("exampleImg")

let movenet = 0

async function loadAndRunModel(){
    movenet = await tf.loadGraphModel(MODEL_PATH, {fromTFHub: true})



    // let exampleInputTensor = tf.zeros([1,192,192,3], 'int32')
    let imageTensor = tf.browser.fromPixels(EXAMPLE_IMG)

    let cropStartPoint = [15, 170, 0]
    let cropSize = [345, 345, 3]
    let croppedTensor = tf.slice(imageTensor, cropStartPoint, cropSize)

    let resizedTensor = tf.image.resizeBilinear(croppedTensor, [192,192], true).toInt()

    let tensorOutput = movenet.predict(tf.expandDims(resizedTensor))

    let tensorSqueeze = tensorOutput.squeeze()
    
    // let tensorflowOutput = movenet.predict(exampleInputTensor)
    let arrayOutput = await tensorSqueeze.array()

    arrayOutput.map(item => {
        const x = item[1] * 345 + 170
        const y = item[0] * 345 + 15

        const p = document.createElement("div")
        p.setAttribute("class", "point")
        p.style.left = `${x}px`
        p.style.top = `${y}px`

        container.appendChild(p)
    })
    imageTensor.dispose()
    croppedTensor.dispose()
    resizedTensor.dispose()
    tensorOutput.dispose()
    tensorSqueeze.dispose()
    movenet.dispose()
}

loadAndRunModel()