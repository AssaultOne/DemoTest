//----- main -----------------------------------------------------------------
const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var ArToolKitSource = new THREEx.ArToolkitSource({sourceType: "webcam"});
ArToolKitSource.init(function(){
    setTimeout(function(){
        ArToolKitSource.onResizeElement();
        ArToolKitSource.copyElementSizeTo(renderer.domElement);
    }, 2000)
});

var ArToolKitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'camera_para.dat',
    detectionMode: 'color_and_matrix',
});
ArToolKitContext.init(function(){
    camera.projectionMatrix.copy(ArToolKitContext.getProjectionMatrix());
});

var ArMarkerControls = new THREEx.ArMarkerControls(ArToolKitContext, camera, {
    type: 'pattern',
    patternUrl: 'pattern-marker.patt',
    changeMatrixMode: "cameraTransformMatrix",
});
scene.visible = false;

const geometry = new THREE.CubeGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({
    transparent: true,
    opecity: 0.5,
    side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = geometry.parameters.height / 2;
scene.add(cube);

function animate() {
    requestAnimationFrame(animate);
    ArToolKitContext.update(ArToolKitSource.domElement);
    scene.visible = camera.visible;
    renderer.render(scene, camera);
};

animate();