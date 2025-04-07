import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({width: 360})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * GALAXY 
 */
const parameters = {}; 
parameters.count = 100000;
parameters.size = 0.01; 
// galaxy
parameters.radius = 5; 
parameters.branches = 3; 
parameters.spin = 1; 
parameters.randomness = 0.2; 
parameters.randomnessPower = 3; 

//colours
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let geometry = null // declaring outside function generateGalaXY SO i can destroy it everytime onFinishChange GUI 
let material  = null 
let points = null 
/*
const generateGalaxy = () => {
    //destroy old geometry 
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3; 
        // fill it with random values
        positions[i3 + 0] = (Math.random()-0.5)*3; //x 
        positions[i3 + 1] = (Math.random()-0.5)*3; //y
        positions[i3 + 2] = (Math.random()-0.5)*3; //z
    }
    // console.log(positions); // it goes from 0 to 3000 particles as I have 1000 * 3 particles 
    geometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
        ); // how many values per vertex is 3, that's why its 3
    // material 
    material = new THREE.PointsMaterial({
        size: parameters.size, 
        sizeAttenuation: true, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending
    })
    // points 
    points = new THREE.Points(geometry, material);
    scene.add(points);
}
*/
const generateGalaxy = () => {
    //destroy old geometry 
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3);

    const colors = new Float32Array(parameters.count * 3); //r,g,b

    //instance of 3JS colour
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    //console.log(colorInside); // you get a color class and you get values r,g,b
    
    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3; 

        //position 
        const radius = Math.random()*parameters.radius; //if parameters.radius = 5, you get 0-5 values - this is the varying x position
        //const branchAngle =  i % parameters.branches; // modulo 0, 1, 2, 0, 1, 2...
        //if (i<20) console.log(i, branchAngle); // modulo 0, 1, 2, 0, 1, 2...
        //spin value is more - further from the centre 
        const spinAngle = radius * parameters.spin; 
        //bruno likes values from 0 to 1 
        const branchAngle =  (i % parameters.branches) / parameters.branches * Math.PI * 2; // full cirlcle is 2PI so we need to get the value in angles to do a full circle

        // get random value for each axis 
        //most of the particles to stay at the base position - lot at the centre, less at the outer -> to create a feather effect
        // randomly multiply values by -0.1
        //more randomNess Power makes the shape more obvious - making it less random
        //pow only on positive values so values between 0 and 1 
        const randomX = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random() < 0.5 ? 1: -1); 
        const randomY = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random() < 0.5 ? 1: -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random() < 0.5 ? 1: -1); 
        // fill it with random values
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX //x 
        positions[i3 + 1] = 0 + randomY; //y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //z

        //colors 

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, Math.random()*radius)
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

    }
    // console.log(positions); // it goes from 0 to 3000 particles as I have 1000 * 3 particles 
    geometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
        ); // how many values per vertex is 3, that's why its 3

    //colours attribute
    geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(colors, 3)
        ); // how many values per vertex is 3, that's why its 3
    
    // material 
    material = new THREE.PointsMaterial({
        size: parameters.size, 
        sizeAttenuation: true, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending, 
        vertexColors: true
        //color: ''
    })
    // points 
    points = new THREE.Points(geometry, material);
    scene.add(points);
}
generateGalaxy(); 

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-10).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()