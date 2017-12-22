var canvas = document.getElementById("canvas");

window.onresize = resizeCanvas;
resizeCanvas();

var scene = new Scene(canvas);

render();

function render() {
    requestAnimationFrame(render);
    scene.update();
}

function resizeCanvas() {
    var canvas = document.getElementById("canvas");
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    if(scene)
        scene.onWindowResize();
}

function Scene(canvas) {  
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    // used to move the light
    var time = 0;

    var width = canvas.width;
    var height = canvas.height;
  
    var scene = new THREE.Scene();
    scene.background = new THREE.Color("#202020");

    var light = buildLights(scene);
    var camera = buildCamera(width, height);
    var renderer = buildRender(width, height);
    var mesh = addObjects(scene);

    function buildLights(scene) {      
        var light = new THREE.SpotLight("#fff", 0.8);
        light.position.y = 100;

        light.angle = 1.05;

        light.decacy = 2;
        light.penumbra = 1;

        light.shadow.camera.near = 10;
        light.shadow.camera.far = 1000;
        light.shadow.camera.fov = 30;

        scene.add(light);

        return light;
    }

    function buildCamera(width, height) {
        var aspectRatio = width / height;
        var fieldOfView = 60;
        var nearPlane = 1;
        var farPlane = 5000; 
        var camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.z = 100;

        return camera;
    }

    function buildRender(width, height) {
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        return renderer;
    }
  
    function addObjects(scene) {
        var geometry = new THREE.IcosahedronGeometry(30, 5);
        var material = new THREE.MeshStandardMaterial({ color: "#444", transparent: true, side: THREE.DoubleSide, alphaTest: 0.5, opacity: 1, roughness: 1 });
        
        // this image is loaded as data uri. Just copy and paste the string contained in "image.src" in your browser's url bar to see the image.
        // alpha texture used to regulate transparency 
        var image = document.createElement('img');
        var alphaMap = new THREE.Texture(image);
        image.onload = function()  {
            alphaMap.needsUpdate = true;
        };
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';
        material.alphaMap = alphaMap;
        material.alphaMap.magFilter = THREE.NearestFilter;
        material.alphaMap.wrapT = THREE.RepeatWrapping;
        material.alphaMap.repeat.y = 1;

        var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.z = -Math.PI/4;

        scene.add(mesh);
        return mesh;
    }
  
    this.update = function() {
        time++;

        // move the light
        light.position.x = Math.sin(time*0.01)*200;

        // offset the texture
        mesh.material.alphaMap.offset.y = time*0.0015;

        renderer.clear();
        renderer.render(scene, camera);
    };

    this.onWindowResize = function() {
        var canvas = document.getElementById("canvas");
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        canvas.width = width;
        canvas.height = height;

        camera = buildCamera(width, height);
        
        renderer.setSize(width, height);
    }
}