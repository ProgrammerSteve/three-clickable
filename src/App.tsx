import "./App.css";
import * as THREE from "three";
import {
  PerspectiveCamera,
  OrbitControls,
  Environment,
  useTexture,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "./components/ui/button";
function App() {
  const orbitControlsRef = useRef(null);
  const sphereRef = useRef(null);
  const [message,setMessage]=useState("")

  // Raycasting logic
  const RaycasterHandler = () => {
    const { camera, scene, gl } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const pointer = useRef(new THREE.Vector2());
  
    useEffect(() => {
      const handlePointerMove = (event: MouseEvent) => {
        // Convert mouse coordinates to normalized device coordinates (-1 to +1)
        pointer.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
        pointer.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
      };
  
      window.addEventListener("mousemove", handlePointerMove);
  
      return () => {
        window.removeEventListener("mousemove", handlePointerMove);
      };
    }, [gl.domElement]);
  
    useFrame(() => {
      // Update the raycaster based on the latest pointer and camera
      raycaster.current.setFromCamera(pointer.current, camera);
    });
  
    useEffect(() => {
      const handleClick = () => {
        // Use the updated raycaster
        const intersects = raycaster.current.intersectObjects(scene.children, true);
  
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
        setMessage(`You clicked on: ${clickedObject.name}`);
        console.log("Clicked on:", clickedObject.name);

        if(clickedObject.name!="floor"){
          gsap.to(clickedObject.position, {
            y: clickedObject.position.y + 1, // Lift the sphere by 1 unit
            duration: 0.5,
            ease: "power1.out",
          });
        }

       
        }
      };
  
      window.addEventListener("click", handleClick);
  
      return () => {
        window.removeEventListener("click", handleClick);
      };
    }, [scene]);
  
    return null;
  };
  

  return (
    <>
      <div className="border-red-600 border-4 border-solid flex justify-center items-center min-w-0 w-screen h-screen">
        <Canvas id="three-canvas-container" shadows className="flex-1">
          <RaycasterHandler />
          <PerspectiveCamera makeDefault position={[0, 1, 5]} />
          <OrbitControls
            ref={orbitControlsRef}
            minPolarAngle={anglesToRadians(60)}
            maxPolarAngle={anglesToRadians(80)}
          />

          <mesh position={[0, 0.5, 0]} castShadow ref={sphereRef} name="Blue ball">
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={"#98F5F9"} />
          </mesh>

          <mesh position={[2, 0.5, 0]} castShadow ref={sphereRef} name="Green ball">
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={"#a7f2a7"} />
          </mesh>
          <mesh position={[-2, 0.5, 0]} castShadow ref={sphereRef} name="Red ball">
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={"#C15151"} />
          </mesh>

          <mesh rotation={[anglesToRadians(-90), 0, 0]} receiveShadow name="floor">
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
              color={"#1b4f3a"}
              metalness={0.1}
              roughness={0.1}
            />
          </mesh>

          <ambientLight args={["#fffff", 0.1]} />
          <directionalLight args={["#fffff", 0.3]} position={[-4, 1, 2]} />
          <pointLight args={["#fffff", 0.2]} position={[-4, 1, 2]} />
          <spotLight
            args={["#ad2525f", 1]}
            position={[2, 2, 2]}
            penumbra={0.2}
            decay={0.5}
            castShadow
          />

          <Environment background>
            <mesh>
              <sphereGeometry args={[50, 100, 10]} />
              <meshBasicMaterial side={THREE.BackSide} color="#296777" />
            </mesh>
          </Environment>
        </Canvas>
        <div className="flex-1 grid place-items-center">
          <span>Message:</span>
          <span>
          {message}
          </span>
          </div>
      </div>
    </>
  );
}

export default App;

export const anglesToRadians = (degree: number) => degree * (Math.PI / 180);
