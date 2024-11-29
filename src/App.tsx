import "./App.css";
import * as THREE from "three";
import {
  PerspectiveCamera,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function App() {
  const orbitControlsRef = useRef(null);
  const sphereRef = useRef(null);
  const [message, setMessage] = useState("");
  const [redState, setRedState] = useState({
    clicked: false,
    color: "#C15151",
    toggledColor: "#491717",
  });
  const [greenState, setGreenState] = useState({
    clicked: false,
    color: "#a7f2a7",
    toggledColor: "#254917",
  });
  const [blueState, setBlueState] = useState({
    clicked: false,
    color: "#98F5F9",
    toggledColor: "#0A1A70",
  });

  const RaycasterHandler = () => {
    const { camera, scene, gl } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const pointer = useRef(new THREE.Vector2());
    useEffect(() => {
      const handlePointerMove = (event: MouseEvent | TouchEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        let clientX: number, clientY: number;

        if (event instanceof MouseEvent) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else if (event instanceof TouchEvent) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          return;
        }

        pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      };

      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("touchmove", handlePointerMove);

      return () => {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("touchmove", handlePointerMove);
      };
    }, [gl.domElement]);

    useFrame(() => {
      raycaster.current.setFromCamera(pointer.current, camera);
    });

    useEffect(() => {
      const handleTouchStartOrClick = () => {
        raycaster.current.setFromCamera(pointer.current, camera);
        const intersects = raycaster.current.intersectObjects(
          scene.children,
          true
        );

        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          setMessage(`You clicked on: ${clickedObject.name}`);

          switch (clickedObject.name) {
            case "floor":
              break;
            case "Red ball":
              if (redState.clicked) {
                transObjY(clickedObject, -1);
                setRedState({ ...redState, clicked: false });
              } else {
                transObjY(clickedObject, 1);
                setRedState({ ...redState, clicked: true });
              }
              break;
            case "Blue ball":
              if (blueState.clicked) {
                transObjY(clickedObject, -1);
                setBlueState({ ...blueState, clicked: false });
              } else {
                transObjY(clickedObject, 1);
                setBlueState({ ...blueState, clicked: true });
              }
              break;
            case "Green ball":
              if (greenState.clicked) {
                transObjY(clickedObject, -1);
                setGreenState({ ...greenState, clicked: false });
              } else {
                transObjY(clickedObject, 1);
                setGreenState({ ...greenState, clicked: true });
              }
              break;
          }
        }
      };

      window.addEventListener("click", handleTouchStartOrClick);
      window.addEventListener("touchstart", handleTouchStartOrClick);
      return () => {
        window.removeEventListener("click", handleTouchStartOrClick);
        window.removeEventListener("touchstart", handleTouchStartOrClick);
      };
    }, [scene]);

    return null;
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row justify-center items-center min-w-0 w-screen h-screen bg-slate-300">
        <Canvas
          id="three-canvas-container"
          shadows
          className="flex-1"
          onTouchStart={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          <RaycasterHandler />
          <PerspectiveCamera makeDefault position={[0, 1, 5]} />
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            minPolarAngle={anglesToRadians(60)}
            maxPolarAngle={anglesToRadians(80)}
          />
          <mesh
            position={[0, 0.5, 0]}
            castShadow
            ref={sphereRef}
            name="Blue ball"
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={
                blueState.clicked ? blueState.toggledColor : blueState.color
              }
            />
          </mesh>
          <mesh
            position={[2, 0.5, 0]}
            castShadow
            ref={sphereRef}
            name="Green ball"
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={
                greenState.clicked ? greenState.toggledColor : greenState.color
              }
            />
          </mesh>
          <mesh
            position={[-2, 0.5, 0]}
            castShadow
            ref={sphereRef}
            name="Red ball"
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={redState.clicked ? redState.toggledColor : redState.color}
            />
          </mesh>
          <mesh
            rotation={[anglesToRadians(-90), 0, 0]}
            receiveShadow
            name="Floor"
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
              color={"#686D34"}
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
              <meshBasicMaterial side={THREE.BackSide} color="#6A6C53" />
            </mesh>
          </Environment>
        </Canvas>
        <div className="p-6 md:min-w-[250px] grid place-items-center">
          <span className="font-bold text-lg">Message:</span>
          <span className="font-semibold">{message}</span>
        </div>
      </div>
    </>
  );
}
export default App;

export const anglesToRadians = (degree: number) => degree * (Math.PI / 180);
export const transObjY = (
  obj: THREE.Object3D<THREE.Object3DEventMap>,
  yDelta: number
) => {
  if (obj.position.y + yDelta < 0.5) {
    gsap.to(obj.position, {
      y: 0.5,
      duration: 0.5,
      ease: "power1.out",
    });
  } else if (obj.position.y + yDelta > 1.5) {
    gsap.to(obj.position, {
      y: 1.5,
      duration: 0.5,
      ease: "power1.out",
    });
  } else {
    gsap.to(obj.position, {
      y: obj.position.y + yDelta,
      duration: 0.5,
      ease: "power1.out",
    });
  }
};
