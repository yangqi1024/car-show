import {useState, useEffect, useRef} from 'react'
import * as THREE from 'three';
import {Space} from 'antd';
import ColorSelect from './components/color-select';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import './App.css'

function App() {
    const renderer = useRef(new THREE.WebGLRenderer({antialias: true})).current;
    const camera = useRef(new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)).current;
    const scene = useRef(new THREE.Scene()).current;
    const canvasRef = useRef(null);
    const [wheelList, setWheelList] = useState([]);
    const [bodyColor, setBodyColor] = useState('#00FF7A');
    const [detailColor, setDetailColor] = useState('#ffffff');
    const [glassColor, setGlassColor] = useState('#ffffff');
    const controls = new OrbitControls(camera, renderer.domElement);
    const bodyMaterial = useRef(new THREE.MeshPhysicalMaterial({
        color: bodyColor, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
    })).current;
    const detailsMaterial = useRef(new THREE.MeshStandardMaterial({
        color: detailColor, metalness: 1.0, roughness: 0.5
    })).current;
    const glassMaterial = useRef(new THREE.MeshPhysicalMaterial({
        color: glassColor, metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true
    })).current;
    useEffect(() => {
        bodyMaterial.color.set(bodyColor);
    }, [bodyColor]);
    useEffect(() => {
        detailsMaterial.color.set(detailColor);
    }, [detailColor]);
    useEffect(() => {
        glassMaterial.color.set(glassColor);
    }, [glassColor]);
    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop( animate );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;
        canvasRef.current.appendChild(renderer.domElement);

        window.addEventListener( 'resize', onWindowResize );
        //设置控制器
        camera.position.set(4.25, 1.4, -4.5);
        controls.enableDamping = true;
        controls.maxDistance = 9;
        controls.target.set(0, 0.5, 0);
        controls.update();

        scene.background = new THREE.Color(0xffffff);
        scene.environment = new RGBELoader().load('textures/equirectangular/venice_sunset_1k.hdr');
        scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        scene.fog = new THREE.Fog(0x333333, 10, 15);

        const shadow = new THREE.TextureLoader().load('models/gltf/ferrari_ao.png');
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('js/libs/draco/gltf/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load('models/gltf/ferrari.glb', gltf => {
            const carModel = gltf.scene.children[0];
            console.log("carModel", carModel)
            carModel.getObjectByName('body').material = bodyMaterial;

            carModel.getObjectByName('rim_fl').material = detailsMaterial;
            carModel.getObjectByName('rim_fr').material = detailsMaterial;
            carModel.getObjectByName('rim_rr').material = detailsMaterial;
            carModel.getObjectByName('rim_rl').material = detailsMaterial;
            carModel.getObjectByName('trim').material = detailsMaterial;

            carModel.getObjectByName('glass').material = glassMaterial;
            setWheelList(...[carModel.getObjectByName('wheel_fl'),
                carModel.getObjectByName('wheel_fr'),
                carModel.getObjectByName('wheel_rl'),
                carModel.getObjectByName('wheel_rr')])
            // shadow
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
                new THREE.MeshBasicMaterial({
                    map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
                })
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.renderOrder = 2;
            carModel.add(mesh);
            scene.add(carModel);
        })

    }, [])
    const onWindowResize = ()=>{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    const animate = () => {
        controls.update();
//        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    return (
        <div className="App">
            <div ref={canvasRef}></div>
            <div className="colorContainer">
                <Space>
                <ColorSelect label="车身" color={bodyColor}
                             onChange={(color) => {
                                 setBodyColor(color.hex);
                             }
                             }/>
                <ColorSelect label="轮毂" color={detailColor}
                             onChange={(color) => {
                                 setDetailColor(color.hex);
                             }
                             }/>
                <ColorSelect label="玻璃" color={glassColor}
                             onChange={(color) => {
                                 setGlassColor(color.hex);
                             }
                             }/>
                </Space>
            </div>
        </div>
    )
}

export default App
