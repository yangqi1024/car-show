import {useState, useEffect, useRef} from 'react'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import './App.css'

function App() {
    const renderer = useRef(new THREE.WebGLRenderer()).current;
    const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)).current;
    const scene = useRef(new THREE.Scene()).current;
    const canvasRef = useRef(null);
    const controls = new OrbitControls( camera, renderer.domElement );
    useEffect(() => {
        console.log("window.innerWidth",window.innerWidth)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        controls.update();
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);
        animate();
    }, [])
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    return (
        <div className="App" id="canvasId" ref={canvasRef}>

        </div>
    )
}

export default App
